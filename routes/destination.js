// routes/destination.js
const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Check if the destination and image link exist
router.get('/check/:destination', async (req, res) => {
  const destinationName = req.params.destination;
  try {
    const destination = await Destination.findOne({ name: destinationName });
    if (destination) {
      return res.json({ imageUrl: destination.imageUrl });
    }
    res.json({ imageUrl: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Save the destination and image link
router.post('/save', async (req, res) => {
  const { destination, imageUrl } = req.body;
  try {
    const newDestination = new Destination({ name: destination, imageUrl });
    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
