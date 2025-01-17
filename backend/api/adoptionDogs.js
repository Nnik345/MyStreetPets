const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define schema
const adoptionDogSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  adopter: String,
});

// Route to fetch adoption dogs
router.get('/', async (req, res) => {
  try {
    // Use the connection from req.dbConnection
    const AdoptionDog = req.dbConnection.model('AdoptionDog', adoptionDogSchema, 'adoption'); // Collection: adoption
    const adoptionDogs = await AdoptionDog.find({});
    res.json(adoptionDogs);
  } catch (error) {
    console.error("Error fetching adoption dogs:", error);
    res.status(500).json({ error: "Failed to fetch adoption dogs" });
  }
});

module.exports = router;
