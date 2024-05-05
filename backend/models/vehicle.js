// DEPENDENCIES //
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CREATE A VEHICLE SCHEMA //
const vehicleSchema = new Schema (
    {
        type: { type: String, required: true },
        damage: { type: Number, required: true },
        image: { type: String, required: true },
        path: {} 
    }
)

// CREATE A VEHICLE MODEL USING THE VEHICLE SCHEMA //
const Vehicle = mongoose.model('Vehicle', vehicleSchema)

// EXPORT THE VEHICLE MODEL, WEILL BE ACCESSED IN INDEX.JS //
module.exports = Vehicle