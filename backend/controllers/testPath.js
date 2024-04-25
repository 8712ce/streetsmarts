const express = require('express')
const router = express.Router()
// const db = require('../models')
const config = require('../config.js/config')

// DEFINE AN ARRAY OF COORDINATES REPRESENTING POINTS ALONG THE PATH //
const pathCoordinates = [
    { x: 10, y: 10 },
    { x: 20, y: 15 },
    { x: 30, y: 20 },
];

// DEFINE AN API ENDPOINT TO RETRIEVE THE PATH COORDINATES //
router.get('/testPath', (req, res) => {
    res.json(pathCoordinates);
});



module.exports = router;