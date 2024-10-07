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
stopSignCoordinates.forEach(coord => {
    const key = `${coord.x},${coord.y}`;
    stopSignQueues.set(key, []);
});

// FUNCTION TO CHECK IF COORDINATE IS A STOP SIGN //
const isStopSignCoordinate = (coordinate) => {
    return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
};

// FUNCTION TO CHECK IF COORDINATE IS PART OF TEH INTERSECTION //
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

const moveVehicle = async (vehicleId) => {
    // GET THE VEHICLE AND ITS PATH //
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const path = vehicle.path;
    let index = path.findIndex(pos => pos.x === vehicle.currentPosition.x && pos.y === vehicle.currentPosition.y);

    // INITIAL OCCUPANCY UPDATE //
    let currentCoordKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
    occupiedCoordinates.set(currentCoordKey, vehicleId);

    // DECLARE VARIABLES ACCESSIBLE TO NESTED FUNCTIONS //
    let nextIndex;
    let nextPosition;
    let nextCoordKey;

    // FUNCTION TO PROCEED OT NEXT POSITION //
    const proceedToNextPosition = async () => {
        // UPDATE OCCUPANCY MAP //
        occupiedCoordinates.delete(currentCoordKey);
        occupiedCoordinates.set(nextCoordKey, vehicleId);

        // MOVE THE VEHICLE //
        vehicle.currentPosition = nextPosition;
        await vehicle.save();

        // EMIT THE UPDATE TO CLIENTS //
        const io = socket.getIo();
        io.emit('updateVehicle', vehicle);

        // UPDATE INDEX AND CURRENTCOORDKEY //
        index = nextIndex;
        currentCoordKey = nextCoordKey;

        // SCHEDULE THE NEXT MOVE //
        setTimeout(moveNext, 1000);
    };



    // FUNCTION TO CHECK IF VEHICLE CAN PROCEED //
    const canProceed = async () => {
        const stopSignKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
        const queue = stopSignQueues.get(stopSignKey);

        // CHECK IF VEHICLE IS FIRST IN QUEUE //
        if (queue[0] !==vehicleId) {
            // WAIT AND RETRY //
            setTimeout(canProceed, 500);
            return;
        }

        // CHECK IF INTERSECTION IS CLEAR //
        if (isIntersectionOccupied()) {
            //WAIT AND RETRY //
            setTimeout(canProceed, 500);
            return;
        }

        // REMOVE VEHICLE FROM STOP SIGN QUEUE //
        queue.shift();

        // PROCEED TO NEXT POSITION //
        await proceedToNextPosition();
    };



    // FUNCTION TO MOVE TO NEXT POSITION //
    const moveNext = async () => {
        if (index < path.length -1) {
            const nextIndex = index + 1;
            const nextPosition = path[nextIndex];
            const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

            // CHECK IF THE NEXT COORDINATE IS UNOCCUPIED //
            if (!occupiedCoordinates.has(nextCoordKey)) {
                const isStopSign = isStopSignCoordinate(nextPosition);

                if (isStopSign) {
                    // ADD VEHICLE TO STOP SIGN QUEUE //
                    const stopSignKey = `${nextPosition.x},${nextPosition.y}`;
                    const queue = stopSignQueues.get(stopSignKey);
                    if (!queue.includes(vehicleId)) {
                        queue.push(vehicleId);
                    }

                    // MOVE TO THE STOP SIGN POSITION //
                    await proceedToNextPosition();

                    // WAIT FOR 3 SECONDS AT THE STOP SIGN //
                    setTimeout(canProceed, 3000);
                } else if (isIntersectionCoordinate(nextPosition)) {
                    // CHECK RIGHT OF WAY RULES //
                    await canProceed();
                } else {
                    // REGULAR MOVEMENT //
                    await proceedToNextPosition();
                }
            } else {
                // NEXT COORDINATE IS OCCUPIED; WAIT AND RETRY //
                setTimeout(moveNext, 500);
            }
        } else {
            // VEHICLE HAS REACHED TEH END OF ITS PATH //
            occupiedCoordinates.delete(currentCoordKey);
            await deleteVehicle(vehicle._id);
        }
    };

    // START THE MEVEMENT LOOP //
    setTimeout(moveNext, 1000);
};



// FUNCTION TO DELETE VEHICLE //
const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();
    await Vehicle.findByIdAndDelete(vehicleId);

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

    // EMIT THE REMOVE VEHICLE EVENT TO CLIENTS //
    io.emit('removeVehicle', vehicleId);
};



// FUNCTION TO CREATE VEHICLE //
const createVehicle = async (vehicleData) => {
    const io = socket.getIo();
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

    // START MOVING THE VEHICLE //
    moveVehicle(vehicle._id);

    return vehicle;
};



module.exports = {
    moveVehicle, deleteVehicle, createVehicle
};