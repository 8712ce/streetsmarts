const express = require('express')
const router = express.Router()
const db = require('../models')
const config = require('../config.js/config')

// MODELS //
const db = require('../models')
const Vehicle = db.Vehicle

// EXPRESS ROUTE TO ADD A VEHICLE //
app.post('/add-car', (req, res) => {
    const newVehicle = { /* VEHICLE DATA */ }; // DEFINE VEHICLE DATA
    intersection.addVehicle(newVehicle)
    res.send('Vehicle Added');
});

// EXPRSES ROUTE TO REMOVE A CAR //
app.delete('/remove-vehicle/:index', (req, res) => {
    const { index } = req.params;
    intersection.removeVehicle(index);
    res.send('Vehicle Removed');
});

module.exports = router;