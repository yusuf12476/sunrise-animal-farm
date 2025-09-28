const CART_KEY = 'sunriseFarmCart';
const COMPLETED_ORDER_KEY = 'completedOrder';
const FARM_PHONE_NUMBER = '+254712345678'; // Farm's WhatsApp number
const FARM_EMAIL = 'orders@sunrisefarm.com'; // Farm's order email
let toastTimeout;

/**
 * Shows a toast notification message.
 * @param {string} message - The message to display.
 */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // Clear previous timeout if it exists
    clearTimeout(toastTimeout);

    // Hide the toast after 3 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Retrieves the cart from localStorage.
 * @returns {Array} The cart items.
 */
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Saves the cart to localStorage.
 * @param {Array} cart - The cart items to save.
 */
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

/**
 * Adds a product to the cart.
 * @param {object} product - The product to add.
 * @param {number} [quantity=1] - The quantity to add.
 */
function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        product.quantity = quantity;
        cart.push(product);
    }

    saveCart(cart);
    showToast(`✅ ${quantity} x ${product.name} added to cart!`);
}

/**
 * Updates the quantity of an item in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity.
 */
function updateQuantity(productId, quantity) {
    let cart = getCart();
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
    }

    saveCart(cart);
    renderCartPage(); // Re-render the cart page to show updates
}

/**
 * Removes an item from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartPage(); // Re-render the cart page
}

/**
 * Clears the entire cart.
 */
function clearCart() {
    saveCart([]);
    renderCartPage();
}

/**
 * Updates the cart item count in the header.
 */
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-item-count');

    if (cartCountElement) {
        cartCountElement.textContent = count;
        if (count > 0) {
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }
}

/**
 * Renders the items on the cart.html page.
 */
function renderCartPage() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-container');
    const orderSection = document.getElementById('order-section');
    const emptyMessage = document.getElementById('cart-empty-message');

    if (!cartContainer) return; // Only run on cart page

    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        cartContainer.appendChild(emptyMessage);
        emptyMessage.style.display = 'block';
        orderSection.classList.add('hidden');
        return;
    }

    emptyMessage.style.display = 'none';
    orderSection.classList.remove('hidden');
    
    let total = 0;
    const cartItemsHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-md mb-4">
                <div class="flex items-center mb-4 md:mb-0 flex-grow">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg mr-4">
                    <div>
                        <h4 class="text-xl font-semibold">${item.name}</h4>
                        <p class="text-gray-600">Ksh ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 flex-shrink-0">
                    <label for="qty-${item.id}" class="sr-only">Quantity</label>
                    <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', parseInt(this.value))" class="quantity-input border border-gray-300 rounded-md p-1">
                    <p class="text-lg font-bold w-28 text-right">Ksh ${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 text-xl"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
    
    cartContainer.innerHTML = cartItemsHTML;
    document.getElementById('cart-total-summary').textContent = `Ksh ${total.toFixed(2)}`;
}


// Event Listeners for cart page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-container')) {
        renderCartPage();
    }
    updateCartCount();
});