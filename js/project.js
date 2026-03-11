function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
    });
});
window.addEventListener("load", () => {
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("show");
        }, index * 120);
    });
});
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === "all" || cardCategory === category) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}
filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        filterButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        filterProjects(this.getAttribute("data-filter"));
    });
});
filterProjects("all");