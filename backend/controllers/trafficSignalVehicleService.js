const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/collisionUtils');
const Pedestrian = require('../models/pedestrian');
const { deletePedestrian } = require('./pedestrianService');
const { handleVehiclePedestrianCollision } = require('../utils/collisionHandlers');


// Destructure the imports for convenience
const {
    occupiedCoordinates,
    getTrafficSignalState,
    trafficSignalCoordinates,
    isTrafficSignalCoordinate,
    startTrafficSignalCycle,
    stopTrafficSignalCycle,
    addOccupant,
    removeOccupant,
} = collisionUtils;

const occupancyMap = occupiedCoordinates.trafficSignal;
const simulationType = 'trafficSignal';



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
    return isTrafficSignalCoordinate(vehicle.currentPosition);
};



// CENTRALIZED UPDATE LOOP TO UPDATE ALL VEHICLES
const updateVehicles = async () => {
    const vehicles = await Vehicle.find({ isSeed: false, simulationType: 'trafficSignal' });
    for (const vehicle of vehicles) {
        await updateVehiclePosition(vehicle);
    }
};



// START THE UPDATE LOOP
// setInterval(updateVehicles, 1000); // Update every second



// FUNCTION OT START AND STOP THE UPDATE LOOP //
let trafficSignalUpdateInterval = null;

const startTrafficSignalUpdateLoop = () => {
    if (!trafficSignalUpdateInterval) {
        trafficSignalUpdateInterval = setInterval(updateVehicles, 1000);
        console.log('Traffic signal update loop started.');
        startTrafficSignalCycle(); // START TEH TRAFFIC SIGNAL CYCLE //
    }
};

const stopTrafficSignalUpdateLoop = () => {
    if (trafficSignalUpdateInterval) {
        clearInterval(trafficSignalUpdateInterval);
        trafficSignalUpdateInterval = null;
        console.log('Traffic signal update loop stopped.');
        stopTrafficSignalCycle(); // STOP THE TRAFFIC SIGNAL CYCLE //
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
        // VEHICLE HAS REACHED TEH END OF ITS PATH //
        console.log(`Vehicle ${vehicle._id} has reached the end of its path. Deleting vehicle.`);
        // REMOVE FROM OCCUPANCY MAP //
        // occupancyMap.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
        removeOccupant(simulationType, `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`, vehicle._id);
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
    if (occupancyMap.has(nextCoordKey)) {
        // CAN'T MOVE, POSITION IS OCCUPIED //
        // console.log(
        //     `Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by vehicle ${occupancyMap.get(
        //         nextCoordKey
        //     )}.`
        // );
        // return;
        const occupant = occupancyMap.get(nextCoordKey);

        if (occupant.entityType === 'vehicle') {
            // COLLISION WITH ANOTHER VEHICLE, PREVENT MOVE //
            console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by another vehicle ${occupant.entityId}.`);
            return;
        } else if (occupant.entityType === 'pedestrian') {
            const timeOccupied = Date.now() - occupant.occupiedAt;
            if (timeOccupied >= 2000) {
                // PEDESETRIAN HAS BEEN THERE FOR 2 SECONDS OR MORE, PREVENT MOVE //
                console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because pedestrian ${occupant.entityId} has been there for ${timeOccupied}ms.`);
                return;
            } else {
                // PEDESTRIAN HAS BEEN THERE FOR LESS THAN 2 SECONDS, ALLOW MOVE AND HANDLE COLLISION //
                console.log(`Vehicle ${vehicle._id} collided with pedestrian ${occupant.entityId}.`);

                await handleVehiclePedestrianCollision(vehicle, occupant, simulationType);
            }
        } else {
            // UNKNOWN ENTITY TYPE, PREVENT MOVE FOR SAFETY //
            console.log(`Vehicle ${vehicle._id} cannot move to ${nextCoordKey} because it is occupied by an unknown entity type.`);
            return;
        }
    }

    // MOVE THE VEHICLE //
    // REMOVE FROM OLD POSITION IN OCCUPANCY MAP //
    // occupancyMap.delete(`${vehicle.currentPosition.x},${vehicle.currentPosition.y}`);
    removeOccupant(simulationType, `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`, vehicle._id);

    // UPDATE VEHICLE'S POSITION AND INDEX //
    vehicle.currentPosition = nextPosition;
    vehicle.currentIndex = nextIndex;

    // ADD TO NEW POSITION IN OCCUPANCY MAP //
    // occupancyMap.set(nextCoordKey, vehicle._id);
    addOccupant(simulationType, nextCoordKey, {
        entityId: vehicle._id,
        entityType: 'vehicle',
        occupiedAt: Date.now(),
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
};



// FUNCTION TO DELETE VEHICLE
const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();

    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT //
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

    // SET INITIAL currentIndex AND STATE
    vehicleData.currentIndex = 0;

    // ENSURE SIMULATION TYPE IS SET //
    if (!vehicleData.simulationType) {
        vehicleData.simulationType = 'trafficSignal';
    }

    // DETERMINE VEHICLE DIRECTION //
    vehicleData.direction = getVehicleDirectionFromPath(vehicleData.pathDirection);

    if (!vehicleData.direction) {
        throw new Error('Invalid path direction. Cannot determine vehicle direction.');
    }

    const initialCoordKey = `${vehicleData.currentPosition.x},${vehicleData.currentPosition.y}`;
    if (occupancyMap.has(initialCoordKey)) {
        throw new Error('Cannot create vehicle at an occupied coordinate.');
    }

    // CREATE A NEW VEHICLE INSTANCE
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // UPDATE THE OCCUPANCY MAP
    addOccupant(simulationType, initialCoordKey, {
        entityId: vehicle._id,
        entityType: 'vehicle',
        occupiedAt: Date.now(),
    });

    // EMIT THE NEW VEHICLE TO CLIENTS //
    // io.emit('newVehicle', vehicle);
    io.to(simulationType).emit('newVehicle', vehicle);

    return vehicle;
};

module.exports = {
    createVehicle,
    deleteVehicle,
    updateVehicles,
    startTrafficSignalUpdateLoop,
    stopTrafficSignalUpdateLoop
};
