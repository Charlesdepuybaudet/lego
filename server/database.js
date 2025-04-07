require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let client = null;
let db = null;

const connect = async () => {
  if (db) return db;

  client = await MongoClient.connect(MONGODB_URI);
  db = client.db(MONGODB_DB_NAME);

  console.log('✅ Connected to MongoDB');
  return db;
};

module.exports = { connect };
