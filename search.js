document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');

    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.remove('hidden');
            searchInput.focus();
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.add('hidden');
        });
    }

    if (searchOverlay) {
        // Close search when clicking anywhere else on the document
        document.addEventListener('click', (e) => {
            // Check if the click is outside the search overlay's content
            // and not on the search icon itself.
            const isClickInside = searchOverlay.contains(e.target);
            if (!isClickInside && e.target !== searchIcon && !searchIcon.contains(e.target)) {
                searchOverlay.classList.add('hidden');
            }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (!query) return; // Don't search for empty strings

            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        });
    }

    // For search results page
    const resultsContainer = document.getElementById('search-results-container');
    if (resultsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const queryDisplay = document.getElementById('search-query-display');
        
        if(queryDisplay) queryDisplay.textContent = query;

        if (query) {
            initializeSearch(query);
        }
    }

    async function initializeSearch(query) {
        const pages = [
            { url: 'search.html', title: 'Search' },
            { url: 'index.html', title: 'Home' },
            { url: 'about.html', title: 'About Us' },
            { url: 'products.html', title: 'Products' },
            { url: 'contact.html', title: 'Contact' },
            { url: 'gallery.html', title: 'Gallery' },
            { url: 'bulls.html', title: 'Bulls & Heifers' },
            { url: 'chicken.html', title: 'Chickens' },
            { url: 'ducks.html', title: 'Ducks' },
            { url: 'goats.html', title: 'Goats' },
            { url: 'rabbits.html', title: 'Rabbits' },
            { url: 'sheep.html', title: 'Sheep' },
            { url: 'turkey.html', title: 'Turkeys' },
            { url: 'geese.html', title: 'Geese' },
            { url: 'fish.html', title: 'Fish' },
        ];
        const spinner = document.getElementById('search-spinner');
        const resultsContainer = document.getElementById('search-results-container');

        spinner.style.display = 'block';
        resultsContainer.innerHTML = '';
        
        // Check if lunr is available
        if (typeof lunr === 'undefined') {
            console.error('lunr.js is not loaded. Make sure it is included in your search.html.');
            resultsContainer.innerHTML = '<p class="text-red-500 text-center">Error: Search library not loaded.</p>';
            return;
        }

        const documents = [];
        for (const page of pages) {
            try {
                const res = await fetch(page.url);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('main')?.innerText || '';
                documents.push({
                    id: page.url,
                    title: page.title,
                    content: content,
                    url: page.url
                });
            } catch (e) {
                console.error(`Failed to fetch ${page.url}`, e);
            }
        }

        const idx = lunr(function () {
            this.ref('id');
            this.field('title');
            this.field('content');

            documents.forEach(function (doc) {
                this.add(doc);
            }, this);
        });

        const results = idx.search(query);
        displayResults(results, documents, query);
    }

    function displayResults(results, documents, query) {
        const resultsContainer = document.getElementById('search-results-container');
        const spinner = document.getElementById('search-spinner');
        if (results.length) {
            resultsContainer.innerHTML = results.map(result => {
                const doc = documents.find(d => d.id === result.ref);
                const snippet = createSnippet(doc.content, query);
                return `<div class="bg-white p-6 rounded-lg shadow-md mb-4">
                    <h3 class="text-xl font-bold"><a href="${doc.url}" class="text-yellow-600 hover:underline">${doc.title}</a></h3>
                    <p class="text-gray-600 mt-2">${snippet}</p>
                </div>`;
            }).join('');
        } else {
            resultsContainer.innerHTML = '<p class="text-center text-gray-600">No results found for your query.</p>';
        }
        spinner.style.display = 'none';
    }

    function createSnippet(content, query) {
        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerContent.indexOf(lowerQuery);
        const snippetLength = 150;

        if (index === -1) {
            return content.substring(0, snippetLength) + '...';
        }

        const start = Math.max(0, index - Math.floor(snippetLength / 2));
        let snippet = content.substring(start, start + snippetLength);

        // Highlight the search term
        const regex = new RegExp(query, 'gi');
        snippet = snippet.replace(regex, (match) => `<strong class="bg-yellow-200">${match}</strong>`);

        return (start > 0 ? '...' : '') + snippet + '...';
    }
});