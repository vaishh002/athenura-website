/* ============================================================
   ATHENURA — certificate.js  (certifications.html)
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     FIX: backdrop display
  ───────────────────────────────────────── */
  var fix = document.createElement('style');
  fix.innerHTML =
    '.nav-backdrop { display: none; }' +
    '.nav-backdrop.visible { display: block; opacity: 1; }';
  document.head.appendChild(fix);

  /* ─────────────────────────────────────────
     1. HAMBURGER
  ───────────────────────────────────────── */
  var hamburger   = document.getElementById('hamburger');
  var navLinks    = document.getElementById('navLinks');
  var navBackdrop = document.getElementById('navBackdrop');
  var navbar      = document.getElementById('navbar');

  function openNav() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('visible');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.classList.remove('visible');
    document.body.classList.remove('nav-open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* ─────────────────────────────────────────
     2. NAVBAR SCROLL SHADOW
  ───────────────────────────────────────── */
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     3. NAV ACTIVE LINK
  ───────────────────────────────────────── */
  var current = location.pathname.split('/').pop();
  document.querySelectorAll('nav a').forEach(function (link) {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });

  /* ─────────────────────────────────────────
     4. SCROLL-TRIGGERED ANIMATIONS  [data-anim]
  ───────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var animObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el    = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('visible'); }, delay);
          animObs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-anim]').forEach(function (el) { animObs.observe(el); });
  } else {
    document.querySelectorAll('[data-anim]').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─────────────────────────────────────────
     5. MARQUEE — pause on hover
  ───────────────────────────────────────── */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function () { marqueeTrack.style.animationPlayState = 'paused'; });
    marqueeTrack.addEventListener('mouseleave', function () { marqueeTrack.style.animationPlayState = 'running'; });
  }

  /* ─────────────────────────────────────────
     6. ANIMATED STAT COUNTERS (.hero-stats)
  ───────────────────────────────────────── */
  var statsSection = document.querySelector('.hero-stats');

  function animateCounter(el, target, suffix, duration) {
    var startTime = null;
    var isFloat   = target % 1 !== 0;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3);
      var value    = isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statsSection && 'IntersectionObserver' in window) {
    var statsData = [
      { value: 10,  suffix: 'K+' },
      { value: 500, suffix: '+'  },
      { value: 98,  suffix: '%'  },
      { value: 40,  suffix: '+'  }
    ];
    var statsObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        statsSection.querySelectorAll('.stat-num').forEach(function (el, i) {
          if (statsData[i]) animateCounter(el, statsData[i].value, statsData[i].suffix, 1400);
        });
        statsObs.unobserve(statsSection);
      }
    }, { threshold: 0.4 });
    statsObs.observe(statsSection);
  }

  /* ─────────────────────────────────────────
     7. TAB SWITCHING
  ───────────────────────────────────────── */
  document.querySelectorAll('.tab[data-tab]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab[data-tab]').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

})();