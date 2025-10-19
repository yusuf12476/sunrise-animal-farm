document.addEventListener('DOMContentLoaded', () => {
    // This array would ideally be in a shared file, but for this example, we'll define it here.
    const allProducts = [
        { id: 'fresh-eggs', name: 'Fresh Eggs', price: 500, image: 'images/chicken eggs.jpg', category: 'dairy-eggs', description: 'Farm-fresh eggs from our free-range chickens.', unit: 'tray' },
        { id: 'duck-eggs', name: 'Duck Eggs', price: 600, image: 'images/duck eggs.jpg', category: 'dairy-eggs', description: 'Rich and delicious eggs from our pasture-raised ducks.', unit: 'tray' },
        { id: 'goat-cheese', name: 'Goat Cheese', price: 800, image: 'images/goat cheese.jpg', category: 'dairy-eggs', description: 'Creamy and tangy handcrafted goat cheese.', unit: 'kg' },
        { id: 'beef', name: 'Beef', price: 1200, image: 'images/beef.jpg', category: 'meat', description: 'High-quality, grass-fed beef from our healthy cattle.', unit: 'kg' },
        { id: 'raw-honey', name: 'Raw Honey', price: 750, image: 'images/honey.jpg', category: 'bee-products', description: 'Pure, raw honey from our hardworking bees.', unit: 'jar' },
        { id: 'dressed-duck', name: 'Dressed Duck', price: 1200, image: 'images/dressed duck.jpg', category: 'meat', description: 'Premium dressed duck, perfect for special occasions.', unit: 'kg' },
        { id: 'lamb-meat', name: 'Lamb', price: 1400, image: 'images/lamb meat.webp', category: 'meat', description: 'Tender, pasture-raised lamb with a delicate flavor.', unit: 'kg' },
        { id: 'whole-tilapia', name: 'Whole Tilapia', price: 500, image: 'images/tilapia.jpg', category: 'fish', description: 'Fresh, whole tilapia, cleaned and ready to cook.', unit: 'kg' },
    ];

    const featuredProductIds = ['goat-cheese', 'raw-honey', 'beef', 'dressed-duck'];

    function renderFeaturedProducts() {
        const featuredGrid = document.getElementById('featured-products-grid');
        if (!featuredGrid) return;

        const featuredProducts = allProducts.filter(p => featuredProductIds.includes(p.id));

        featuredGrid.innerHTML = featuredProducts.map(product => `
            <div class="group bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div class="relative overflow-hidden">
                    <a href="products.html#product-${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110">
                    </a>
                    <div class="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold px-3 py-1 m-4 rounded-full">
                        Ksh ${product.price}
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-4 flex-grow">${product.description}</p>
                    <div class="mt-auto">
                        <button 
                            onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}'}, 1)" 
                            class="w-full px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg shadow-sm hover:bg-green-200 transition-colors duration-300 flex items-center justify-center gap-2">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedProducts();
});