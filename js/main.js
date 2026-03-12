/* ============================================================
   ATHENURA — main.js  (index.html / home page)
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
     4. MODAL
  ───────────────────────────────────────── */
  window.openModal = function (card) {
    var ic      = getComputedStyle(card).getPropertyValue('--ic').trim();
    var icbg    = getComputedStyle(card).getPropertyValue('--icbg').trim();
    var modules = (card.dataset.modules || '').split('|');
    var tags    = (card.dataset.tags    || '').split('|');

    var modulesHTML = modules.map(function (m) {
      return '<li><span class="m-arrow" style="color:' + ic + '">&#9658;</span><span>' + m + '</span></li>';
    }).join('');

    var tagsHTML = tags.map(function (t) {
      return '<span class="m-tag">' + t + '</span>';
    }).join('');

    var iconBox = card.querySelector('.card-icon-box');

    document.getElementById('modalInner').innerHTML =
      '<div class="m-header">' +
        '<div class="m-icon" style="background:' + icbg + ';border:1.5px solid ' + ic + '33;color:' + ic + '">' +
          (iconBox ? iconBox.innerHTML : '') +
        '</div>' +
        '<div>' +
          '<span class="m-cat ' + card.dataset.badgeClass + '">' + card.dataset.badge + '</span>' +
          '<h2 class="m-title">' + card.dataset.title + '</h2>' +
          '<p class="m-sub">&#9201; ' + card.dataset.durationLabel + ' &nbsp;&middot;&nbsp; ' + card.dataset.modeLabel + ' &nbsp;&middot;&nbsp; ' + card.dataset.diffLabel + '</p>' +
        '</div>' +
      '</div>' +
      '<p class="m-desc">' + card.dataset.desc + '</p>' +
      '<div class="m-modules">' +
        '<p class="m-section-label" style="color:' + ic + '">Learning Modules</p>' +
        '<ul class="m-module-list">' + modulesHTML + '</ul>' +
      '</div>' +
      '<div class="m-tags">' + tagsHTML + '</div>' +
      '<button class="m-apply" style="background:' + ic + '" onclick="window.location.href=\'apply-now.html\'">Apply Now &#8594;</button>';

    var backdrop = document.getElementById('modalBackdrop');
    var modal    = document.getElementById('modal');
    if (backdrop) backdrop.classList.add('active');
    if (modal)    modal.classList.add('active');
    document.body.classList.add('modal-open');
    document.querySelectorAll('.card').forEach(function (c) { c.classList.add('blurred'); });
  };

  window.closeModal = function () {
    var backdrop = document.getElementById('modalBackdrop');
    var modal    = document.getElementById('modal');
    if (backdrop) backdrop.classList.remove('active');
    if (modal)    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.card').forEach(function (c) { c.classList.remove('blurred'); });
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeModal();
  });

  /* ─────────────────────────────────────────
     5. CARDS — reveal on scroll
  ───────────────────────────────────────── */
  (function initCards() {
    var INITIAL = 6;
    document.querySelectorAll('.card').forEach(function (c, i) {
      if (i >= INITIAL) c.style.display = 'none';
    });
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      }, { threshold: 0.06 });
      document.querySelectorAll('.card').forEach(function (c) { obs.observe(c); });
    } else {
      document.querySelectorAll('.card').forEach(function (c) { c.classList.add('visible'); });
    }
  })();

  /* ─────────────────────────────────────────
     6. TESTIMONIALS SLIDER
  ───────────────────────────────────────── */
  (function initTestimonialsSlider() {
    var track  = document.getElementById('testimonialsTrack');
    var dotsEl = document.getElementById('testimonialsDots');
    if (!track) return;

    var cards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (!cards.length) return;

    var current   = 0;
    var autoTimer = null;
    var visibleCount;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 600)  return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      visibleCount = getVisibleCount();
      var count = Math.max(1, cards.length - visibleCount + 1);
      for (var i = 0; i < count; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 't-dot' + (idx === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Slide ' + (idx + 1));
          dot.addEventListener('click', function () { goTo(idx); });
          dotsEl.appendChild(dot);
        })(i);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      dotsEl.querySelectorAll('.t-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function getCardWidth() { return cards[0].getBoundingClientRect().width; }
    function getGap() {
      return parseFloat(window.getComputedStyle(track).gap || window.getComputedStyle(track).columnGap) || 24;
    }

    function goTo(index) {
      visibleCount = getVisibleCount();
      var max = Math.max(0, cards.length - visibleCount);
      current = Math.max(0, Math.min(index, max));
      track.style.transform = 'translateX(-' + (current * (getCardWidth() + getGap())) + 'px)';
      updateDots();
    }

    function next() {
      visibleCount = getVisibleCount();
      goTo(current < cards.length - visibleCount ? current + 1 : 0);
    }

    function startAuto() { stopAuto(); autoTimer = setInterval(next, 4000); }
    function stopAuto()  { clearInterval(autoTimer); }

    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : goTo(current - 1); stopAuto(); startAuto(); }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); goTo(0); stopAuto(); startAuto(); }, 200);
    });

    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    buildDots(); goTo(0); startAuto();
  })();

  /* ─────────────────────────────────────────
     7. SCROLL-TRIGGERED ANIMATIONS
  ───────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var animObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('visible'); }, delay);
          animObs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-anim]').forEach(function (el) { animObs.observe(el); });
  }

  /* ─────────────────────────────────────────
     8. MARQUEE — pause on hover
  ───────────────────────────────────────── */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function () { marqueeTrack.style.animationPlayState = 'paused'; });
    marqueeTrack.addEventListener('mouseleave', function () { marqueeTrack.style.animationPlayState = 'running'; });
  }

  /* ─────────────────────────────────────────
     9. INFINITE LOGO SCROLL — pause on hover
  ───────────────────────────────────────── */
  var logosTrack = document.getElementById('logosTrack');
  if (logosTrack) {
    logosTrack.addEventListener('mouseenter', function () { logosTrack.style.animationPlayState = 'paused'; });
    logosTrack.addEventListener('mouseleave', function () { logosTrack.style.animationPlayState = 'running'; });
  }

  /* ─────────────────────────────────────────
     10. TAB SWITCHING
  ───────────────────────────────────────── */
  document.querySelectorAll('.tab[data-tab]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab[data-tab]').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

})();