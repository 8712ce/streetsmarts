// const { deleteVehicle } = require('../../frontend/src/utils/api');
const Vehicle = require('../models/vehicle');


const moveVehicle = async (vehicleId) => {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const path = vehicle.path;
    let index = path.findIndex(pos => pos.x === vehicle.currentPosition.x && pos.y === vehicle.currentPosition.y);

    const moveNext = async () => {
        if (index < path.length -1) {
            index++;
            vehicle.currentPosition = path[index];

            const isStopSign = isStopSignCoordinate(vehicle.currentPosition);
            await vehicle.save();

            const { io } = require('../server');
            io.emit('updateVehicle', vehicle);

            setTimeout(moveNext, isStopSign ? 3000 : 1000);
        } else {
            await deleteVehicle(vehicle._id);
            const { io } = require('../server');
            io.emit('removeVehicle', vehicle._id);
        }
    };

    moveNext();
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
};

module.exports = {
    moveVehicle, deleteVehicle,
};