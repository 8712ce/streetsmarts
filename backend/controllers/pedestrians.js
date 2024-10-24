// controllers/pedestrians.js

const express = require('express');
const router = express.Router();
const { initializePedestrian, updatePedestrianPosition, deletePedestrian } = require('./pedestrianService');
const Pedestrian = require('../models/pedestrian');

// CREATE PEDESTRIAN
router.post('/', async (req, res) => {
  try {
    const pedestrianData = req.body;

    const pedestrian = new Pedestrian(pedestrianData);

    // Initialize the pedestrian (assign path, currentPosition, etc.)
    await initializePedestrian(pedestrian);

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

    const { direction } = req.body;
    await updatePedestrianPosition(pedestrian, direction);
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

    await deletePedestrian(pedestrian._id);
    res.json({ message: 'Pedestrian deleted', pedestrian });
  } catch (err) {
    console.error('Error deleting pedestrian:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
