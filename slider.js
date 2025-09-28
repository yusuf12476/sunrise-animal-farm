document.addEventListener('DOMContentLoaded', () => {
    // Function to initialize a slider
    function initializeSlider(containerSelector, slideSelector, options = {}) {
        const sliderContainer = document.querySelector(containerSelector);
        if (!sliderContainer) return;

        const slider = sliderContainer.querySelector(slideSelector);
        if (!slider) return;

        const {
            durationPerSlide = 10, // Default duration per slide
            animationName = 'slideAnimation'
        } = options;

        const slides = Array.from(slider.children);
        const originalSlideCount = slides.length;
        if (originalSlideCount === 0) return;

        // Clone slides for the infinite loop effect
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            slider.appendChild(clone);
        });

        const totalSlides = slider.children.length;
        const animationDuration = originalSlideCount * durationPerSlide;

        // Inject keyframes into a style tag
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${animationName} {
                from { transform: translateX(0%); }
                to { transform: translateX(-${100 * (originalSlideCount / totalSlides)}%); }
            }
        `;
        document.head.appendChild(style);

        slider.style.animation = `${animationName} ${animationDuration}s linear infinite`;

        // Pause on hover
        sliderContainer.addEventListener('mouseenter', () => { slider.style.animationPlayState = 'paused'; });
        sliderContainer.addEventListener('mouseleave', () => { slider.style.animationPlayState = 'running'; });
    }

    // Initialize the featured products slider on products.html
    initializeSlider('#products .slider-container', '.slider', { durationPerSlide: 5, animationName: 'productSlide' });

    // Initialize the testimonials slider on index.html
    initializeSlider('#testimonials-slider .slider-container', '.slider', { durationPerSlide: 10, animationName: 'testimonialSlide' });
});