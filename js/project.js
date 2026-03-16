(function () {
    'use strict';

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const navbar = document.getElementById('navbar');

    function openNav() {
        if (!navLinks || !hamburger) return;
        navLinks.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');

        if (navBackdrop) {
            navBackdrop.style.display = 'block';
            setTimeout(() => navBackdrop.classList.add('visible'), 10);
        }
        document.body.classList.add('nav-open');
    }

    function closeNav() {
        if (!navLinks || !hamburger) return;
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');

        if (navBackdrop) {
            navBackdrop.classList.remove('visible');
            setTimeout(() => {
                if (!navBackdrop.classList.contains('visible')) {
                    navBackdrop.style.display = 'none';
                }
            }, 400);
        }
        document.body.classList.remove('nav-open');
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.contains('open') ? closeNav() : openNav();
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeNav);
    }

    if (navLinks) {
        navLinks.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open')) {
                closeNav();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeNav();
    });

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 12);
        }, { passive: true });
    }

    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
})();

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