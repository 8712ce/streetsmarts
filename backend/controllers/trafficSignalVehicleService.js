const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/trafficSignalCollisionUtils');


// Destructure the imports for convenience
const {
    occupiedCoordinates,
    isIntersectionCoordinate,
    getTrafficSignalState,
} = collisionUtils;

// CENTRALIZED UPDATE LOOP TO UPDATE ALL VEHICLES
const updateVehicles = async () => {
    const vehicles = await Vehicle.find({ isSeed: false });
    for (const vehicle of vehicles) {
        await updateVehiclePosition(vehicle);
    }
};

// START THE UPDATE LOOP
setInterval(updateVehicles, 1000); // Update every second

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
        occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
        await deleteVehicle(vehicle._id);
        return;
    }

    const nextIndex = currentIndex + 1;
    const nextPosition = path[nextIndex];
    const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

    // DETERMINE VEHICLE'S DIRECTION IF NOT ALREADY SET //
    if (!vehicle.direction) {
        vehicle.direction = determineVehicleDirection(vehicle);
        await vehicle.save();
    }

    // GET THE TRAFFIC SIGNAL STATE FOR TEH VEHICLE'S DIRECTION //
    const lightState = getTrafficSignalState(vehicle.direction);

    // TRAFFIC SIGNAL LOGIC //
    if (isIntersectionCoordinate(nextPosition) || isIntersectionCoordinate(vehicle.currentPosition)) {
        if (lightState !== 'green') {
            // VEHICLE MUST WAIT AT RED OR YELLOW LIGHT //
            console.log(`Vehicle ${vehicle._id} is waiting at a ${lightState} light.`);
            return;
        }
    }

    // MOVEMENT LOGIC //
    // CHECK IF THE NEXT POSITION IS OCCUPIED //
    if (occupiedCoordinates.has(nextCoordKey)) {
        // CAN'T MOVE, POSITION IS OCCUPIED //
        console.log(
            `Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by vehicle ${occupiedCoordinates.get(
                nextCoordKey
            )}.`
        );
        return;
    }

    // Move the vehicle
    // Remove from old position in occupancy map
    occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);

    // Update vehicle's position and index
    vehicle.currentPosition = nextPosition;
    vehicle.currentIndex = nextIndex;

    // Add to new position in occupancy map
    occupiedCoordinates.set(nextCoordKey, vehicle._id);

    await vehicle.save();

    // Emit the update to clients
    const io = socket.getIo();
    io.emit('updateVehicle', vehicle);

    // Log movement
    console.log(
        `Vehicle ${vehicle._id} moved to position (${nextPosition.x}, ${nextPosition.y}). Current index: ${vehicle.currentIndex}`
    );
};



// FUNCTION TO DETERMINE VEHICLE DIRECTION //
function determineVehicleDirection(vehicle) {
    const path = vehicle.path;
    if (!path || path.length < 2) {
        return null;
    }

    const start = path[0];
    const next = path[1];

    if (next.y < start.y) {
        return 'northbound';
    } else if (next.y > start.y) {
        return 'southbound';
    } else if (next.x > start.x) {
        return 'eastbound';
    } else if (next.x < start.x) {
        return 'westbound';
    } else {
        return null;
    }
}



// FUNCTION TO DELETE VEHICLE
const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();

    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT
    for (const [coordKey, id] of occupiedCoordinates.entries()) {
        if (id.toString() === vehicleId.toString()) {
            occupiedCoordinates.delete(coordKey);
            break;
        }
    }

    await Vehicle.findByIdAndDelete(vehicleId);

    // EMIT THE REMOVE VEHICLE EVENT TO CLIENTS
    io.emit('removeVehicle', vehicleId);
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

    // SET INITIAL currentIndex AND STATE
    vehicleData.currentIndex = 0;

    // DETERMINE VEHICLE DIRECTION //
    vehicleData.direction = determineVehicleDirection({ path: vehicleData.path });

    const initialCoordKey = `${vehicleData.currentPosition.x},${vehicleData.currentPosition.y}`;
    if (occupiedCoordinates.has(initialCoordKey)) {
        throw new Error('Cannot create vehicle at an occupied coordinate.');
    }

    // CREATE A NEW VEHICLE INSTANCE
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // UPDATE THE OCCUPANCY MAP
    occupiedCoordinates.set(initialCoordKey, vehicle._id);

    // EMIT THE NEW VEHICLE TO CLIENTS
    io.emit('newVehicle', vehicle);

    return vehicle;
};

module.exports = {
    createVehicle,
    deleteVehicle,
    updateVehicles
};
