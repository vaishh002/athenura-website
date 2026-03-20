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

  const slidesContainer = document.getElementById('testimonialSlides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.dot');
  if (slidesContainer && prevBtn && nextBtn) {
    const totalSlides = document.querySelectorAll('.testimonial-card').length;
    let currentIndex = 0;

    function updateSlider() {
      const slideWidth = slidesContainer.children[0]?.clientWidth || 0;
      slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
      updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlider, 100);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { nextSlide(); e.preventDefault(); }
    });

    setTimeout(updateSlider, 20);
  }

  const form = document.getElementById("partnershipForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll("input[required]");
      const select = form.querySelector("select[required]");

      inputs.forEach(el => el.style.border = "1px solid #d1d5db");
      if (select) select.style.border = "1px solid #d1d5db";

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.border = "2px solid red";
          isValid = false;
        }
      });

      if (select && !select.value) {
        select.style.border = "2px solid red";
        isValid = false;
      }

      const emailInput = form.querySelector("input[type='email']");
      if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(emailInput.value.trim())) {
          emailInput.style.border = "2px solid red";
          alert("Please enter a valid email address");
          isValid = false;
        }
      }

      if (isValid) {
        const phone = "919835051934";
        const message = encodeURIComponent("Hello, I am interested in a partnership with Athenura. Please share more details.");
        window.location.href = `https://wa.me/${phone}?text=${message}`;
      }
    });
  }

  // ✅ UPDATED: Download & Open button logic
  const downloadCheckbox = document.querySelector('.download-btn-wrapper .input');

  if (downloadCheckbox) {
    const pdfPath = 'assets/images/athenura.pdf';

    downloadCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // Checkbox checked → "Open" text dikh raha hai → Download karo
        const link = document.createElement('a');
        link.href = pdfPath;
        link.setAttribute('download', 'athenura.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Checkbox unchecked → "Download" text dikh raha tha → New tab mein open karo
        window.open(pdfPath, '_blank');
      }
    });
  }

})();