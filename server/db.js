const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

const uri = process.env.MONGODB_URI ; // Use environment variable or default to localhost
const dbName = process.env.DB_NAME ; // Use environment variable or default to 'mazeDB'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db(dbName); // Use the database name from environment variables
}

module.exports = { connectDB };
