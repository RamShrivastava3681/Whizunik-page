// db.js
const { MongoClient } = require('mongodb');

// Use a proper MongoDB URI, not a website URL
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'whizunik';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      console.log('✅ Connected to MongoDB:', dbName);
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      throw err;
    }
  }
  return db;
}

module.exports = { connectDB, client };
