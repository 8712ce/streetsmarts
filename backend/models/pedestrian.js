// DEPENDENCIES //
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CREATE A PEDESTRIAN SCHEMA //
const pedestrianSchema = new Schema (
    {
        name: { type: String, required: false },
        score: { type: Number, required: true, default: 0 },
        health: { type: Number, required: true, default: 100 },
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
        isMoving: { type: Boolean, default: false },
        currentIndex: { type: Number, default: 0 },
        isWaiting: { type: Boolean, default: false },
        waitUntil: { type: Date, default: null }
    }
);

// CREATE A PEDESTRIAN MODEL USING THE PEDESTRIAN SCHEMA //
const Pedestrian = mongoose.model('Pedestrian', pedestrianSchema)

// EXPORT THE PEDESTRIAN MODEL, WILL BE ACCESSED IN INDEX.JS //
module.exports = Pedestrian