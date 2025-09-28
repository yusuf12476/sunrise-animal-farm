document.addEventListener('DOMContentLoaded', () => {
    const SHIPPING_COST = 250; // Fixed shipping cost in Ksh

    const summaryItemsContainer = document.getElementById('summary-items-container');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');

    let tempOrderData = null; // Module-level variable to hold order data temporarily

    if (!summaryItemsContainer) return;

    // Check if getCart function is available
    if (typeof getCart !== 'function') {
        console.error('getCart function not available. Make sure cart.js is loaded.');
        return;
    }

    const cart = getCart();

    // Redirect to products page if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        window.location.href = 'products.html';
        return;
    }

    function renderCheckoutSummary() {
        let subtotal = 0;

        summaryItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md mr-3">
                        <div>
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
                        </div>
                    </div>
                    <span class="font-semibold">Ksh ${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        const total = subtotal + SHIPPING_COST;

        summarySubtotal.textContent = `Ksh ${subtotal.toFixed(2)}`;
        summaryTotal.textContent = `Ksh ${total.toFixed(2)}`;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form fields
            const formData = new FormData(checkoutForm);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const address = formData.get('address')?.trim();
            const city = formData.get('city')?.trim();
            const zip = formData.get('zip')?.trim();
            
            // Basic validation
            if (!name || !email || !address || !city || !zip) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Get fresh cart data
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty. Please add some items before checkout.');
                return;
            }
            
            // Store form data and cart for later use
            const formDataObj = {
                name: name,
                email: email,
                address: address,
                city: city,
                zip: zip
            };
            
            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + SHIPPING_COST;

            // Store order details temporarily
            tempOrderData = {
                formData: formDataObj,
                cart: cart,
                subtotal: subtotal,
                shipping: SHIPPING_COST,
                total: total,
                orderNumber: `SF-${Date.now()}`
            };
            
            // Show the order method selection modal
            showOrderMethodModal();
        });
    }

    // Order method selection modal functionality
    function showOrderMethodModal() {
        const modal = document.getElementById('order-method-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function hideOrderMethodModal() {
        const modal = document.getElementById('order-method-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Email order functionality
    function sendOrderViaEmail() {
        const orderData = tempOrderData;
        if (!orderData) return;

        const { subject, body } = createEmailOrderContent(orderData);

        // Create mailto link
        const mailtoUrl = `mailto:${FARM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open email client
        window.location.href = mailtoUrl;

        // Complete the order process (clears cart, redirects to thank you page)
        completeOrderProcess(orderData);
    }

    // Create Email order content
    function createEmailOrderContent(orderData) {
        const { formData, cart, subtotal, shipping, total, orderNumber } = orderData;
        
        const subject = `New Order from Sunrise Farm - ${orderNumber}`;

        let body = `Hello Sunrise Farm,\n\nI would like to place the following order:\n\nOrder Number: ${orderNumber}\n\nCustomer Details:\n  - Name: ${formData.name}\n  - Email: ${formData.email}\n  - Address: ${formData.address}, ${formData.city}, ${formData.zip}\n\nOrder Items:\n`;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            body += `  • ${item.name} (Qty: ${item.quantity}) - Ksh ${itemTotal.toFixed(2)}\n`;
        });
        
        body += `\nSubtotal: Ksh ${subtotal.toFixed(2)}\nShipping: Ksh ${shipping.toFixed(2)}\nTotal: Ksh ${total.toFixed(2)}\n\nPayment Method: Pay on Delivery\n\nPlease confirm this order and let me know the delivery details.\n\nThank you,\n${formData.name}`;
        
        return { subject, body };
    }

    // WhatsApp order functionality
    function sendOrderViaWhatsApp() {
        const orderData = tempOrderData;
        if (!orderData) return;

        const whatsappMessage = createWhatsAppOrderContent(orderData);
        
        const whatsappUrl = `https://wa.me/${FARM_PHONE_NUMBER.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Complete the order process
        completeOrderProcess(orderData);
    }

    // Create WhatsApp order content
    function createWhatsAppOrderContent(orderData) {
        const { formData, cart, subtotal, shipping, total, orderNumber } = orderData;
        
        let whatsappContent = `Hello! I would like to place an order from Sunrise Farm.

Order Number: ${orderNumber}

Customer Details:
Name: ${formData.name}
Email: ${formData.email}
Address: ${formData.address}
City: ${formData.city}
Postal Code: ${formData.zip}

Order Items:`;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            whatsappContent += `\n• ${item.name} - Qty: ${item.quantity} x Ksh ${item.price.toFixed(2)} = Ksh ${itemTotal.toFixed(2)}`;
        });
        
        whatsappContent += `\n\nOrder Total: Ksh ${total.toFixed(2)}
Payment Method: Pay on Delivery

Please confirm this order and let me know the delivery details. Thank you!`;
        
        return whatsappContent;
    }

    // Complete order process
    function completeOrderProcess(orderData) {
        // Store order details for the thank you page
        const orderDetails = {
            name: orderData.formData.name,
            email: orderData.formData.email,
            address: orderData.formData.address,
            city: orderData.formData.city,
            zip: orderData.formData.zip,
            cart: orderData.cart,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            total: orderData.total,
            orderNumber: orderData.orderNumber
        };
        
        sessionStorage.setItem(COMPLETED_ORDER_KEY, JSON.stringify(orderDetails));
        
        // Clear the cart
        clearCart();
        
        // Hide modal
        hideOrderMethodModal();
        
        // Show success message
        if (typeof showToast === 'function') {
            showToast('✅ Order sent successfully! Redirecting...');
        }
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    }

    // Modal event listeners
    const closeModalBtn = document.getElementById('close-order-method-modal');
    const cancelOrderBtn = document.getElementById('cancel-order-btn');
    const emailOrderBtn = document.getElementById('email-order-btn');
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
    const modal = document.getElementById('order-method-modal');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideOrderMethodModal);
    }

    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', hideOrderMethodModal);
    }

    if (emailOrderBtn) {
        emailOrderBtn.addEventListener('click', sendOrderViaEmail);
    }

    if (whatsappOrderBtn) {
        whatsappOrderBtn.addEventListener('click', sendOrderViaWhatsApp);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideOrderMethodModal();
            }
        });
    }

    renderCheckoutSummary();
});