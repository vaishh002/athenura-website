(function () {
    'use strict';

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const navbar = document.getElementById('navbar');

    function openNav() {
        navLinks?.classList.add('open');
        hamburger?.classList.add('open');
        hamburger?.setAttribute('aria-expanded', 'true');

        if (navBackdrop) {
            navBackdrop.style.display = 'block';
            setTimeout(() => navBackdrop.classList.add('visible'), 10);
        }

        document.body.classList.add('nav-open');
    }
    function closeNav() {
        navLinks?.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');

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

    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.contains('open') ? closeNav() : openNav();
    });

    navBackdrop?.addEventListener('click', closeNav);

    navLinks?.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) closeNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeNav();
    });

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });

    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
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

(function () {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;

            const show = category === "all" || cardCategory === category;
            card.classList.toggle("hidden", !show);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            filterButtons.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            filterProjects(btn.dataset.filter);
        });
    });

    filterProjects("all");

})();