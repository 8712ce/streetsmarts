const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/collisionUtils');
const Pedestrian = require('../models/pedestrian');
const { deletePedestrian } = require('./pedestrianService');
const { handleVehiclePedestrianCollision } = require('../utils/collisionHandlers');

// DESTRUCTURE IMPORTS FROM COLLISION UTILS //
const {
    occupiedCoordinates,
    stopSignCoordinates,
    stopSignQueues,
    addOccupant,
    removeOccupant,
    isStopSignCoordinate,
    isIntersectionCoordinate,
    isIntersectionOccupied,
} = collisionUtils;

const occupancyMap = occupiedCoordinates.stopSign;
const simulationType = 'stopSign';

// CENTRALIZED UPDATE LOOP TO UPDATE ALL VEHICLES
const updateVehicles = async () => {
    const vehicles = await Vehicle.find({ isSeed: false, simulationType: 'stopSign' });
    for (const vehicle of vehicles) {
        await updateVehiclePosition(vehicle);
    }
};



// START THE UPDATE LOOP
// setInterval(updateVehicles, 1000); // Update every second



// FUNCTIONS TO START AND STOP THE UPDATE LOOP //
let stopSignUpdateInterval = null;

const startStopSignUpdateLoop = () => {
    if (!stopSignUpdateInterval) {
        stopSignUpdateInterval = setInterval(updateVehicles, 1000);
        console.log('Stop sign update loop started.');
    }
};

const stopStopSignUpdateLoop = () => {
    if (stopSignUpdateInterval) {
        clearInterval(stopSignUpdateInterval);
        stopSignUpdateInterval = null;
        console.log('Stop sign update loop stopped.');
    }
};



// FUNCTION TO UPDATE AN INDIVIDUAL VEHICLE'S POSITION
const updateVehiclePosition = async (vehicle) => {
    const path = vehicle.path;

    if (!path || path.length === 0) {
        console.warn(`Vehicle ${vehicle._id} has no path. Skipping.`);
        return;
    }

    let currentIndex = vehicle.currentIndex;

    if (currentIndex >= path.length - 1) {
        // Vehicle has reached the end of its path
        console.log(`Vehicle ${vehicle._id} has reached the end of its path. Deleting vehicle.`);
        // occupancyMap.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
        removeOccupant(simulationType, `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`, vehicle._id);
        await deleteVehicle(vehicle._id);
        return;
    }

    const nextIndex = currentIndex + 1;
    const nextPosition = path[nextIndex];
    const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

    // Waiting Logic
    if (vehicle.isWaiting) {
        // Check if minimum stop duration has passed
        if (vehicle.waitUntil && Date.now() < vehicle.waitUntil) {
            console.log(
                `Vehicle ${vehicle._id} is waiting at stop sign until ${new Date(
                    vehicle.waitUntil
                ).toLocaleTimeString()}.`
            );
            return;
        }

        // Re-check if the vehicle is first in the queue (safety measure)
        const queueKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
        const queue = stopSignQueues.get(queueKey) || [];

        if (queue[0] !== vehicle._id.toString()) {
            // Not first in queue, continue waiting
            console.log(`Vehicle ${vehicle._id} is still waiting at stop sign ${queueKey}. Queue:`, queue);
            return;
        }

        // Check if the intersection is occupied
        if (isIntersectionOccupied(simulationType, [`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`])) {
            console.log(`Intersection is occupied. Vehicle ${vehicle._id} must wait.`);
            return;
        }

        // Vehicle can proceed
        console.log(`Vehicle ${vehicle._id} is proceeding from stop sign at ${queueKey}`);

        // Remove the vehicle from the queue
        queue.shift();
        console.log(`Queue at ${queueKey} after shift:`, queue);

        vehicle.isWaiting = false;
        vehicle.waitUntil = null;
    }

    // MOVEMENT LOGIC //
    // CHECK IF THE NEXT POSITION IS OCCUPIED //
    if (occupancyMap.has(nextCoordKey)) {
        const occupant = occupancyMap.get(nextCoordKey);

        if (occupant.entityType === 'vehicle') {
            // COLLISION WITH ANOTHER VEHICLE, PREVENT MOVE //
            console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} becuase it is occupied by another vehicle ${occupant.entityId}.`);
            return;
        } else if (occupant.entityType === 'pedestrian') {
            const timeOccupied = Date.now() - occupant.occupiedAt;
            if (timeOccupied >= 2000) {
                // PEDESTRIAN HAS BEEN THERE FOR 2 SECONDS OR MORE, PREVENT MOVE //
                console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} becuase pedesetrian ${occupant.entityId} has been there for ${timeOccupied}ms.`);
                return;
            } else {
                // PEDESTRIAN HAS BEEN THERE FOR LESS THAN 2 SECONDS, ALLOW MOVE //
                await handleVehiclePedestrianCollision(vehicle, occupant, simulationType);
            }
        } else {
            // UNKNOWN ENTITY TYPE, PREVENT MOVE FOR SAFETY //
            console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by an unknown entity type.`);
            return;
        }
    }
    // if (occupancyMap.has(nextCoordKey)) {
    //     // CAN'T MOVE, POSITION IS OCCUPIED //
    //     console.log(
    //         `Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by vehicle ${occupancyMap.get(
    //             nextCoordKey
    //         )}.`
    //     );
    //     return;
    // }

    // Check if the next position is part of the intersection
    const isNextPositionIntersection = isIntersectionCoordinate(nextPosition);

    if (
        isNextPositionIntersection &&
        isIntersectionOccupied(simulationType, [`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`])
    ) {
        // Intersection is occupied, cannot proceed
        console.log(
            `Intersection is occupied. Vehicle ${vehicle._id} cannot move to (${nextPosition.x}, ${nextPosition.y}).`
        );
        return;
    }

    // Move the vehicle
    // Remove from old position in occupancy map
    // occupancyMap.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
    removeOccupant(simulationType, `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`, vehicle._id);


    // Update vehicle's position and index
    vehicle.currentPosition = nextPosition;
    vehicle.currentIndex = nextIndex;

    // Add to new position in occupancy map
    // occupancyMap.set(nextCoordKey, vehicle._id);
    addOccupant(simulationType, nextCoordKey, {
        entityId: vehicle._id,
        entityType: 'vehicle',
        occupiedAt: Date.now()
    });

    await vehicle.save();

    // EMIT THE UPDATE TO CLIENTS //
    const io = socket.getIo();
    // io.emit('updateVehicle', vehicle);
    io.to(simulationType).emit('updateVehicle', vehicle);

    // Log movement
    console.log(
        `Vehicle ${vehicle._id} moved to position (${nextPosition.x}, ${nextPosition.y}). Current index: ${vehicle.currentIndex}`
    );

    // Stop Sign Logic (After Movement)
    const isAtStopSign = isStopSignCoordinate(vehicle.currentPosition);

    if (isAtStopSign && !vehicle.isWaiting) {
        const queueKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
        let queue = stopSignQueues.get(queueKey);

        if (!queue) {
            queue = [];
            stopSignQueues.set(queueKey, queue);
        }

        const vehicleIdStr = vehicle._id.toString();

        if (!queue.includes(vehicleIdStr)) {
            queue.push(vehicleIdStr);
            console.log(`Vehicle ${vehicleIdStr} added to queue at ${queueKey}. Queue:`, queue);
        }

        // Set the vehicle to waiting state and set waitUntil for minimum stop duration
        vehicle.isWaiting = true;
        vehicle.waitUntil = Date.now() + 3000; // 3 seconds

        // Save the vehicle state
        await vehicle.save();

        // Do not proceed further in this update cycle
        return;
    }
};



// FUNCTION TO DELETE VEHICLE
const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();

    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT
    // for (const [coordKey, id] of occupancyMap.entries()) {
    //     if (id.toString() === vehicleId.toString()) {
    //         occupancyMap.delete(coordKey);
    //         break;
    //     }
    // }
    for (const [coordKey, occupant] of occupancyMap.entries()) {
        if (occupant.entityId.toString() === vehicleId.toString() && occupant.entityType === 'vehicle') {
            occupancyMap.delete(coordKey);
            break;
        }
    }    

    // REMOVE VEHICLE FROM ANY STOP SIGN QUEUE
    for (const queue of stopSignQueues.values()) {
        const index = queue.indexOf(vehicleId.toString());
        if (index !== -1) {
            queue.splice(index, 1);
            break;
        }
    }

    await Vehicle.findByIdAndDelete(vehicleId);

    // EMIT THE REMOVE VEHICLE EVENT TO CLIENTS //
    // io.emit('removeVehicle', vehicleId);
    io.to(simulationType).emit('removeVehicle', vehicleId);
};



// FUNCTION TO CREATE VEHICLE
const createVehicle = async (vehicleData) => {
    const io = socket.getIo();

    // ENSURE vehicleData.currentPosition IS SET
    if (!vehicleData.currentPosition) {
        if (vehicleData.path && vehicleData.path.length > 0) {
            vehicleData.currentPosition = vehicleData.path[0];
        } else {
            vehicleData.currentPosition = { x: 0, y: 0 };
        }
    }

    // SET INITIAL currentIndex AND STATE //
    vehicleData.currentIndex = 0;
    vehicleData.isWaiting = false;
    vehicleData.waitUntil = null;

    // ENSURE SIMULATION TYPE IS SET //
    if (!vehicleData.simulationType) {
        vehicleData.simulationType = 'stopSign';
    }

    const initialCoordKey = `${vehicleData.currentPosition.x},${vehicleData.currentPosition.y}`;
    if (occupancyMap.has(initialCoordKey)) {
        throw new Error('Cannot create vehicle at an occupied coordinate.');
    }

    // CREATE A NEW VEHICLE INSTANCE
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // UPDATE THE OCCUPANCY MAP
    // occupancyMap.set(initialCoordKey, vehicle._id);
    addOccupant(simulationType, initialCoordKey, {
        entityId: vehicle._id,
        entityType: 'vehicle',
        occupiedAt: Date.now()
    });

    // EMIT THE NEW VEHICLE TO CLIENTS //
    // io.emit('newVehicle', vehicle);
    io.to(simulationType).emit('newVehicle', vehicle);

    return vehicle;
};



module.exports = {
    createVehicle,
    deleteVehicle,
    startStopSignUpdateLoop,
    stopStopSignUpdateLoop
};
