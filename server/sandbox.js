const vinted = require('./websites/vinted');

async function sandbox (id = '42151') {
  try {
    console.log(`🔍 Scraping Vinted for LEGO set id ${id}...`);

    const sales = await vinted.scrape(id);

    console.log(sales);
    console.log('✅ Done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, legoId] = process.argv;

sandbox(legoId);
