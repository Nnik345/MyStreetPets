require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const createConnection = require('./dbConnect');
const streetDogsRoutes = require('./api/streetDogs');
const adoptionDogsRoutes = require('./api/adoptionDogs');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URIs from environment variables
const streetDogsDB = process.env.STREET_DOGS_URI;
const adoptionDogsDB = process.env.ADOPTION_DOGS_URI;

// Middleware
app.use(express.json());

// Connect to databases
(async () => {
  try {
    const streetDogsConnection = await createConnection(streetDogsDB); // Connect to streetDogs
    const adoptionDogsConnection = await createConnection(adoptionDogsDB); // Connect to adoptionDogs

    // Pass the connections to routes via middleware
    app.use('/api/street-dogs', (req, res, next) => {
      req.dbConnection = streetDogsConnection;
      next();
    }, streetDogsRoutes);

    app.use('/api/adoption-dogs', (req, res, next) => {
      req.dbConnection = adoptionDogsConnection;
      next();
    }, adoptionDogsRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
})();
