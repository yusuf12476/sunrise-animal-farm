document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('legal-modal-overlay');
    const modalTitle = document.getElementById('legal-modal-title');
    const modalBody = document.getElementById('legal-modal-body');
    const closeModalButton = document.getElementById('legal-modal-close');
    let lastFocusedElement;

    const legalContent = {
        'terms': {
            title: 'Terms of Service',
            content: `
                <h3>1. Introduction</h3>
                <p>Welcome to Sunrise Farm. By accessing our website, you agree to these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                <h3>2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials on Sunrise Farm's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                <h3>3. Disclaimer</h3>
                <p>The materials on Sunrise Farm's website are provided on an 'as is' basis. Sunrise Farm makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <h3>4. Limitations</h3>
                <p>In no event shall Sunrise Farm or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sunrise Farm's website.</p>
                <h3>5. Governing Law</h3>
                <p>These terms and conditions are governed by and construed in accordance with the laws of the land and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            `
        },
        'privacy': {
            title: 'Privacy Policy',
            content: `
                <h3>1. Information We Collect</h3>
                <p>We may collect personal information that you voluntarily provide to us, such as your name, email address, and phone number when you fill out a contact form or make a purchase.</p>
                <h3>2. How We Use Your Information</h3>
                <p>We use the information we collect to process your orders, respond to your inquiries, and improve our services. We will not share your personal information with third parties without your consent, except as required by law.</p>
                <h3>3. Security</h3>
                <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.</p>
                <h3>4. Your Rights</h3>
                <p>You have the right to access, correct, or delete your personal information. Please contact us to make such a request.</p>
            `
        },
        'cookie': {
            title: 'Cookie Policy',
            content: `
                <h3>1. What Are Cookies?</h3>
                <p>Cookies are small text files that are placed on your device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
                <h3>2. How We Use Cookies</h3>
                <p>We use cookies to understand how you use our website, to remember your preferences (such as cart items), and to improve your user experience.</p>
                <h3>3. Types of Cookies We Use</h3>
                <p><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.</p>
                <p><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                <h3>4. Managing Cookies</h3>
                <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
            `
        }
    };

    // Legal Modal Logic
    function openModal(type) {
        lastFocusedElement = document.activeElement;
        const { title, content } = legalContent[type];
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalOverlay.classList.remove('hidden');
        modalOverlay.setAttribute('aria-hidden', 'false');
        // Trap focus
        document.addEventListener('keydown', trapFocus);
        // Focus the close button for accessibility
        closeModalButton.focus();
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        modalOverlay.setAttribute('aria-hidden', 'true');
        if (lastFocusedElement) {
            document.removeEventListener('keydown', trapFocus);
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const type = e.currentTarget.getAttribute('data-modal-trigger');
            openModal(type);
        });
    });

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    function trapFocus(e) {
        if (modalOverlay.classList.contains('hidden')) return;

        const focusableElements = modalOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift + tab is pressed
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // if tab is pressed
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});