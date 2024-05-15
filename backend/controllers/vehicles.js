const express = require('express');
const router = express.Router();
const db = require('../models');
// const config = require('../config.js/config');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');



// ROUTE TO FETCH A RANDOM VEHICLE WITH A RANDOM PATH AND SAVE TO DATABASE //
router.post('/random', async (req, res) => {
    try {
        // FETCH A RANDOM VEHICLE //
        let randomVehicle = await Vehicle.aggregate([{ $sample: { size: 1 } }]);
        console.log(randomVehicle)
        
        // IF THE PATH OF THE RANDOM VEHICLE IS NULL, REPLACE IT WITH A RANDOM PATH //
        if (randomVehicle[0].path === null) {
            const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
            randomVehicle[0].path = randomPath[0].coordinates; // ASSUMING PATH IS STORED AS AN OBJECTID //
            console.log(randomPath)
        }

        // Create a new vehicle object without the _id field
        const newVehicle = {
            type: randomVehicle[0].type,
            damage: randomVehicle[0].damage,
            image: randomVehicle[0].image,
            path: randomVehicle[0].path
        };
        // console.log(newVehicle)

        // CREATE THE RANDOM VEHICLE IN THE DATABASE //
        const createdVehicle = await Vehicle.create(newVehicle);
        // console.log(createdVehicle)

        // RETURN THE CREATED VEHICLE AS JSON RESPONSE //
        res.json(createdVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
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