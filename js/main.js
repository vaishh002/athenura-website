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