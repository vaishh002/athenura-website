/* ============================================================
   ATHENURA — internship.js  (internship-policy.html)
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     FIX: backdrop display & fade animations
  ───────────────────────────────────────── */
  var fix = document.createElement('style');
  fix.innerHTML =
    '.nav-backdrop { display: none; opacity: 0; transition: opacity 0.4s ease; }' +
    '.nav-backdrop.visible { display: block; opacity: 1; }';
  document.head.appendChild(fix);

  /* ─────────────────────────────────────────
     1. HAMBURGER & NAVIGATION
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
    
    if (navBackdrop) {
      navBackdrop.style.display = 'block';
      setTimeout(function() {
        navBackdrop.classList.add('visible');
      }, 10);
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
      setTimeout(function() {
        if (!navBackdrop.classList.contains('visible')) {
          navBackdrop.style.display = 'none';
        }
      }, 400);
    }
    document.body.classList.remove('nav-open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
  }

  // CLOSE IF: User clicks the backdrop
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
  }

  // CLOSE IF: User clicks anywhere inside the navigation menu area
  if (navLinks) {
    navLinks.addEventListener('click', function() {
      if (navLinks.classList.contains('open')) {
        closeNav();
      }
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
     4. POLICY SIDEBAR NAV LINKS (Fixed Sticky & Center)
  ───────────────────────────────────────── */
  var navItems = document.querySelectorAll('.nav-list li');
  if (navItems.length) {
    /* Set first item active by default */
    navItems[0].classList.add('active');

    navItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        // 1. Manage active state
        navItems.forEach(function (el) { el.classList.remove('active'); });
        this.classList.add('active');

        // 2. Center the active pill in horizontal scroll on mobile
        if (window.innerWidth <= 768) {
          this.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
        }

        // 3. Smooth scroll to the target section with an offset for sticky headers
        var link = this.querySelector('a');
        if (link && link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          var targetId = link.getAttribute('href').substring(1);
          var targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            // Adjust offset for fixed Navbar (64px) + Sticky Sidebar (~60px)
            var offset = 130; 
            var elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /* ─────────────────────────────────────────
     5. DOWNLOAD PDF BUTTON
  ───────────────────────────────────────── */
  var downloadBtn = document.querySelector('.download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      var originalTitle = document.title;
      document.title = 'Athenura-Internship-Policy';
      window.print();
      setTimeout(function () { document.title = originalTitle; }, 1500);
    });
  }

  /* ─────────────────────────────────────────
     6. CTA ACKNOWLEDGE BUTTON
  ───────────────────────────────────────── */
  var ctaBtn = document.querySelector('.cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      ctaBtn.textContent = '✓ Acknowledged!';
      ctaBtn.style.background = '#16a34a';
      ctaBtn.disabled = true;
    });
  }

  /* ─────────────────────────────────────────
     7. PRINT STYLES
  ───────────────────────────────────────── */
  var printStyle = document.createElement('style');
  printStyle.innerHTML =
    '@media print {' +
      '.navbar, .sidebar, .hamburger, .download, .athenura-footer { display: none !important; }' +
      '.container { padding: 0 !important; display: block !important; }' +
      '.content { width: 100% !important; margin: 0 !important; }' +
      '.policy-wrapper { padding: 10px 20px !important; }' +
      '.policy-block, .policy-section, .big-card { break-inside: avoid; page-break-inside: avoid; }' +
      'body { background: white !important; }' +
      '.hero img { max-height: 280px; object-fit: cover; }' +
    '}';
  document.head.appendChild(printStyle);

})();