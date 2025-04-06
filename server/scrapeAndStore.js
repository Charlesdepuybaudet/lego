// server/scrapeAndStore.js
require('dotenv').config();
const { connect } = require('./database');
const dealabs = require('./websites/dealabs');

async function scrapeAndStoreDeals() {
  const db = await connect();
  const deals = await dealabs.scrape('https://www.dealabs.com/groupe/lego');

  const collection = db.collection('deals');
  const result = await collection.insertMany(deals);

  console.log(`✅ ${result.insertedCount} deals inserted`);
  process.exit(0);
}

scrapeAndStoreDeals();
