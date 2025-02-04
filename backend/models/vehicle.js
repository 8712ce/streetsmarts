// DEPENDENCIES //
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CREATE A VEHICLE SCHEMA //
const vehicleSchema = new Schema (
    {
        type: { type: String, required: true },
        damage: { type: Number, required: true },
        image: { type: String, required: true },
        path: [
            {
                x: { type: Number },
                y: { type: Number }
            }
        ],
        currentPosition: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 }
        },
        speed: { type: Number, required: false },
        isMoving: { type: Boolean, default: false },
        isSeed: { type: Boolean, default: false },
        currentIndex: { type: Number, default: 0 },
        isWaiting: { type: Boolean, default: false },
        waitUntil: { type: Date, default: null },
        simulationType: String,
        direction: String,
    }
);

// CREATE A VEHICLE MODEL USING THE VEHICLE SCHEMA //
const Vehicle = mongoose.model('Vehicle', vehicleSchema)

// EXPORT THE VEHICLE MODEL, WEILL BE ACCESSED IN INDEX.JS //
module.exports = Vehicle