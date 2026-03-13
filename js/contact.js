/* ─────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────── */
var fix = document.createElement('style');
fix.innerHTML =
  '.nav-backdrop { display: none; }' +
  '.nav-backdrop.visible { display: block; opacity: 1; }';
document.head.appendChild(fix);

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

if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

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
   NAVBAR SCROLL SHADOW
───────────────────────────────────────── */
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
}

/* ─────────────────────────────────────────
   NAV ACTIVE LINK
───────────────────────────────────────── */
var current = location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(function (link) {
  if (link.getAttribute('href') === current) {
    link.classList.add('active');
  }
});


(function () {
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => observer.observe(el));

    const sendBtn = document.getElementById('sendWA');
    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            const name = document.getElementById('name')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            let text = 'Hello Athenura, I would like to inquire about your services.%0A';
            if (name) text += `Name: ${name}%0A`;
            if (phone) text += `Phone: ${phone}%0A`;
            if (email) text += `Email: ${email}%0A`;
            if (message) text += `Message: ${message}%0A`;
            else text += 'I would like to discuss a project.';

            const whatsappURL = `https://wa.me/919835051934?text=${text}`;
            window.open(whatsappURL, '_blank');
        });
    }
})();