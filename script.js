// ============================================================
// TAB IDS — must match section#id values in index.html
// ============================================================
const TAB_IDS = ['hero', 'about', 'role', 'fit', 'days', 'work', 'contact'];

// ============================================================
// MOBILE NAVIGATION
// ============================================================
const toggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isExpanded));
  navLinksEl.classList.toggle('is-open');
});

function closeMobileNav() {
  toggle.setAttribute('aria-expanded', 'false');
  navLinksEl.classList.remove('is-open');
}

document.addEventListener('click', e => {
  if (navLinksEl.classList.contains('is-open') && !e.target.closest('.site-nav')) {
    closeMobileNav();
  }
});

// ============================================================
// TAB SWITCHING
// ============================================================
function showTab(id, pushState = true) {
  if (!TAB_IDS.includes(id)) id = 'hero';

  document.querySelectorAll('main > section').forEach(s => {
    s.classList.toggle('tab-active', s.id === id);
  });

  document.querySelectorAll('.nav-links a, a.monogram').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });

  window.scrollTo(0, 0);

  if (pushState) {
    const url = id === 'hero' ? location.pathname : '#' + id;
    history.pushState({ tab: id }, '', url);
  }
}

// Nav link clicks (including monogram)
document.querySelectorAll('.nav-links a, a.monogram').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    if (!TAB_IDS.includes(id)) return;
    e.preventDefault();
    showTab(id);
    closeMobileNav();
  });
});

// Any other in-page tab links (e.g. hero CTA "Get in touch →")
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.closest('.nav-links') || link.classList.contains('monogram')) return;
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!TAB_IDS.includes(id)) return;
    e.preventDefault();
    showTab(id);
  });
});

// Browser back / forward
window.addEventListener('popstate', e => {
  const id = (e.state && e.state.tab) || location.hash.slice(1) || 'hero';
  showTab(id, false);
});

// Init: restore tab from URL hash, default to hero
const initHash = location.hash.slice(1);
showTab(TAB_IDS.includes(initHash) ? initHash : 'hero', false);

// ============================================================
// WORK CARD DIALOGS
// ============================================================
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const dialog = document.getElementById(card.dataset.dialog);
    if (!dialog) return;
    dialog._trigger = card;
    dialog.showModal();
    const closeBtn = dialog.querySelector('.dialog-close');
    if (closeBtn) closeBtn.focus();
  });
});

document.querySelectorAll('.dialog-close').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('dialog').close());
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog._trigger) {
      dialog._trigger.focus();
      dialog._trigger = null;
    }
  });
});

// ============================================================
// CHIP / SEE-BLOCK SCROLL (within the #fit tab)
// ============================================================
document.querySelectorAll('.chip, .see-block-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    if (TAB_IDS.includes(id)) return; // handled by tab switcher above
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// ============================================================
// SCROLL FADE-IN (IntersectionObserver, respects reduced motion)
// ============================================================
if ('IntersectionObserver' in window &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {

  const fadeTargets = document.querySelectorAll(
    '.section-header, .story-block, .north-star, ' +
    '.serves-list, .barriers, .hypothesis-note, ' +
    '.bring-block, .part-label, .criteria-grid, ' +
    '.systems-strip, .days-phase, .work-card, ' +
    '.contact-list, .section-intro'
  );

  fadeTargets.forEach(el => el.classList.add('fi'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  fadeTargets.forEach(el => io.observe(el));
}
