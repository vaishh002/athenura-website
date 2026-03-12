function toggleMenu() {
    const nav = document.getElementById("navLinks");
    const btn = document.getElementById("hamburger");
    if (!nav) return;
    nav.classList.toggle("open");
    if (btn) btn.classList.toggle("active");
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks')?.classList.remove('open');
    });
});

function setActiveNav() {
    const current = location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === current) link.classList.add("active");
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    const categoryBtns = document.querySelectorAll(".category-btn");
    const searchInput = document.getElementById("search");
    let activeCategory = "general";

    function filterFAQs() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        faqItems.forEach(item => {
            const category = item.dataset.category;
            const categoryMatch = category === activeCategory;
            if (!categoryMatch) {
                item.hidden = true;
                item.classList.remove("active");
                return;
            }
            if (searchTerm === "") {
                item.hidden = false;
            } else {
                const q = item.querySelector(".faq-question")?.innerText.toLowerCase() || "";
                const a = item.querySelector(".faq-answer")?.innerText.toLowerCase() || "";
                item.hidden = !(q.includes(searchTerm) || a.includes(searchTerm));
            }
            if (item.hidden) item.classList.remove("active");
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.category;
            filterFAQs();
        });
    });

    if (searchInput) searchInput.addEventListener("input", filterFAQs);

    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const item = btn.closest(".faq-item");
            if (item.hidden) return;
            const wasActive = item.classList.contains("active");
            faqItems.forEach(i => i.classList.remove("active"));
            if (!wasActive) item.classList.add("active");
        });
    });

    filterFAQs();
}

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("fullname")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const msg = document.getElementById("message")?.value.trim();
        if (!name || !email || !msg) {
            alert("Please fill in all required fields.");
            return;
        }
        alert(`Thank you, ${name.split(" ")[0]}!\nYour message has been sent.`);
        form.reset();
    });
}

function initMapButton() {
    const btn = document.getElementById("directionsBtn");
    if (btn) btn.addEventListener("click", () => window.open("https://www.google.com/maps/place/Athenura", "_blank"));
}

function initFadeAnimation() {
    document.querySelectorAll(".fade-up").forEach((el, i) => {
        setTimeout(() => el.classList.add("show"), i * 120);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    initFAQ();
    initContactForm();
    initMapButton();
});
window.addEventListener("load", initFadeAnimation);