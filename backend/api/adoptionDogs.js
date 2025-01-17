const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define schema
const dogListSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  adopter: String,
});

// Route to fetch adoption dogs
router.get('/', async (req, res) => {
  try {
    // Use the connection from req.dbConnection
    const DogList = req.dbConnection.model('DogList', dogListSchema, 'dogList'); // Collection: adoption
    const dogList = await DogList.find({});
    res.json(dogList);
  } catch (error) {
    console.error("Error fetching dog list:", error);
    res.status(500).json({ error: "Failed to fetch dog list" });
  }
});

module.exports = router;
