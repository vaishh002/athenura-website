function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');

    if (!nav) return;

    nav.classList.toggle('open');

    if (btn) btn.classList.toggle('active');
}

function setActiveNav() {
    const current = location.pathname.split("/").pop();

    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
    });
}

function initContactForm() {

    const waButton = document.getElementById('sendWA');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (!waButton) return;

    function clearError(field) {
        field.classList.remove('input-error');
    }

    function markError(field) {
        field.classList.add('input-error');
    }

    [nameInput, phoneInput, emailInput, messageInput].forEach(field => {
        field.addEventListener('input', () => clearError(field));
    });

    waButton.addEventListener('click', function () {

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;

        if (name === '') {
            markError(nameInput);
            isValid = false;
        } else clearError(nameInput);

        if (phone === '') {
            markError(phoneInput);
            isValid = false;
        } else clearError(phoneInput);

        if (email === '') {
            markError(emailInput);
            isValid = false;
        } else clearError(emailInput);

        if (message === '') {
            markError(messageInput);
            isValid = false;
        } else clearError(messageInput);

        if (!isValid) {
            alert('⚠️ Please fill in all fields before sending.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            markError(emailInput);
            alert('📧 Please enter a valid work email address (e.g., you@company.com).');
            return;
        }

        const messagePreview = `✋ Hello! My name is ${name}.
📞 Phone: ${phone}
📧 Email: ${email}
💬 Message: ${message}`;

        alert(`✅ Message sent successfully.\n\n${messagePreview}`);

    });
}

document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    initContactForm();
});
function initFadeAnimation() {
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("show");
        }, index * 120);
    });
}
window.addEventListener("load", initFadeAnimation);