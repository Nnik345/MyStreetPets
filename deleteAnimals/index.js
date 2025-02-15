const AWS = require("aws-sdk");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.REGION;
const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb = null;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  region: REGION,
});

// Connect to MongoDB
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db("adoptionAnimals");
  cachedDb = db;
  return db;
}

exports.handler = async (event) => {
  try {
    const { imageUrl, mongoId } = JSON.parse(event.body);

    if (!imageUrl || !mongoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required parameters" }),
      };
    }

    // Extract file name from imageUrl
    const fileName = imageUrl.split("/").pop();

    // Delete file from S3
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    await s3.deleteObject(s3Params).promise();

    // Delete record from MongoDB
    const db = await connectToDatabase();
    const result = await db
      .collection("animalList")
      .deleteOne({ _id: new ObjectId(mongoId) });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "MongoDB record not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image and record deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting file or MongoDB record:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Deletion failed", error: error.message }),
    };
  }
};
