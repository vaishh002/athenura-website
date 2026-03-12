(function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => observer.observe(el));

    const sendBtn = document.getElementById('sendWA');
    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            const name = document.getElementById('name')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            let text = 'Hello Athenura, I would like to inquire about your services.%0A';
            if (name) text += `Name: ${name}%0A`;
            if (phone) text += `Phone: ${phone}%0A`;
            if (email) text += `Email: ${email}%0A`;
            if (message) text += `Message: ${message}%0A`;
            else text += 'I would like to discuss a project.';

            const whatsappURL = `https://wa.me/919835051934?text=${text}`;
            window.open(whatsappURL, '_blank');
        });
    }
})();
