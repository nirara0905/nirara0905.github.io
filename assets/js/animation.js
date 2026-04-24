'use strict';

/* ===== Section title letter-by-letter animation ===== */
const titleActions = document.querySelectorAll('.title_action');

titleActions.forEach(el => el.classList.add('not_first_insert'));

function animateTitles() {
  titleActions.forEach(el => {
    if (!el.classList.contains('not_first_insert')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top - window.innerHeight < 0) {
      el.classList.remove('not_first_insert');
      const letters = el.textContent.split('');
      el.textContent = '';
      letters.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        if (i === 0) span.classList.add('farstText');
        el.appendChild(span);
        setTimeout(() => span.classList.add('fadeIn'), 80 * i);
      });
    }
  });
}

/* ===== Scroll reveal for .reveal elements ===== */
const revealEls = document.querySelectorAll('.reveal');

function animateReveal() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top - window.innerHeight < -40) {
      el.classList.add('visible');
    }
  });
}

document.addEventListener('scroll', () => {
  if (titleActions.length > 0) animateTitles();
  if (revealEls.length > 0)    animateReveal();
}, { passive: true });

/* run once on load */
animateTitles();
animateReveal();
