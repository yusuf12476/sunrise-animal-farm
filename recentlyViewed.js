const RECENTLY_VIEWED_KEY = 'sunriseFarmRecentlyViewed';
const MAX_RECENTLY_VIEWED = 4; // Show up to 4 recently viewed items

/**
 * Adds a product to the recently viewed list in localStorage.
 * It avoids duplicates and keeps the list at a maximum size.
 * @param {object} product - The product object to add.
 */
function addRecentlyViewedItem(product) {
    if (!product || !product.id) return;

    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    // Remove the item if it already exists to move it to the front
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);

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

    // We can reuse the createProductCardHTML function if it's globally available,
    // but to keep this modular, we'll define a simple card here.
    container.innerHTML = recentlyViewed.map(product => `
        <div class="group bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2">
            <div class="relative overflow-hidden">
                <a href="products.html#product-${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110">
                </a>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-semibold mb-2 text-gray-800">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4 flex-grow">${product.description}</p>
            </div>
        </div>
    `).join('');
}

// Render the items when the page loads
document.addEventListener('DOMContentLoaded', renderRecentlyViewed);