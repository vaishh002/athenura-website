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
      <button class="m-apply" style="background:${ic}">Apply Now &#8594;</button>
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

