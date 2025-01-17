const mongoose = require("mongoose");

const uri = "mongodb+srv://Nnik345:99sY6pMj0$!@mystreetpets.uc786.mongodb.net/?retryWrites=true&w=majority&appName=MyStreetPets"; // Replace with your MongoDB Atlas URI
let conn = null;

// Dog Schema and Model
const dogSchema = new mongoose.Schema({ name: String, breed: String, age: Number });
const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema);

async function connectToDatabase() {
  if (conn) return conn;
  conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conn;
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    if (req.method === "GET") {
      const dogs = await Dog.find();
      res.status(200).json(dogs);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
