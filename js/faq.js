function toggleMenu() {
    const nav = document.getElementById("navLinks");
    const btn = document.getElementById("hamburger");
    if (!nav) return;
    nav.classList.toggle("open");
    if (btn) btn.classList.toggle("active");
}
function setActiveNav() {
    const current = location.pathname.split("/").pop();
    document.querySelectorAll("nav a").forEach(link => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
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
                const questionText =
                    item.querySelector(".faq-question")?.innerText.toLowerCase() || "";
                const answerText =
                    item.querySelector(".faq-answer")?.innerText.toLowerCase() || "";

                const matchesSearch =
                    questionText.includes(searchTerm) || answerText.includes(searchTerm);

                item.hidden = !matchesSearch;
            }
            if (item.hidden) {
                item.classList.remove("active");
            }
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
    if (searchInput) {
        searchInput.addEventListener("input", filterFAQs);
    }
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            if (item.hidden) return;
            const isOpen = item.classList.contains("active");
            faqItems.forEach(el => el.classList.remove("active"));
            if (!isOpen) {
                item.classList.add("active");
            }
        });
    });
    filterFAQs();
}
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("fullname")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const message = document.getElementById("message")?.value.trim();
        if (!name || !email || !message) {
            alert("Please fill in all required fields.");
            return;
        }
        setTimeout(() => {
            alert(`Thank you, ${name.split(" ")[0]}!\nYour message has been sent.`);
            contactForm.reset();
        }, 600);
    });
}
function initMapButton() {
    const directionsBtn = document.getElementById("directionsBtn");
    if (!directionsBtn) return;
    directionsBtn.addEventListener("click", () => {
        window.open(
            "https://www.google.com/maps/place/Athenura",
            "_blank"
        );
    });
}
function initFadeAnimation() {
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("show");
        }, index * 120);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    initFAQ();
    initContactForm();
    initMapButton();
});
window.addEventListener("load", initFadeAnimation);