const mongoose = require("mongoose");

const uri = "mongodb+srv://Nnik345:99sY6pMj0$!@mystreetpets.uc786.mongodb.net/?retryWrites=true&w=majority&appName=MyStreetPets"; // Replace with your MongoDB Atlas URI
let conn = null;

// Connect to the database
async function connectToDatabase() {
  if (conn) return conn;
  conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conn;
}

// Dog Schema and Model (for the dogList collection)
const dogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // MongoDB auto-generated ID
  name: String,
  image: String, // URL or path to the image
});
const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogList"); // Use "dogList" as the collection name

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    if (req.method === "GET") {
      const dogs = await Dog.find({}, "_id name image"); // Fetch only these fields
      res.status(200).json(dogs);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
