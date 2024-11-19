const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');
const trafficSignalCollisionUtils = require('../utils/trafficSignalCollisionUtils');


// Destructure the imports for convenience
const {
    occupiedCoordinates,
    getTrafficSignalState,
    trafficSignalCoordinates,
} = trafficSignalCollisionUtils;



// FUNCTION TO EXTRACT VEHICLE DIRECTION FROM PATH'S DIRECTION FIELD //
const getVehicleDirectionFromPath = (pathDirection) => {
    // EXTRACT THE INITIAL LETTER REPRESENTING THE DIRECTION //
    const initialDirection = pathDirection.charAt(0);

    switch (initialDirection) {
        case 'N':
            return 'northbound';
        case 'S':
            return 'southbound';
        case 'E':
            return 'eastbound';
        case 'W':
            return 'westbound';
        default:
            return null;
    }
};



// FUNCTION TO CHECK IF THE VEHICLE IS OCCUPYING A TRAFFIC SIGNAL COORDINATE //
const isOccupyingTrafficSignalCoordinate = (vehicle) => {
    const currentPosition = vehicle.currentPosition;
    return trafficSignalCoordinates.some(
        coord => coord.x === currentPosition.x && coord.y === currentPosition.y
    );
};



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
        // VEHICLE HAS REACHED TEH END OF ITS PATH //
        console.log(`Vehicle ${vehicle._id} has reached the end of its path. Deleting vehicle.`);
        occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
        await deleteVehicle(vehicle._id);
        return;
    }

    const nextIndex = currentIndex + 1;
    const nextPosition = path[nextIndex];
    const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

    // TRAFFIC SIGNAL LOGIC //
    if (isOccupyingTrafficSignalCoordinate(vehicle)) {
        // GET THE TRAFFIC SIGNAL STATE FOR THE VEHICLE'S DIRECTION //
        const lightState = getTrafficSignalState(vehicle.direction);

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

    // MOVE THE VEHICLE //
    // REMOVE FROM OLD POSITION IN OCCUPANCY MAP //
    occupiedCoordinates.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);

    // UPDATE VEHICLE'S POSITION AND INDEX //
    vehicle.currentPosition = nextPosition;
    vehicle.currentIndex = nextIndex;

    // ADD TO NEW POSITION IN OCCUPANCY MAP //
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
    vehicleData.direction = getVehicleDirectionFromPath(vehicleData.pathDirection);

    if (!vehicleData.direction) {
        throw new Error('Invalid path direction. Cannot determine vehicle direction.');
    }

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
