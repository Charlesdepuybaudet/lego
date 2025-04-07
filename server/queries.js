const { connect } = require('./database');

(async () => {
  const db = await connect();

  const bestDiscounts = await db.collection('deals').find({ discount: { $gte: 30 } }).toArray();
  console.log('💸 Meilleures réductions :', bestDiscounts);

  const mostCommented = await db.collection('deals').find().sort({ comments: -1 }).toArray();
  console.log('💬 Plus commentés :', mostCommented);

  const cheapest = await db.collection('deals').find().sort({ price: 1 }).toArray();
  console.log('🔻 Moins chers :', cheapest);

  const salesForSet = await db.collection('sales').find({ legoSetId: '42151' }).toArray();
  console.log('🧱 Ventes pour LEGO 42151 :', salesForSet);

  const threeWeeksAgo = new Date();
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
  const recentSales = await db.collection('sales').find({ date: { $gte: threeWeeksAgo } }).toArray();
  console.log('📆 Ventes récentes :', recentSales);

})();
