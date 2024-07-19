// DEPENDENCIES //
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CREATE A PATH SCHEMA //
const pathSchema = new Schema(
    {
        direction: { type: String, required: true },
        coordinates: [
            {
                x: { type: Number },
                y: { type: Number }
            }
        ]
    }
);

// CREATE A PATH MODEL USING THE PATH SCHEMA //
const Path = mongoose.model('Path', pathSchema)

// EXPORT THE PATH MODEL, WILL BE ACCESSED IN "INDEX.JS" //
module.exports = Path