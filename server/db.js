const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 30000,  // Increase server selection timeout to 30 seconds
  socketTimeoutMS: 45000,  // Increase socket timeout to 45 seconds
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectDB };
