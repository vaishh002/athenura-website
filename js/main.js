const current = location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
  if (link.getAttribute("href") === current) {
    link.classList.add("active");
  }
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// card js

  const INITIAL = 6;
  let allExpanded = false;
  let currentCat = 'all';
  let activeFilters = { duration: 'all', mode: 'all', difficulty: 'all' };

  function init() {
    document.querySelectorAll('.card').forEach((c, i) => {
      if (i >= INITIAL) { c.style.display = 'none'; }
    });
    observeCards();
  }

  function observeCards() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.06 });
    document.querySelectorAll('.card').forEach(c => obs.observe(c));
  }

  function showMore() {
    allExpanded = true;
    let delay = 0;
    document.querySelectorAll('.card').forEach((card, i) => {
      if (i >= INITIAL && matchesFilters(card)) {
        card.style.display = '';
        card.style.setProperty('--delay', delay + 's');
        delay += 0.07;
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
    updateLoadBtns();
  }

  function showLess() {
    allExpanded = false;
    document.querySelectorAll('.card').forEach((card, i) => {
      if (i >= INITIAL) { card.style.display = 'none'; card.classList.remove('visible'); }
    });
    updateLoadBtns();
    window.scrollTo({ top: document.querySelector('.filter-section').offsetTop - 20, behavior: 'smooth' });
  }

  function updateLoadBtns() {
    const all = [...document.querySelectorAll('.card')].filter(matchesFilters);
    const shown = all.filter(c => c.style.display !== 'none').length;
    document.getElementById('exploreBtn').style.display = (shown < all.length) ? '' : 'none';
    document.getElementById('showLessBtn').style.display = (allExpanded && shown >= all.length && all.length > INITIAL) ? '' : 'none';
  }

  function matchesFilters(card) {
    const catOk = currentCat === 'all' || card.dataset.cat === currentCat;
    const durOk = activeFilters.duration === 'all' || card.dataset.dur === activeFilters.duration;
    const modeOk = activeFilters.mode === 'all' || card.dataset.mode === activeFilters.mode;
    const diffOk = activeFilters.difficulty === 'all' || card.dataset.diff === activeFilters.difficulty;
    return catOk && durOk && modeOk && diffOk;
  }

  function applyAllFilters() {
    allExpanded = false;
    closeModal();
    const cards = document.querySelectorAll('.card');
    let shown = 0;
    cards.forEach(card => {
      card.classList.remove('visible');
      if (matchesFilters(card) && shown < INITIAL) {
        card.style.display = '';
        shown++;
        const idx = shown;
        setTimeout(() => card.classList.add('visible'), idx * 70);
      } else {
        card.style.display = 'none';
      }
    });
    updateLoadBtns();
    renderChips();
  }

  function filterCards(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyAllFilters();
  }

  function toggleDrop(id) {
    document.querySelectorAll('.dropdown-wrap').forEach(w => { if (w.id !== id) w.classList.remove('open'); });
    document.getElementById(id).classList.toggle('open');
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-wrap')) {
      document.querySelectorAll('.dropdown-wrap').forEach(w => w.classList.remove('open'));
    }
  });

  function pickFilter(type, val, label, labelId, wrapId) {
    activeFilters[type] = val;
    document.getElementById(labelId).textContent = label;
    document.getElementById(wrapId).classList.remove('open');
    applyAllFilters();
  }

  function renderChips() {
    const row = document.getElementById('chipsRow');
    row.innerHTML = '';
    const map = {
      duration: { val: activeFilters.duration, label: 'Duration', labelId: 'durLabel' },
      mode:     { val: activeFilters.mode,     label: 'Mode',     labelId: 'modeLabel' },
      difficulty:{ val: activeFilters.difficulty, label: 'Difficulty', labelId: 'diffLabel' }
    };
    Object.entries(map).forEach(([key, cfg]) => {
      if (cfg.val !== 'all') {
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.innerHTML = `${cfg.label}: ${document.getElementById(cfg.labelId).textContent} <button onclick="clearChip('${key}','${cfg.label}','${cfg.labelId}')">&#10005;</button>`;
        row.appendChild(chip);
      }
    });
  }

  function clearChip(type, label, labelId) {
    activeFilters[type] = 'all';
    document.getElementById(labelId).textContent = label;
    applyAllFilters();
  }

  function openModal(card) {
    const ic = getComputedStyle(card).getPropertyValue('--ic').trim();
    const icbg = getComputedStyle(card).getPropertyValue('--icbg').trim();
    const modules = card.dataset.modules.split('|');
    const tags = card.dataset.tags.split('|');

    const modulesHTML = modules.map(m => `
      <li>
        <span class="m-arrow" style="color:${ic}">&#9658;</span>
        <span>${m}</span>
      </li>`).join('');

    const tagsHTML = tags.map(t => `<span class="m-tag">${t}</span>`).join('');

    document.getElementById('modalInner').innerHTML = `
      <div class="m-header">
        <div class="m-icon" style="background:${icbg};border:1.5px solid ${ic}33;color:${ic}">
          ${card.querySelector('.card-icon-box').innerHTML}
        </div>
        <div>
          <span class="m-cat ${card.dataset.badgeClass}">${card.dataset.badge}</span>
          <h2 class="m-title">${card.dataset.title}</h2>
          <p class="m-sub">&#9201; ${card.dataset.durationLabel} &nbsp;&middot;&nbsp; ${card.dataset.modeLabel} &nbsp;&middot;&nbsp; ${card.dataset.diffLabel}</p>
        </div>
      </div>
      <p class="m-desc">${card.dataset.desc}</p>
      <div class="m-modules">
        <p class="m-section-label" style="color:${ic}">Learning Modules</p>
        <ul class="m-module-list">${modulesHTML}</ul>
      </div>
      <div class="m-tags">${tagsHTML}</div>
      <button class="m-apply" style="background:${ic}" onclick="window.location.href='apply-now.html'">Apply Now &#8594;</button>
    `;

    document.getElementById('modalBackdrop').classList.add('active');
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.card').forEach(c => c.classList.add('blurred'));
  }

  function closeModal() {
    document.getElementById('modalBackdrop').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.card').forEach(c => c.classList.remove('blurred'));
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  init();


// intership policy js

const links = document.querySelectorAll(".nav-link");
links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('active');
}

// certificate js

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active');
}


// policy js 


// ============================================================
//  ATHENURA — MAIN JS
//  1. Hamburger menu toggle
//  2. Live search bar (searches all policy text content)
//  3. Download PDF
// ============================================================


/* ── 1. HAMBURGER MENU ── */
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}


/* ── 2. SEARCH BAR ── */
const searchInput = document.querySelector('.search');
const navRight = document.querySelector('.nav-right');

// Map section names to their actual IDs in your HTML
const searchTargets = [
  { label: 'Introduction',     id: 'introduction' },
  { label: 'Code of Conduct',  id: 'code of conduct' },
  { label: 'Attendance',       id: 'attendance' },
  { label: 'Confidentiality',  id: 'confidentiality' },
  { label: 'Evaluation',       id: 'evaluation' },
];

// Build dropdown suggestion box
const suggestionBox = document.createElement('div');
suggestionBox.id = 'search-suggestions';
Object.assign(suggestionBox.style, {
  position:     'absolute',
  top:          'calc(100% + 8px)',
  left:         '0',
  right:        '0',
  background:   '#fff',
  border:       '1px solid #d1d5db',
  borderRadius: '12px',
  boxShadow:    '0 8px 30px rgba(0,0,0,0.12)',
  zIndex:       '99999',
  overflow:     'hidden',
  display:      'none',
  minWidth:     '220px',
});

if (navRight) {
  navRight.style.position = 'relative';
  navRight.appendChild(suggestionBox);
}

// Remove all previous highlights
function clearHighlights() {
  document.querySelectorAll('mark.sh').forEach(m => {
    const parent = m.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    }
  });
}

// Highlight matching words inside a section
function highlightSection(sectionEl, query) {
  if (!query || !sectionEl) return;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const walker = document.createTreeWalker(sectionEl, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      const tag = n.parentNode.nodeName;
      return (tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'MARK')
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(textNode => {
    regex.lastIndex = 0;
    if (!regex.test(textNode.textContent)) return;
    regex.lastIndex = 0;
    const wrap = document.createElement('span');
    wrap.innerHTML = textNode.textContent.replace(
      regex,
      '<mark class="sh" style="background:#b2f5ea;color:#0f766e;border-radius:3px;padding:0 2px;font-weight:600;">$1</mark>'
    );
    textNode.replaceWith(wrap);
  });
}

// Get section element by ID — handles IDs with spaces
function getSectionById(id) {
  return document.getElementById(id);
}

// Render suggestion dropdown
function renderSuggestions(query) {
  suggestionBox.innerHTML = '';

  if (!query) {
    suggestionBox.style.display = 'none';
    clearHighlights();
    return;
  }

  const q = query.toLowerCase();

  const matches = searchTargets.filter(t => {
    if (t.label.toLowerCase().includes(q)) return true;
    const el = getSectionById(t.id);
    return el && el.textContent.toLowerCase().includes(q);
  });

  if (!matches.length) {
    const noResult = document.createElement('div');
    noResult.textContent = 'No results found';
    noResult.style.cssText = 'padding:14px 16px;font-size:14px;color:#9ca3af;text-align:center;';
    suggestionBox.appendChild(noResult);
    suggestionBox.style.display = 'block';
    clearHighlights();
    return;
  }

  // Header
  const header = document.createElement('div');
  header.textContent = `${matches.length} section${matches.length > 1 ? 's' : ''} found`;
  header.style.cssText = 'padding:10px 16px 6px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;border-bottom:1px solid #f3f4f6;';
  suggestionBox.appendChild(header);

  matches.forEach((match, i) => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px 16px;
      font-size: 14px;
      cursor: pointer;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: ${i < matches.length - 1 ? '1px solid #f9fafb' : 'none'};
      transition: background 0.15s;
    `;

    const dot = document.createElement('span');
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#2c8c8c;flex-shrink:0;display:inline-block;';
    item.appendChild(dot);

    const labelSpan = document.createElement('span');
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    labelSpan.innerHTML = match.label.replace(regex, '<strong style="color:#0f766e;">$1</strong>');
    item.appendChild(labelSpan);

    const arrow = document.createElement('span');
    arrow.textContent = '→';
    arrow.style.cssText = 'margin-left:auto;color:#9ca3af;font-size:16px;';
    item.appendChild(arrow);

    item.addEventListener('mouseenter', () => item.style.background = '#f0fdf9');
    item.addEventListener('mouseleave', () => item.style.background = '');

    item.addEventListener('click', () => {
      const target = getSectionById(match.id);
      if (target) {
        clearHighlights();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => highlightSection(target, query), 400);
      }
      suggestionBox.style.display = 'none';
      searchInput.value = match.label;
    });

    suggestionBox.appendChild(item);
  });

  suggestionBox.style.display = 'block';
}

if (searchInput) {
  searchInput.addEventListener('input', function () {
    renderSuggestions(this.value.trim());
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const q = this.value.trim().toLowerCase();
      const match = searchTargets.find(t => {
        if (t.label.toLowerCase().includes(q)) return true;
        const el = getSectionById(t.id);
        return el && el.textContent.toLowerCase().includes(q);
      });
      if (match) {
        const target = getSectionById(match.id);
        if (target) {
          clearHighlights();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => highlightSection(target, this.value.trim()), 400);
        }
        suggestionBox.style.display = 'none';
      }
    }
    if (e.key === 'Escape') {
      suggestionBox.style.display = 'none';
      clearHighlights();
      this.value = '';
    }
  });

  document.addEventListener('click', function (e) {
    if (navRight && !navRight.contains(e.target)) {
      suggestionBox.style.display = 'none';
    }
  });

  searchInput.addEventListener('focus', function () {
    if (this.value.trim()) renderSuggestions(this.value.trim());
  });
}


/* ── 3. DOWNLOAD PDF ── */
const downloadBtn = document.querySelector('.download');

if (downloadBtn) {
  downloadBtn.addEventListener('click', function () {
    const originalTitle = document.title;
    document.title = 'Athenura-Internship-Policy';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1500);
  });
}


/* ── PRINT STYLES — clean PDF layout ── */
const printStyle = document.createElement('style');
printStyle.innerHTML = `
  @media print {
    .navbar,
    .sidebar,
    #search-suggestions,
    .hamburger,
    .download {
      display: none !important;
    }
    .container {
      padding: 0 !important;
      gap: 0 !important;
      display: block !important;
    }
    .content {
      width: 100% !important;
      margin: 0 !important;
    }
    .policy-wrapper {
      padding: 10px 20px !important;
    }
    .policy-block,
    .policy-section,
    .big-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    body { background: white !important; }
    .hero img { max-height: 280px; object-fit: cover; }
    .athenura-footer { break-before: page; }
  }
`;
document.head.appendChild(printStyle);



/* ============================================================
   ATHENURA — main.js
   Handles: navbar active, hamburger, card modal, testimonial
   slider, infinite logo scroll (CSS handles that), filters.
   ============================================================ */

/* ── 1. NAV ACTIVE LINK ── */
(function () {
  const current = location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
})();

/* ── 2. HAMBURGER MENU ── */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const btn = document.getElementById("hamburger");
  if (!nav) return;
  nav.classList.toggle("open");
  if (btn) btn.classList.toggle("active");
}

/* ── 3. CARDS — reveal on scroll ── */
(function initCards() {
  const INITIAL = 6;
  let currentCat = "all";
  let activeFilters = { duration: "all", mode: "all", difficulty: "all" };

  function observeCards() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.06 });
    document.querySelectorAll(".card").forEach(c => obs.observe(c));
  }

  function matchesFilters(card) {
    const catOk  = currentCat === "all"                     || card.dataset.cat  === currentCat;
    const durOk  = activeFilters.duration   === "all"       || card.dataset.dur  === activeFilters.duration;
    const modeOk = activeFilters.mode       === "all"       || card.dataset.mode === activeFilters.mode;
    const diffOk = activeFilters.difficulty === "all"       || card.dataset.diff === activeFilters.difficulty;
    return catOk && durOk && modeOk && diffOk;
  }

  function applyAllFilters() {
    closeModal();
    const cards = document.querySelectorAll(".card");
    let shown = 0;
    cards.forEach(card => {
      card.classList.remove("visible");
      if (matchesFilters(card) && shown < INITIAL) {
        card.style.display = "";
        shown++;
        setTimeout(() => card.classList.add("visible"), shown * 70);
      } else {
        card.style.display = "none";
      }
    });
  }

  // expose for inline onclick
  window.filterCards = function (cat, btn) {
    currentCat = cat;
    document.querySelectorAll(".f-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    applyAllFilters();
  };

  // Initial setup
  document.querySelectorAll(".card").forEach((c, i) => {
    if (i >= INITIAL) c.style.display = "none";
  });
  observeCards();
})();

/* ── 4. MODAL ── */
function openModal(card) {
  const ic   = getComputedStyle(card).getPropertyValue("--ic").trim();
  const icbg = getComputedStyle(card).getPropertyValue("--icbg").trim();
  const modules  = (card.dataset.modules || "").split("|");
  const tags     = (card.dataset.tags    || "").split("|");

  const modulesHTML = modules.map(m => `
    <li>
      <span class="m-arrow" style="color:${ic}">&#9658;</span>
      <span>${m}</span>
    </li>`).join("");

  const tagsHTML = tags.map(t => `<span class="m-tag">${t}</span>`).join("");

  document.getElementById("modalInner").innerHTML = `
    <div class="m-header">
      <div class="m-icon" style="background:${icbg};border:1.5px solid ${ic}33;color:${ic}">
        ${card.querySelector(".card-icon-box").innerHTML}
      </div>
      <div>
        <span class="m-cat ${card.dataset.badgeClass}">${card.dataset.badge}</span>
        <h2 class="m-title">${card.dataset.title}</h2>
        <p class="m-sub">&#9201; ${card.dataset.durationLabel} &nbsp;&middot;&nbsp; ${card.dataset.modeLabel} &nbsp;&middot;&nbsp; ${card.dataset.diffLabel}</p>
      </div>
    </div>
    <p class="m-desc">${card.dataset.desc}</p>
    <div class="m-modules">
      <p class="m-section-label" style="color:${ic}">Learning Modules</p>
      <ul class="m-module-list">${modulesHTML}</ul>
    </div>
    <div class="m-tags">${tagsHTML}</div>
    <button class="m-apply" style="background:${ic}" onclick="window.location.href='apply-now.html'">Apply Now &#8594;</button>
  `;

  document.getElementById("modalBackdrop").classList.add("active");
  document.getElementById("modal").classList.add("active");
  document.body.classList.add("modal-open");
  document.querySelectorAll(".card").forEach(c => c.classList.add("blurred"));
}

function closeModal() {
  const backdrop = document.getElementById("modalBackdrop");
  const modal    = document.getElementById("modal");
  if (backdrop) backdrop.classList.remove("active");
  if (modal)    modal.classList.remove("active");
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".card").forEach(c => c.classList.remove("blurred"));
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

/* ── 5. TESTIMONIALS SLIDER ── */
(function initTestimonialsSlider() {
  const track  = document.getElementById("testimonialsTrack");
  const dotsEl = document.getElementById("testimonialsDots");
  const prevBtn = document.getElementById("tPrev");
  const nextBtn = document.getElementById("tNext");
  if (!track) return;

  const cards      = Array.from(track.querySelectorAll(".testimonial-card"));
  const totalCards = cards.length;
  let current      = 0;
  let autoTimer    = null;
  let visibleCount = getVisibleCount();

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 768)  return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  const totalSlides = Math.ceil(totalCards / visibleCount);

  /* Build dots */
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    const count = Math.max(1, totalCards - visibleCount + 1);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("button");
      dot.className = "t-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll(".t-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function getCardWidth() {
    if (cards.length === 0) return 0;
    // Read the actual rendered width of the first card
    return cards[0].getBoundingClientRect().width;
  }

  function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.gap || style.columnGap) || 20;
  }

  function goTo(index) {
    const maxIndex = Math.max(0, totalCards - visibleCount);
    current = Math.max(0, Math.min(index, maxIndex));
    const cardW = getCardWidth();
    const gap   = getGap();
    const offset = current * (cardW + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateBtns();
  }

  function updateBtns() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= totalCards - visibleCount;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const maxIndex = totalCards - visibleCount;
      goTo(current < maxIndex ? current + 1 : 0);
    }, 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); stopAuto(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); stopAuto(); startAuto(); });

  /* touch / swipe */
  let touchStartX = 0;
  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      stopAuto(); startAuto();
    }
  });

  /* resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visibleCount = getVisibleCount();
      buildDots();
      goTo(0);
      stopAuto(); startAuto();
    }, 200);
  });

  /* init */
  buildDots();
  goTo(0);
  startAuto();

  // pause on hover
  track.parentElement.addEventListener("mouseenter", stopAuto);
  track.parentElement.addEventListener("mouseleave", startAuto);
})();

/* ============================================================
   ATHENURA — CERTIFICATIONS PAGE JS
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. HAMBURGER / MOBILE NAV
  ───────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');
  const navbar      = document.getElementById('navbar');

  function openNav() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    navBackdrop.classList.add('visible');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    navBackdrop.classList.remove('visible');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    if (navLinks.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }

  // Close on backdrop click
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
  }

  // Close on nav link click (mobile)
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeNav();
      });
    });
  }

  // Close nav when resizing to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });


  /* ─────────────────────────────────────────
     2. NAVBAR SCROLL SHADOW
  ───────────────────────────────────────── */
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 12) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────
     3. TAB SWITCHING (hero tabs)
  ───────────────────────────────────────── */
  var tabs = document.querySelectorAll('.tab[data-tab]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      // Future: swap card content based on data-tab value
    });
  });


  /* ─────────────────────────────────────────
     4. SCROLL-TRIGGERED ANIMATIONS
  ───────────────────────────────────────── */
  var animEls = document.querySelectorAll('[data-anim]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el    = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    animEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just make everything visible
    animEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ─────────────────────────────────────────
     5. MARQUEE — pause on hover
  ───────────────────────────────────────── */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function () {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', function () {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  /* ─────────────────────────────────────────
     6. ANIMATED STAT COUNTERS
     (runs once when the stats row enters viewport)
  ───────────────────────────────────────── */
  var statsSection = document.querySelector('.hero-stats');

  function animateCounter(el, target, suffix, duration) {
    var start     = 0;
    var startTime = null;
    var isFloat   = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current  = isFloat
        ? (start + ease * (target - start)).toFixed(1)
        : Math.floor(start + ease * (target - start));
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statsSection && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        var nums = [
          { el: null, value: 10,  suffix: 'K+',  label: 'Professionals Certified' },
          { el: null, value: 500, suffix: '+',   label: 'Partner Companies' },
          { el: null, value: 98,  suffix: '%',   label: 'Placement Rate' },
          { el: null, value: 40,  suffix: '+',   label: 'Countries Reached' },
        ];
        var statNums = statsSection.querySelectorAll('.stat-num');
        statNums.forEach(function (el, i) {
          if (nums[i]) animateCounter(el, nums[i].value, nums[i].suffix, 1400);
        });
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

})();
