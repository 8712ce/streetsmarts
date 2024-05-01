const express = require('express');
const router = express.Router();
const db = require('../models');
// const config = require('../config.js/config');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');


// ROUTE TO FETCH A RANDOM PATH //
router.get('/paths/random', async (req, res) => {
    try {
        const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
        res.jason(randomPath);
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