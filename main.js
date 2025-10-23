function initializeMain() {
    // Back to Top Button
    const toTopButton = document.getElementById("to-top-button");

    if (toTopButton) {
        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function () {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                toTopButton.classList.remove("opacity-0", "invisible");
                toTopButton.classList.add("opacity-100", "visible");
            } else {
                toTopButton.classList.remove("opacity-100", "visible");
                toTopButton.classList.add("opacity-0", "invisible");
            }
        };

        // When the user clicks on the button, scroll to the top of the document
        toTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Check if the splash screen has been seen in this session
        if (sessionStorage.getItem('splashSeen') === 'true') {
            // If seen, hide it immediately without animation
            splashScreen.style.display = 'none';
        } else {
            // If not seen, show it and then fade it out on window load
            window.addEventListener('load', () => {
                // Start the fade-out
                splashScreen.classList.add('opacity-0');

                // Remove from DOM after transition
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 1000); // Matches transition duration
            });
            // Set the flag in sessionStorage so it doesn't show again on next page navigation
            sessionStorage.setItem('splashSeen', 'true');
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeMain);