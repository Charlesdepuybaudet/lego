const puppeteer = require('puppeteer');

async function scrapeVinted(legoId = '42151') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const url = `https://www.vinted.fr/catalog?search_text=lego%20${legoId}&order=newest_first`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  try {
    // ✅ Attend qu'au moins un lien LEGO apparaisse
    await page.waitForFunction(() => {
      return document.querySelectorAll("a[href*='lego']").length > 0;
    }, { timeout: 30000 });

    const items = await page.$$eval("a[href*='lego']", boxes =>
      boxes.map(box => {
        const link = 'https://www.vinted.fr' + box.getAttribute('href');
        const title = box.querySelector('h3')?.innerText?.trim();
        const price = box.querySelector("div[data-testid='item-box-price']")?.innerText?.trim();
        return { title, price, link };
      }).filter(item => item.title && item.price) // filtre les null
    );

    await browser.close();
    return items;
  } catch (error) {
    console.error('❌ Erreur pendant le scraping Vinted :', error.message);
    await browser.close();
    return [];
  }
}

module.exports = { scrape: scrapeVinted };
