const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse the HTML content from Dealabs
 * @param {string} data - HTML page content
 * @returns {Array} deals
 */
const parse = (data) => {
  const $ = cheerio.load(data);
  const deals = [];

  $('article.thread--deal').each((_, element) => {
    const title = $(element).find('a.thread-link').text().trim();
    const link = 'https://www.dealabs.com' + $(element).find('a.thread-link').attr('href');
    const priceText = $(element).find('.thread-item-price').text().replace('€', '').trim();
    const price = parseFloat(priceText.replace(',', '.'));

    const discountMatch = $(element).find('.thread-price--original').text().match(/(\d+)%/);
    const discount = discountMatch ? parseInt(discountMatch[1]) : null;

    const temperatureText = $(element).find('.vote-box .vote-temp').text();
    const temperature = parseInt(temperatureText) || 0;

    const commentsText = $(element).find('.hide--to-xl span.text--b').text();
    const comments = parseInt(commentsText) || 0;

    deals.push({
      title,
      link,
      price,
      discount,
      temperature,
      comments
    });
  });

  return deals;
};

/**
 * Scrape Dealabs for a LEGO ID
 * @param {string} keyword - LEGO set ID or 'lego'
 * @returns {Array} deals
 */
module.exports.scrape = async (keyword = 'lego') => {
  const url = `https://www.dealabs.com/search?q=${keyword}`;
  const response = await fetch(url);
  const body = await response.text();
  return parse(body);
};
