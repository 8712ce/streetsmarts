const express = require('express');
const router = express.Router();
const db = require('../models');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');
// const { createVehicle } = require('../controllers/vehicleService');
const vehicleService = require('../controllers/vehicleService');
const trafficSignalVehicleService = require('../controllers/trafficSignalVehicleService');



// FETCH THE IO OBJECT FROM THE APP //
// const { io } = require('../server');




// ROUTE TO FETCH A RANDOM VEHICLE WITH A RANDOM PATH AND SAVE TO DATABASE //
router.post('/random', async (req, res) => {
    try {
        // LOGGING TO TRACK THE VEHICLE CREATION PROCESS //
        console.log('Request to create a random vehicle received.');

        // GET THE SIMULATIONS TYPE FROM THE QUERY PARAMETERS //
        const simulationType = req.query.simulationType || 'stopSign'; // DEFAULT TO STOP SIGN IF NOT PROVIDED //

        // FETCH A RANDOM SEED VEHICLE //
        let randomVehicleTemplate = await Vehicle.aggregate([
            { $match: { isSeed: true } },
            { $sample: { size: 1 } }
        ]);

        if (!randomVehicleTemplate || randomVehicleTemplate.length === 0) {
            throw new Error('No seed vehicles found.');
        }

        console.log('Random vehicle template selected:', randomVehicleTemplate[0]);

        // FETCH A RANDOM PATH //
        const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);

        if (!randomPath || randomPath.length === 0) {
            throw new Error('No paths found.');
        }

        console.log('Assigned random path to vehicle:', randomPath[0]);

        // CREATE A NEW VEHICLE OBJECT WITH A UNIQUE ID //
        const vehicleData = {
            type: randomVehicleTemplate[0].type,
            damage: randomVehicleTemplate[0].damage,
            image: randomVehicleTemplate[0].image,
            path: randomPath[0].coordinates, // Assign the random path's coordinates
            currentPosition: randomPath[0].coordinates[0], // Set initial position to the start of the path
            isSeed: false, // Ensure the new vehicle is not marked as a seed vehicle
            pathDirection: randomPath[0].direction, // INCLUDE THE PATH'S DIRECTION //
            simulationType: simulationType, // INCLUDE SIMULATION TYPE //
            // Optional: Include speed or other fields if necessary
        };

        // // USE 'createVehicle' FUNCTION TO CREATE THE VEHICLE //
        // const createdVehicle = await createVehicle(vehicleData);
        // console.log('New vehicle created and started moving:', createdVehicle);

        let createdVehicle;
        if (simulationType === 'trafficSignal') {
            createdVehicle = await trafficSignalVehicleService.createVehicle(vehicleData);
            console.log('New vehicle created using trafficSignalVehicleService:', createdVehicle);
        } else {
            createdVehicle = await vehicleService.createVehicle(vehicleData);
            console.log('New vehicle created using vehicleService:', createdVehicle);
        }

        // RETURN THE CREATED VEHICLE AS JSON RESPONSE //
        res.json(createdVehicle);
    } catch (err) {
        console.error('Error creating a new vehicle:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});



// DELETE ROUTE //
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndRemove(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted', vehicle });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;