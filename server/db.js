const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('mazeDB'); // Replace with your database name
}

module.exports = { connectDB };
