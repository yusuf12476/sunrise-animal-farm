document.addEventListener('DOMContentLoaded', () => {
    const customerNamePlaceholder = document.getElementById('customer-name-placeholder');
    const orderNumberEl = document.getElementById('order-number'); // Corrected variable name
    const summaryItemsContainer = document.getElementById('summary-items-container');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryShippingEl = document.getElementById('summary-shipping');
    const summaryTotalEl = document.getElementById('summary-total');
    const summaryPaymentMethodEl = document.getElementById('summary-payment-method');

    // Retrieve order details from sessionStorage
    const orderDetails = JSON.parse(sessionStorage.getItem(COMPLETED_ORDER_KEY));

    // Check if cart.js is loaded and functions are available
    if (typeof updateCartCount !== 'function') {
        console.error('updateCartCount function not available. Make sure cart.js is loaded before thank-you.js');
        // No return here, as we can still try to render the page.
    }

    // If there are no order details, redirect to the homepage
    if (!orderDetails) {
        window.location.href = 'index.html';
        return;
    }

    // Populate the page with order details
    if (customerNamePlaceholder && orderDetails.name) {
        customerNamePlaceholder.textContent = `Hi ${orderDetails.name},`;
    }

    if (orderNumberEl && orderDetails.orderNumber) {
        orderNumberEl.textContent = orderDetails.orderNumber;
    }

    if (summaryItemsContainer && orderDetails.cart) {
        summaryItemsContainer.innerHTML = orderDetails.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-md mr-3">
                        <div>
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-gray-600">Qty: ${item.quantity}</p>
                        </div>
                    </div>
                    <span class="font-semibold">Ksh ${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');
    }

    if (summarySubtotalEl) {
        summarySubtotalEl.textContent = `Ksh ${orderDetails.subtotal.toFixed(2)}`;
    }
    if (summaryShippingEl) {
        summaryShippingEl.textContent = `Ksh ${orderDetails.shipping.toFixed(2)}`;
    }
    if (summaryTotalEl) {
        summaryTotalEl.textContent = `Ksh ${orderDetails.total.toFixed(2)}`;
    }

    if (summaryPaymentMethodEl && orderDetails.paymentMethod) {
        // Capitalize the first letter for better display
        summaryPaymentMethodEl.textContent = orderDetails.paymentMethod.charAt(0).toUpperCase() + orderDetails.paymentMethod.slice(1);
    }

    // Clear the order details from sessionStorage after displaying them
    // This prevents the details from showing up again if the user revisits the page
    sessionStorage.removeItem(COMPLETED_ORDER_KEY);

    // Ensure the cart count in the header is updated (should be 0)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});