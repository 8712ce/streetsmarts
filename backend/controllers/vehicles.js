const express = require('express');
const router = express.Router();
const db = require('../models');
// const config = require('../config.js/config');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');


// ROUTE TO FETCH A RANDOM VEHICLE WIT HA RANDOM PATH //
router.get('/random', async (req, res) => {
    try {
        // FETCH A RANDOM VEHICLE //
        let randomVehicle = await Vehicle.aggregate([{ $sample: { size: 1 } }]);
        console.log(randomVehicle)
        // IF THE PATH OF THE RANDOM BEHICLE IS NULL, REPLACE IT WITH A RANDOM PATH //
        if (randomVehicle[0].path === null) {
            const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
            console.log(randomPath)
            randomVehicle[0].path = randomPath[0].coordinates; // ASSUMING PATH IS STORED AS AN OBJECTID //
        }

        res.json(randomVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE ROUTE //
router.delete('/:id', (req, res) => {
    db.Vehicle.findByIdAndRemove(req.params.id, (err, vehicle) => {
        // res.redirect('/')
    })
})

module.exports = router;