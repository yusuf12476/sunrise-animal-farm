document.addEventListener('DOMContentLoaded', () => {
    const dropdownContainer = document.getElementById('more-dropdown-container');
    const dropdownButton = document.getElementById('more-dropdown-button');
    const dropdownMenu = document.getElementById('more-dropdown-menu');

    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }
});