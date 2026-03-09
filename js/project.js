(function () {
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll("#navLinks a");

  function toggleMenu(e) {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("open");
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinksContainer.classList.remove("open");
  }

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        closeMenu();
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
    if (link.getAttribute("href") === "#") {
      link.addEventListener("click", e => e.preventDefault());
    }
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  function filterProjects(category) {
    projectCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filterValue = this.getAttribute('data-filter');
      filterProjects(filterValue);
    });
  });

  filterProjects('all');

  const form = document.getElementById("partnershipForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
})();
