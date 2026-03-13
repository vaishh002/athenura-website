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

  var form = document.getElementById("partnershipForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll("input[required], input[type='text'], input[type='email']");
      const select = form.querySelector("select[required]");
      inputs.forEach(el => el.style.border = "1px solid #d1d5db");
      if (select) select.style.border = "1px solid #d1d5db";
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.border = "2px solid red";
          isValid = false;
        }
      });
      if (select && (!select.value || select.value === "")) {
        select.style.border = "2px solid red";
        isValid = false;
      }
      const emailInput = form.querySelector("input[type='email']");
      if (emailInput && emailInput.value.trim()) {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(email)) {
          emailInput.style.border = "2px solid red";
          alert("Please enter a valid email address");
          isValid = false;
        }
      }
      if (isValid) {
        alert("Partnership Request Submitted Successfully!");
        form.reset();
      }
    });
  }

})();

window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-up");
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("show");
    }, index * 120);
  });
});