// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const filterBestDiscount = document.querySelector('#filter-best-discount');
const filterMostCommented = document.querySelector('#filter-most-commented');
const filterHotDeals = document.querySelector('#filter-hot-deals');
const selectSort = document.querySelector('#sort-select');



/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

const fetchSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error('Erreur Vinted :', body);
      return [];
    }

    return body.data.result; // retourne un tableau de ventes
  } catch (error) {
    console.error('Erreur réseau Vinted :', error);
    return [];
  }
};


/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span class="favorite" data-id="${deal.uuid}" style="cursor:pointer">★</span>
        <span>${deal.id}</span>
        <a href="${deal.link}" target="_blank">${deal.title}</a>
        <span>${deal.price} €</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);

  // 🔥 Ajoute le listener aux étoiles
  document.querySelectorAll('.favorite').forEach(star => {
    const dealId = star.dataset.id;
  
    // 1. Applique la classe active si favori
    if (getFavorites().includes(dealId)) {
      star.classList.add('active');
    }
  
    // 2. Ajoute le click listener pour activer/désactiver
    star.addEventListener('click', () => {
      toggleFavorite(dealId);
      star.classList.toggle('active');
    });
  });
  
};

const toggleFavorite = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.includes(id)) {
    const updated = favorites.filter(fav => fav !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
  } else {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

const getFavorites = () => {
  return JSON.parse(localStorage.getItem('favorites')) || [];
};


const filterFavorites = document.querySelector('#filter-favorites');
let isFavoritesActive = false;

filterFavorites.addEventListener('click', () => {
  isFavoritesActive = !isFavoritesActive;
  applyFiltersAndSort();
});


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

const applySort = (deals) => {
  const sortOption = selectSort.value;

  let sortedDeals = [...deals];

  switch (sortOption) {
    case 'price-asc':
      sortedDeals.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedDeals.sort((a, b) => b.price - a.price);
      break;
    case 'date-asc':
      sortedDeals.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date-desc':
      sortedDeals.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
  }

  return sortedDeals;
};


// Ajoute cette fonction juste après applySort :
const applyFiltersAndSort = () => {
  let filteredDeals = [...currentDeals];

  if (isBestDiscountActive) {
    filteredDeals = filteredDeals.filter(deal => deal.discount > 50);
  }
  if (isMostCommentedActive) {
    filteredDeals = filteredDeals.filter(deal => deal.comments && deal.comments > 15);
  }
  if (isHotDealsActive) {
    filteredDeals = filteredDeals.filter(deal => deal.hot && deal.hot > 100);
  }
  if (isFavoritesActive) {
    const favoriteIds = getFavorites();
    filteredDeals = filteredDeals.filter(deal => favoriteIds.includes(deal.uuid));
  }


  // Applique le tri sur les deals filtrés
  const sortedDeals = applySort(filteredDeals);

  // Affiche le résultat trié et filtré
  renderDeals(sortedDeals);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};

const renderSales = (sales) => {
  const section = document.querySelector('#indicators');
  const salesHTML = sales
    .map(sale => {
      return `
        <div class="sale">
          <a href="${sale.link}" target="_blank">${sale.title}</a>
          <span>${sale.price} €</span>
          <span>${new Date(sale.published).toLocaleDateString()}</span>
        </div>
      `;
    })
    .join('');

  // Supprimer l'ancienne div s'il y en a une
  const oldDiv = document.querySelector('#sales');
  if (oldDiv) oldDiv.remove();

  section.innerHTML += `
    <div id="sales">
      <h3>Vinted Sales</h3>
      ${salesHTML}
    </div>
  `;

  // 🟡 ICI : on ajoute les stats en toute fin
  const stats = computeStats(sales);

  document.querySelector('#nbSales').textContent = sales.length;
  document.querySelectorAll('#indicators > div span')[3].textContent = `${stats.p5} €`;
  document.querySelectorAll('#indicators > div span')[5].textContent = `${stats.p25} €`;
  document.querySelectorAll('#indicators > div span')[7].textContent = `${stats.p50} €`;
  document.querySelectorAll('#indicators > div span')[9].textContent = `${stats.lifetime} days`;
};



const computeStats = (sales) => {
  const prices = sales.map(s => parseFloat(s.price)).sort((a, b) => a - b);
  const timestamps = sales.map(s => new Date(s.published).getTime()).sort((a, b) => a - b);

  const average = prices.reduce((sum, val) => sum + val, 0) / prices.length;

  const getPercentile = (array, percentile) => {
    const index = Math.floor(percentile * array.length);
    return array[index] ?? 0;
  };

  const p5 = getPercentile(prices, 0.05);
  const p25 = getPercentile(prices, 0.25);
  const p50 = getPercentile(prices, 0.5);

  // Lifetime = différence entre date la plus ancienne et la plus récente
  const lifetimeMs = timestamps[timestamps.length - 1] - timestamps[0];
  const lifetimeDays = Math.round(lifetimeMs / (1000 * 60 * 60 * 24));

  return {
    average: average.toFixed(2),
    p5: p5.toFixed(2),
    p25: p25.toFixed(2),
    p50: p50.toFixed(2),
    lifetime: lifetimeDays
  };
};




/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), parseInt(selectShow.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});




document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

let isBestDiscountActive = false;

filterBestDiscount.addEventListener('click', () => {
    isBestDiscountActive = !isBestDiscountActive;
    applyFiltersAndSort();
});

let isMostCommentedActive = false;

filterMostCommented.addEventListener('click', () => {
    isMostCommentedActive = !isMostCommentedActive;
    applyFiltersAndSort();
});


let isHotDealsActive = false;

filterHotDeals.addEventListener('click', () => {
    isHotDealsActive = !isHotDealsActive;
    applyFiltersAndSort();
});


selectSort.addEventListener('change', () => {
  applyFiltersAndSort();
});

selectLegoSetIds.addEventListener('change', async (event) => {
  const selectedId = event.target.value;

  const sales = await fetchSales(selectedId);
  renderSales(sales);
});

