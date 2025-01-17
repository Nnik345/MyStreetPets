const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define schema for `dogList`
const dogListSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  location: String,
});

// Route to fetch the `dogList` collection
router.get('/', async (req, res) => {
  try {
    // Use the connection from req.dbConnection
    const DogList = req.dbConnection.model('DogList', dogListSchema, 'dogList');
    const dogList = await DogList.find({});
    res.json(dogList);
  } catch (error) {
    console.error("Error fetching dog list:", error);
    res.status(500).json({ error: "Failed to fetch dog list" });
  }
});

module.exports = router;
