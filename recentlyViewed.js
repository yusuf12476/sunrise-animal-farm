const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENTLY_VIEWED = 4; // Show up to 4 recently viewed items

/**
 * Adds a product to the recently viewed list in localStorage.
 * It avoids duplicates and keeps the list at a maximum size.
 * @param {object} product - The product object to add.
 * @param {string} product.name - The name of the product.
 * @param {number} product.price - The price of the product.
 * @param {string} product.image - The source URL for the product image.
 * @param {string} product.pageUrl - The URL of the page the product is on.
 * @param {string} product.productId - A unique ID for the product.
 */
function addRecentlyViewedItem(product) {
    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    // Remove the item if it already exists to move it to the front
    recentlyViewed = recentlyViewed.filter(item => item.name !== product.name);

    // Add the new item to the beginning of the array
    recentlyViewed.unshift(product);

    // Trim the array to the maximum size
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    renderRecentlyViewed(); // Re-render whenever an item is added
}

/**
 * Renders the recently viewed items into the designated container.
 */
function renderRecentlyViewed() {
    const container = document.getElementById('recently-viewed-container');
    if (!container) return;

    const recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    const section = document.getElementById('recently-viewed-section');

    if (recentlyViewed.length === 0) {
        if (section) section.classList.add('hidden');
        return;
    }

    if (section) section.classList.remove('hidden');

    container.innerHTML = recentlyViewed.map(item => `
        <div class="product-card bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden group">
            <div class="relative overflow-hidden">
                <a href="${item.pageUrl}#product-${item.productId}">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
                <div class="mt-auto">
                    <span class="text-xl font-bold text-gray-800">Ksh ${item.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render the items when the page loads
document.addEventListener('DOMContentLoaded', renderRecentlyViewed);