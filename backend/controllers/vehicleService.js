// const { deleteVehicle } = require('../../frontend/src/utils/api');
const Vehicle = require('../models/vehicle');

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES //
const occupiedCoordinates = new Map();


const moveVehicle = async (vehicleId) => {
    // GET THE VEHICLE AND ITS PATH //
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const path = vehicle.path;
    let index = path.findIndex(pos => pos.x === vehicle.currentPosition.x && pos.y === vehicle.currentPosition.y);

    // INITIAL OCCUPANCY UPDATE //
    const currentCoordKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
    occupiedCoordinates.set(currentCoordKey, vehicleId);

    const moveNext = async () => {
        if (index < path.length -1) {
            const nextIndex = index + 1;
            const nextPosition = path[nextIndex];
            const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

            // CHECK IF THE NEXT COORDINATE IS UNOCCUPIED //
            if (!occupiedCoordinates.has(nextCoordKey)) {
                // UPDATE OCCUPANCY MAP //
                occupiedCoordinates.delete(currentCoordKey);
                occupiedCoordinates.set(nextCoordKey, vehicleId);

                // MOVE THE VEHICLE //
                vehicle.currentPosition = nextPosition;
                const isStopSign = isStopSignCoordinate(vehicle.currentPosition);
                await vehicle.save();

                console.log('Vehicle updated:', vehicle); // LOG UPDATED VEHICLE POSITION //

                // EMIT THE UPDATE TO CLIENTS //
                const { io } = require('../server');
                io.emit('updateVehicle', vehicle);

                // UPDATE INDEX AND CURRENTCOORDKEY //
                index = nextIndex;
                currentCoordKey = nextCoordKey;

                // SCHEDULE THE NEXT MOVE //
                setTimeout(moveNext, isStopSign ? 3000 : 1000);
            } else {
                // NEXT COORDINATE IS OCCUPIED; WAIT AND RETRY //
                setTimeout(moveNext, 500);
            }
        } else {
            // VEHICLE HAS REACHED TEH END OF ITS PATH //
            occupiedCoordinates.delete(currentCoordKey);
            await deleteVehicle(vehicle._id);
            const { io } = require('../server');
            io.emit('removeVehicle', vehicle._id);
        }
    };

    setTimeout(moveNext, 1000);
};



const isStopSignCoordinate = (coordinate) => {
    const stopSignCoordinates = [
        { x: 520, y: 290 },
        { x: 460, y: 270 },
        { x: 480, y: 210 },
        { x: 540, y: 230 },
    ];
    return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
};



const deleteVehicle = async (vehicleId) => {
    await Vehicle.findByIdAndDelete(vehicleId);
    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT //
    for (const [coordKey, id] of occupiedCoordinates.entries()) {
        if (id === vehicleId) {
            occupiedCoordinates.delete(coordKey);
            break;
        }
    }
};



module.exports = {
    moveVehicle, deleteVehicle,
};