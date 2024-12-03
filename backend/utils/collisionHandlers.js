const Pedestrian = require('../models/pedestrian');
const socket = require('../utils/socket');
const { deletePedestrian } = require('../controllers/pedestrianService');

const handleVehiclePedestrianCollision = async (vehicle, occupant, simulationType) => {
    console.log(`Vehicle ${vehicle._id} collided with pedestrian ${occupant.entityId}.`);

    // RETRIEVE THE PEDESTRIAN AND UPDATE THEIR HEALTH //
    const pedesetrian = await Pedestrian.findById(occupant.entityId);
    if (pedesetrian) {
        // REDUCE PEDESTRIAN'S HEALTH BY THE VEHICLE'S DAMAGE POINTS //
        pedesetrian.health -= vehicle.damage;
        // ENSURE HEALTH DOESN'T DROP BELOW ZERO //
        pedesetrian.health = Math.max(0, pedesetrian.health);
        await pedesetrian.save();

        // NOTIFY CLIENTS ABOUT PEDESTRIAN UPDATE //
        const io = socket.getIo();
        io.emit('updatePedestrian', {
            ...pedestrian.toObject(),
            simulationType,
        });

        console.log(`Pedestrian ${pedesetrian._id} health reduced by ${vehicle.damage} to ${pedesetrian.health}.`);

        // CHECK IF PEDESTRIAN IS DEAD //
        if (pedesetrian.health <= 0) {
            // REMOVE PEDESTRIAN FROM THE SIMULATION //
            await deletePedestrian(pedesetrian._id, simulationType);
        }
    }
};

module.exports = {
    handleVehiclePedestrianCollision,
};