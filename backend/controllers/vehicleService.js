// const { deleteVehicle } = require('../../frontend/src/utils/api');
const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES //
const occupiedCoordinates = new Map();

// STOP SIGN AND INTERSECTION COORDINATES //
const stopSignCoordinates = [
    { x: 625, y: 750 },
    { x: 250, y: 625 },
    { x: 375, y: 250 },
    { x: 750, y: 375 },
];

const intersectionCoordinates = [
    { x: 657, y: 719 },
    { x: 688, y: 688 },
    { x: 719, y: 657 },
    { x: 625, y: 625 },
    { x: 625, y: 500 },
    { x: 625, y: 375 },
    { x: 500, y: 375 },
    { x: 282, y: 657 },
    { x: 313, y: 688 },
    { x: 344, y: 719 },
    { x: 375, y: 625 },
    { x: 500, y: 625 },
    { x: 344, y: 282 },
    { x: 313, y: 313 },
    { x: 282, y: 344 },
    { x: 375, y: 375 },
    { x: 375, y: 500 },
    { x: 719, y: 344 },
    { x: 688, y: 313 },
    { x: 657, y: 282 },
];

// INITIALIZE STOP SIGN QUEUES //
const stopSignQueues = new Map();

// COMBINE STOP SIGN AND INTERSECTION COORDINATES //
const allQueueCoordinates = stopSignCoordinates.concat(intersectionCoordinates);

// INITIALIZE QUEUES FOR ALL COORDINATES //
allQueueCoordinates.forEach(coord => {
    const key = `${coord.x},${coord.y}`;
    stopSignQueues.set(key, []);
});

// FUNCTION TO CHECK IF COORDINATE IS A STOP SIGN //
const isStopSignCoordinate = (coordinate) => {
    return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
};

// FUNCTION TO CHECK IF COORDINATE IS PART OF THE INTERSECTION //
const isIntersectionCoordinate = (coordinate) => {
    return intersectionCoordinates.some(intersectionCoord => intersectionCoord.x === coordinate.x && intersectionCoord.y === coordinate.y);
};

// FUNCTION TO CHECK IF INTERSECTION IS OCCUPIED //
const isIntersectionOccupied = () => {
    return intersectionCoordinates.some(coord => {
        const coordKey = `${coord.x},${coord.y}`;
        return occupiedCoordinates.has(coordKey);
    });
};



// CENTRALIZED UPDATE LOOP TO UPDATE ALL VEHICLES //
const updateVehicles = async () => {
    const vehicles = await Vehicle.find({ isSeed: false });
    for (const vehicle of vehicles) {
        await updateVehiclePosition(vehicle);
    }
};



// START THE UPDATE LOOP //
setInterval(updateVehicles, 1000); // UPDATE EVERY SECOND //



// FUNCTION TO UPDATE AN INDIVIDUAL VEHICLE'S POSITION //
const updateVehiclePosition = async (vehicle) => {
    const path = vehicle.path;
    if (!path || path.length === 0) {
        console.warn(`Vehicle ${vehicle._id} has no path. Skipping.`);
        return;
    }

    let currentIndex = vehicle.currentIndex;

    if (currentIndex >= path.length - 1) {
        // Vehicle has reached the end of its path
        occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
        await deleteVehicle(vehicle._id);
        return;
    }

    // Check if vehicle is waiting
    if (vehicle.isWaiting) {
        if (vehicle.waitUntil && new Date() >= vehicle.waitUntil) {
            // Wait time is over
            vehicle.isWaiting = false;
            vehicle.waitUntil = null;
        } else {
            // Still waiting
            return;
        }
    }

    const nextIndex = currentIndex + 1;
    const nextPosition = path[nextIndex];
    const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

    // Check if the next position is occupied
    if (occupiedCoordinates.has(nextCoordKey)) {
        // Can't move, position is occupied
        return;
    }

    // Determine if the current position is a stop sign
    const isAtStopSign = isStopSignCoordinate(vehicle.currentPosition);

    if (isAtStopSign) {
        // Handle stop sign logic
        const queueKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
        const queue = stopSignQueues.get(queueKey);

        if (!queue.includes(vehicle._id)) {
            queue.push(vehicle._id);
        }

        if (queue[0] !== vehicle._id) {
            // Not the vehicle's turn to move
            return;
        }

        // Check if the intersection is occupied
        if (isIntersectionOccupied()) {
            // Intersection is occupied, wait
            return;
        }

        // Vehicle can proceed
        queue.shift();

        // Optional: Set waiting time at the stop sign
        vehicle.isWaiting = true;
        vehicle.waitUntil = new Date(Date.now() + 3000); // Wait for 3 seconds
    }

    // Update occupancy map
    occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
    occupiedCoordinates.set(nextCoordKey, vehicle._id);

    // Move the vehicle
    vehicle.currentPosition = nextPosition;
    vehicle.currentIndex = nextIndex;

    await vehicle.save();

    // Emit the update to clients
    const io = socket.getIo();
    io.emit('updateVehicle', vehicle);
};



// FUNCTION TO DELETE VEHICLE //
const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();

    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT //
    for (const [coordKey, id] of occupiedCoordinates.entries()) {
        if (id.toString() === vehicleId.toString()) {
            occupiedCoordinates.delete(coordKey);
            break;
        }
    }

    // REMOVE VEHICLE FROM ANY STOP SIGN QUEUE //
    for (const queue of stopSignQueues.values()) {
        const index = queue.indexOf(vehicleId);
        if (index !== -1) {
            queue.splice(index, 1);
            break;
        }
    }

    await Vehicle.findByIdAndDelete(vehicleId);

    // EMIT THE REMOVE VEHICLE EVENT TO CLIENTS //
    io.emit('removeVehicle', vehicleId);
};



// FUNCTION TO CREATE VEHICLE //
const createVehicle = async (vehicleData) => {
    const io = socket.getIo();

    // ENSURE VEHICLEDATA.CURRENTPOSITION IS SET //
    if (!vehicleData.currentPosition) {
        if (vehicleData.path && vehicleData.path.length > 0) {
            vehicleData.currentPosition = vehicleData.path[0];
        } else {
            vehicleData.currentPosition = { x: 0, y: 0 };
        }
    }

    // SET INITIAL CURRENTINDEX AND STATE //
    vehicleData.currentIndex = 0;
    vehicleData.isWaiting = false;
    vehicleData.waitUntil = null;

    const initialCoordKey = `${vehicleData.currentPosition.x},${vehicleData.currentPosition.y}`;
    if (occupiedCoordinates.has(initialCoordKey)) {
        throw new Error('Cannot create vehicle at an occupied coordinate.');
    }

    // CREATE A NEW VEHICLE INSTANCE //
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // UPDATE THE OCCUPANCY MAP //
    occupiedCoordinates.set(initialCoordKey, vehicle._id);

    // EMIT THE NEW VEHICLE TO CLIENTS //
    io.emit('newVehicle', vehicle);

    return vehicle;
};



module.exports = {
    createVehicle, deleteVehicle
};