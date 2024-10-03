// const { deleteVehicle } = require('../../frontend/src/utils/api');
const Vehicle = require('../models/vehicle');
const socket = require('../utils/socket');

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES //
const occupiedCoordinates = new Map();



const moveVehicle = async (vehicleId) => {
    // GET THE VEHICLE AND ITS PATH //
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const path = vehicle.path;
    let index = path.findIndex(pos => pos.x === vehicle.currentPosition.x && pos.y === vehicle.currentPosition.y);

    // INITIAL OCCUPANCY UPDATE //
    let currentCoordKey = `${vehicle.currentPosition.x},${vehicle.currentPosition.y}`;
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
                // const { io } = require('../server');
                const io = socket.getIo();
                io.emit('updateVehicle', vehicle);

                // UPDATE INDEX AND CURRENTCOORDKEY //
                index = nextIndex;
                currentCoordKey = nextCoordKey;

                // SCHEDULE THE NEXT MOVE //
                setTimeout(moveNext, isStopSign ? 5000 : 1000);
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

    setTimeout(moveNext, 1000);
};



const isStopSignCoordinate = (coordinate) => {
    const stopSignCoordinates = [
        { x: 625, y: 750 },
        { x: 250, y: 625 },
        { x: 375, y: 250 },
        { x: 750, y: 375 },
    ];
    return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
};



const deleteVehicle = async (vehicleId) => {
    const io = socket.getIo();
    await Vehicle.findByIdAndDelete(vehicleId);
    // REMOVE FROM OCCUPANCY MAP IF STILL PRESENT //
    for (const [coordKey, id] of occupiedCoordinates.entries()) {
        if (id === vehicleId) {
            occupiedCoordinates.delete(coordKey);
            break;
        }
    }
    // EMIT THE REMOVE VEHICLE EVENT TO CLIENTS //
    io.emit('removeVehicle', vehicleId);
};



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