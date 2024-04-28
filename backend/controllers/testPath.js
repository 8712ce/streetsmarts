const express = require('express')
const router = express.Router()
const db = require('../models')


// DEFINE AN ARRAY OF COORDINATES REPRESENTING POINTS ALONG THE PATH //
const pathCoordinates = [
    { x: 10, y: 10 },
    { x: 20, y: 15 },
    { x: 30, y: 20 },
];

// Get All test paths
router.get('/', async (req, res) => {
    const allPaths = await db.Path.find({})
    res.json(allPaths);
});

// Individual
router.get('/:testPathId', async (req, res) => {
    const testPathId = req.params.testPathId;
    try {
        const foundPath = await db.Path.findById(testPathId);
        if (!foundPath) {
            return res.status(404).json({ error: 'Path not found' });
        }
        res.json(foundPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/new', async (req, res) => {
   
    const newPath = req.body;
    try {
        const createdPath = await db.Path.create(newPath);
        res.json(createdPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;