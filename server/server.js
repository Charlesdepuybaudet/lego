const express = require('express');
const scrape = require('./index');

const app = express();
const PORT = 3000;

// 👉 AJOUTE CE BLOC POUR GÉRER LA ROUTE /dealabs/:id
app.get('/dealabs/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://www.dealabs.com/search?q=lego+${id}`;
  try {
    const data = await scrape(url);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ LANCE LE SERVEUR
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
