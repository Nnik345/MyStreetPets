const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase() {

  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = await client.db('adoptionAnimals');
  cachedDb = db;
  return db
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase();

  // Insert the event object, which is the test data we pass in
  const result = await db.collection("animalList").insertOne(event);
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  return response;
};