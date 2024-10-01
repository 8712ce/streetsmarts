const express = require('express');
const router = express.Router();
const db = require('../models');
// const config = require('../config.js/config');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');
const { createVehicle } = require('../controllers/vehicleService');



// FETCH THE IO OBJECT FROM THE APP //
// const { io } = require('../server');




// ROUTE TO FETCH A RANDOM VEHICLE WITH A RANDOM PATH AND SAVE TO DATABASE //
router.post('/random', async (req, res) => {
    try {
        // LOGGING TO TRACK TEH VEHICLE CREATION PROCESS //
        console.log('Request to create a random vehicle recevied.');

        // FETCH A RANDOM SEED VEHICLE //
        let randomVehicleTemplate = await Vehicle.aggregate([
            { $match: { isSeed: true } },
            { $sample: { size: 1 } }
        ]);
        console.log('Random vehicle template selected:', randomVehicleTemplate);

        // ASSIGN A RANDOM PATH IF NONE EXISTS //
        if (!randomVehicleTemplate[0].path || randomVehicleTemplate[0].path.length === 0) {
            const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
            randomVehicleTemplate[0].path = randomPath[0].coordinates; // ASSUMING PATH IS STORED AS AN OBJECTID //
            console.log('Assigned random path to vehicle:', randomPath);
        }

        // CREATE A NEW VEHICLE OBJECT WITH A UNIQUE ID //
        const vehicleData = {
            type: randomVehicleTemplate[0].type,
            damage: randomVehicleTemplate[0].damage,
            image: randomVehicleTemplate[0].image,
            path: randomVehicleTemplate[0].path,
            currentPosition: randomVehicleTemplate[0].path[0] // SET INITIAL POSITION TO THE START OF THE PATH //
        };

        // USE 'createVehicle' FUNCTION TO CREATE THE VEHICLE //
        const createdVehicle = await createVehicle(vehicleData);
        console.log('New vehicle created and started moving:', createdVehicle);



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
        const vehicle = await db.Vehicle.findByIdAndRemove(req.params.id);
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