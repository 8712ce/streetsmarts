// controllers/pedestrians.js

const express = require('express');
const router = express.Router();
const { initializePedestrian, updatePedestrianPosition, deletePedestrian } = require('./pedestrianService');
const Pedestrian = require('../models/pedestrian');
// const authenticateJWT = require('../middleware/authenticateJWT');

// CREATE PEDESTRIAN
router.post('/', async (req, res) => {
  try {
    const pedestrianData = req.body;

    // GET SIMULATION TYPE FROM REQUEST BODY OR QUERY PARAMETERS //
    const simulationType = req.body.simulationType || req.query.simulationType;

    if (!simulationType) {
      return res.status(400).json({ message: 'simulationType is required' });
    }

    const pedestrian = new Pedestrian(pedestrianData);

    // Initialize the pedestrian (assign path, currentPosition, etc.)
    await initializePedestrian(pedestrian, simulationType);

    res.json(pedestrian);
  } catch (err) {
    console.error('Error creating pedestrian:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// MOVE PEDESTRIAN
router.post('/:id/move', async (req, res) => {
  try {
    const pedestrian = await Pedestrian.findById(req.params.id);
    if (!pedestrian) {
      return res.status(404).json({ message: 'Pedestrian not found' });
    }

    // GET SIMULATION TYPE FROM REQUEST BODY OR QUERY PARAMETERS //
    const simulationType = req.body.simulationType || req.query.simulationType;

    if (!simulationType) {
      return res.status(400).json({ message: 'simulationType is required' });
    }

    const { direction } = req.body;
    if (!direction) {
      return res.status(400).json({ message: 'direction is required' });
    }

    await updatePedestrianPosition(pedestrian, direction, simulationType);
    res.json(pedestrian);
  } catch (err) {
    console.error('Error moving pedestrian:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// DELETE PEDESTRIAN
router.delete('/:id', async (req, res) => {
  try {
    const pedestrian = await Pedestrian.findById(req.params.id);
    if (!pedestrian) {
      return res.status(404).json({ message: 'Pedestrian not found' });
    }

    // GET SIMULATION TYPE FROM REQUEST BODY OR QUERY PARAMETERS //
    const simulationType = req.body.simulationType || req.query.simulationType;

    if (!simulationType) {
      return res.status(400).json({ message: 'simulationType is required' });
    }

    await deletePedestrian(pedestrian._id, simulationType);
    res.json({ message: 'Pedestrian deleted', pedestrian });
  } catch (err) {
    console.error('Error deleting pedestrian:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
