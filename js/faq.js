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

function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("search");
  let activeCategory = "all";

  function filterFAQs() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    faqItems.forEach(item => {
      const category = item.dataset.category;
      const categoryMatch = activeCategory === "all" || category === activeCategory;
      if (!categoryMatch) {
        item.hidden = true;
        item.classList.remove("active");
        return;
      }
      if (searchTerm === "") {
        item.hidden = false;
      } else {
        const question = item.querySelector(".faq-question")?.innerText.toLowerCase() || "";
        const answer = item.querySelector(".faq-answer")?.innerText.toLowerCase() || "";
        item.hidden = !(question.includes(searchTerm) || answer.includes(searchTerm));
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

  if (searchInput) {
    searchInput.addEventListener("input", filterFAQs);
  }

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
}
initFAQ();

document.getElementById("directionsBtn")?.addEventListener("click", () => {
  window.open("https://www.google.com/maps/place/Athenura", "_blank");
});

document.getElementById('faqSearchForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
});

const modalOverlay = document.getElementById('supportModalOverlay');
const contactBtn = document.getElementById('contactSupportBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalForm = document.getElementById('supportModalForm');

function openModal() {
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
}
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

contactBtn?.addEventListener('click', openModal);
modalCloseBtn?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});
modalForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Message sent! 😅 deep backend nahi aata sirr');
  closeModal();
  modalForm.reset();
});