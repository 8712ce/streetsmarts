const Pedestrian = require('../models/pedestrian');
const socket = require('../utils/socket');
const { deletePedestrian } = require('../controllers/pedestrianService');

const handleVehiclePedestrianCollision = async (vehicle, occupant, simulationType) => {
    console.log(`Vehicle ${vehicle._id} collided with pedestrian ${occupant.entityId}.`);

    // RETRIEVE THE PEDESTRIAN AND UPDATE THEIR HEALTH //
    const pedestrian = await Pedestrian.findById(occupant.entityId);
    if (pedestrian) {
        // REDUCE PEDESTRIAN'S HEALTH BY THE VEHICLE'S DAMAGE POINTS //
        pedestrian.health -= vehicle.damage;
        // ENSURE HEALTH DOESN'T DROP BELOW ZERO //
        pedestrian.health = Math.max(0, pedestrian.health);
        await pedestrian.save();

        // NOTIFY CLIENTS ABOUT PEDESTRIAN UPDATE //
        const io = socket.getIo();
        io.emit('updatePedestrian', {
            ...pedestrian.toObject(),
            simulationType,
        });

        console.log(`Pedestrian ${pedestrian._id} health reduced by ${vehicle.damage} to ${pedestrian.health}.`);

        // CHECK IF PEDESTRIAN IS DEAD //
        if (pedestrian.health <= 0) {
            // REMOVE PEDESTRIAN FROM THE SIMULATION //
            await deletePedestrian(pedestrian._id, simulationType);
        }
    }
};

module.exports = {
    handleVehiclePedestrianCollision,
};ƒ