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

}

document.addEventListener('DOMContentLoaded', initializeMain);