const { connect } = require('./database');
const dealabs = require('./websites/dealabs');

async function storeDeals() {
  const db = await connect();

  const deals = await dealabs.scrape('lego');

  if (deals.length === 0) {
    console.log('❌ Aucun deal récupéré');
    return;
  }

  const collection = db.collection('deals');
  const result = await collection.insertMany(deals);

  console.log(`✅ ${result.insertedCount} deals insérés dans la base.`);
}

storeDeals();
