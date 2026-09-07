/**
 * @typedef {Object} ShopifyObject
 * @property {Object} [routes]
 * @property {string} [routes.root]
 */

document.addEventListener('DOMContentLoaded', () => {
  const LOCAL_STORAGE_KEY = 'recently_viewed_products';
  const MAX_ITEMS = 10;

  // Capture Logic
  if (window.location.pathname.includes('/products/')) {
    const parts = window.location.pathname.split('/products/');
    // part[1] is the handle segment
    const handleSegment = parts[1];
    if (parts.length > 1 && handleSegment) {
      const handle = handleSegment.split('/')[0].split('?')[0];
      if (handle) {
        updateRecentlyViewed(handle);
      }
    }
  }

  /**
   * Updates the local storage with the visited product handle
   * @param {string} handle 
   */
  function updateRecentlyViewed(handle) {
    /** @type {string[]} */
    let viewed = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      viewed = stored ? JSON.parse(stored) : [];
    } catch (e) {
      viewed = [];
    }

    // Remove if exists to move to top
    viewed = viewed.filter(h => h !== handle);
    // Add to front
    viewed.unshift(handle);
    // Limit
    viewed = viewed.slice(0, MAX_ITEMS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(viewed));
  }

  // Render Logic
  const container = document.querySelector('#recently-viewed-container');
  if (container) {
    /** @type {string[]} */
    let viewed = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      viewed = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing recently viewed', e);
    }

    // Find the parent section to hide/show it
    const sectionElement = container.closest('.shopify-section');

    if (viewed.length === 0) {
      if (sectionElement instanceof HTMLElement) {
        sectionElement.style.display = 'none';
      }
      return;
    }

    const query = viewed.map(h => `handle:${h}`).join(' OR ');

    // safe access to Shopify.routes.root
    const shopifyObj = /** @type {ShopifyObject} */ (window.Shopify || {});
    const root = (shopifyObj.routes && shopifyObj.routes.root) || '/';

    // Construct search URL
    const searchUrl = `${root}search?type=product&q=${encodeURIComponent(query)}&section_id=recently-viewed-products-ajax`;

    fetch(searchUrl)
      .then(res => res.text())
      .then(text => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;

        const items = tempDiv.querySelectorAll('.product-grid__item');

        if (items.length > 0) {
          container.innerHTML = '';

          // Map for sorting
          /** @type {Object.<string, Element>} */
          const productMap = {};

          items.forEach(item => {
            const link = item.querySelector('a');
            const href = link ? link.getAttribute('href') : '';

            // Extract handle from href e.g. /products/handle?variant=...
            if (href && href.includes('/products/')) {
              const parts = href.split('/products/');
              if (parts[1]) {
                const h = parts[1].split('?')[0];
                if (h) productMap[h] = item;
              }
            }
          });

          // Append in correct order
          viewed.forEach(h => {
            if (productMap[h]) {
              container.appendChild(productMap[h]);
            }
          });

          // Show the section
          const sectionWrapper = container.closest('.recently-viewed-section');
          if (sectionWrapper instanceof HTMLElement) {
            sectionWrapper.style.display = 'block';
          }

        } else {
          const sectionWrapper = container.closest('.recently-viewed-section');
          if (sectionWrapper instanceof HTMLElement) {
            sectionWrapper.style.display = 'none';
          }
        }
      })
      .catch(e => console.error('Recently Viewed Fetch Error:', e));
  }
});
