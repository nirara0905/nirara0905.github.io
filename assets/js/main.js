'use strict';

/* ===== THEME ===== */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ===== HAMBURGER ===== */
const hamburger  = document.getElementById('hamburger');
const navDrawer  = document.getElementById('navDrawer');

if (hamburger && navDrawer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navDrawer.classList.toggle('active');
  });
  navDrawer.querySelectorAll('.drawer_link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navDrawer.classList.remove('active');
    });
  });
}

/* ===== HEADER SCROLL SHADOW ===== */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ===== TOP PAGE — load 6 latest works ===== */
const topWorksList = document.getElementById('top_works_list');
if (topWorksList) {
  (async () => {
    try {
      const res   = await fetch('assets/js/img_file_names.json');
      const works = await res.json();
      works.sort((a, b) => b.date - a.date);
      works.slice(0, 12).forEach(work => {
        const li = document.createElement('li');
        li.className = 'works_card';
        li.innerHTML = `
          <img src="assets/works/${work.fileName}" alt="${work.company}様" loading="lazy">
          <div class="works_card_overlay"></div>
          <p class="works_card_label">${work.company}様</p>
        `;
        topWorksList.appendChild(li);
      });
    } catch (e) {
      console.error('works fetch error:', e);
    }
  })();
}
