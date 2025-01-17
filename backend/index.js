const express = require('express');
const createConnection = require('./dbConnect');
const mongoose = require('mongoose');
const streetDogsRoutes = require('./api/streetDogs');
const adoptionDogsRoutes = require('./api/adoptionDogs');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URIs
const streetDogsDB = "mongodb+srv://Nnik345:99sY6pMj0$!@mystreetpets.uc786.mongodb.net/streetDogs";
const adoptionDogsDB = "mongodb+srv://Nnik345:99sY6pMj0$!@mystreetpets.uc786.mongodb.net/adoptionDogs";

// Middleware
app.use(express.json());

// Connect to databases
(async () => {
  try {
    const streetDogsConnection = await createConnection(streetDogsDB); // Connect to streetDogs
    const adoptionDogsConnection = await createConnection(adoptionDogsDB); // Connect to adoptionDogs

    // Pass the connections to routes via locals (or any other preferred method)
    app.use('/api/street-dogs', (req, res, next) => {
      req.dbConnection = streetDogsConnection;
      next();
    }, streetDogsRoutes);

    app.use('/api/adoption-dogs', (req, res, next) => {
      req.dbConnection = adoptionDogsConnection;
      next();
    }, adoptionDogsRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
})();
