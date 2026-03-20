(function () {
  'use strict';
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');
  const navbar = document.getElementById('navbar');

  const modalOverlay = document.getElementById('supportModalOverlay');
  const contactBtn = document.getElementById('contactSupportBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalForm = document.getElementById('supportModalForm');

  const openNav = () => {
    navLinks?.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');

    if (navBackdrop) {
      navBackdrop.style.display = 'block';
      setTimeout(() => navBackdrop.classList.add('visible'), 10);
    }

    document.body.classList.add('nav-open');
  };

  const closeNav = () => {
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
  };

  const openModal = () => {
    modalOverlay?.classList.add('active');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modalOverlay?.classList.remove('active');
    document.body.classList.remove('modal-open');
  };
  const initFAQ = () => {
    const faqItems = document.querySelectorAll(".faq-item");
    const categoryBtns = document.querySelectorAll(".category-btn");
    const searchInput = document.getElementById("search");

    let activeCategory = "all";

    const filterFAQs = () => {
      const searchTerm = searchInput?.value.trim().toLowerCase() || "";

      faqItems.forEach(item => {
        const category = item.dataset.category;
        const categoryMatch = activeCategory === "all" || category === activeCategory;

        if (!categoryMatch) {
          item.hidden = true;
          item.classList.remove("active");
          return;
        }

        const question = item.querySelector(".faq-question")?.innerText.toLowerCase() || "";
        const answer = item.querySelector(".faq-answer")?.innerText.toLowerCase() || "";

        const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm);

        item.hidden = searchTerm ? !matchesSearch : false;

        if (item.hidden) item.classList.remove("active");
      });
    };
    categoryBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        filterFAQs();
      });
    });

    searchInput?.addEventListener("input", filterFAQs);
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        if (item.hidden) return;

        const wasActive = item.classList.contains("active");
        faqItems.forEach(i => i.classList.remove("active"));

        if (!wasActive) item.classList.add("active");
      });
    });

    filterFAQs();
  };

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });

  navBackdrop?.addEventListener('click', closeNav);

  navLinks?.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      if (modalOverlay?.classList.contains('active')) closeModal();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });

  contactBtn?.addEventListener('click', openModal);
  modalCloseBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Form submit (WhatsApp)
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const inquiry = document.getElementById('inquiryType').value;
    const message = document.getElementById('messageText').value.trim();

    const text = `*New Support Request*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Inquiry:* ${encodeURIComponent(inquiry)}%0A*Message:* ${encodeURIComponent(message)}`;

    window.open(`https://wa.me/919835051934?text=${text}`, '_blank');

    closeModal();
    modalForm.reset();
  });

  document.getElementById("directionsBtn")?.addEventListener("click", () => {
    window.open("https://www.google.com/maps/place/Athenura", "_blank");
  });

  document.getElementById('faqSearchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  initFAQ();

})();