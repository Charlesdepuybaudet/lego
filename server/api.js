// server/api.js
require('dotenv').config();
const express = require('express');
const { connect } = require('./database');

const app = express();
const PORT = 8092;

// Test de base
app.get('/', (req, res) => res.json({ ack: true }));

// 📌 Route 1 : GET /deals/:id
app.get('/deals/:id', async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection('deals');
    const deal = await collection.findOne({ _id: req.params.id });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📌 Route 2 : GET /deals/search
app.get('/deals/search', async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection('deals');

    // 🧩 Paramètres de recherche
    const {
      limit = 12,
      price,
      date,
      filterBy
    } = req.query;

    const query = {};

    if (price) {
      query.price = { $lte: parseFloat(price) };
    }

    if (date) {
      const timestamp = new Date(date).getTime() / 1000;
      query.published = { $gte: timestamp };
    }

    let sort = { price: 1 }; // par défaut : prix croissant

    if (filterBy === 'best-discount') {
      sort = { discount: -1 };
    } else if (filterBy === 'most-commented') {
      sort = { comments: -1 };
    }

    const deals = await collection
      .find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      limit: parseInt(limit),
      total: deals.length,
      results: deals
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📌 Route 3 : GET /sales/search
app.get('/sales/search', async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection('sales');

    const {
      limit = 12,
      legoSetId
    } = req.query;

    const query = {};

    if (legoSetId) {
      query.legoSetId = legoSetId;
    }

    const sales = await collection
      .find(query)
      .sort({ published: -1 }) // plus récentes en premier
      .limit(parseInt(limit))
      .toArray();

    res.json({
      limit: parseInt(limit),
      total: sales.length,
      results: sales
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 🚀 Lancement du serveur
app.listen(PORT, () => {
  console.log(`📡 API running on http://localhost:${PORT}`);
});
