// dbConnect.js
const mongoose = require('mongoose');

// Function to create a new connection
const createConnection = async (uri) => {
  try {
    const connection = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB: ${uri}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = createConnection;
