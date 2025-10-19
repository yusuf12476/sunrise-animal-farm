document.addEventListener('DOMContentLoaded', () => {
    // Timeline Animation Logic
    const timelineElements = document.querySelectorAll('.timeline-element');

    if (timelineElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        timelineElements.forEach(element => {
            observer.observe(element);
        });
    }
});