// ============================================================
// MOBILE NAVIGATION
// ============================================================
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isExpanded));
  navLinks.classList.toggle('is-open');
});

// Close nav when any link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (navLinks.classList.contains('is-open') && !e.target.closest('.site-nav')) {
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  }
});

// ============================================================
// WORK CARD DIALOGS
// ============================================================
const workCards = document.querySelectorAll('.work-card');

workCards.forEach(card => {
  card.addEventListener('click', () => {
    const dialogId = card.dataset.dialog;
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    // Remember the triggering element so we can return focus on close
    dialog._trigger = card;
    dialog.showModal();

    // Move focus to the close button for keyboard users
    const closeBtn = dialog.querySelector('.dialog-close');
    if (closeBtn) closeBtn.focus();
  });
});

// Close button handler
document.querySelectorAll('.dialog-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

// Close on backdrop click
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', e => {
    // The click target is the dialog element itself only when clicking the backdrop
    if (e.target === dialog) {
      dialog.close();
    }
  });

  // Return focus to the card that opened this dialog
  dialog.addEventListener('close', () => {
    if (dialog._trigger) {
      dialog._trigger.focus();
      dialog._trigger = null;
    }
  });
});

// ============================================================
// SMOOTH SCROLL FOR CHIP ↔ CRITERION CARD LINKS
// Highlight the target card briefly so the user can spot it
// ============================================================
function flashTarget(el) {
  if (!el) return;
  // The :target CSS pseudo-class handles the visual ring,
  // but we also scroll into view with block: 'center' for better UX
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.querySelectorAll('.chip, .see-block-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Update URL hash so :target CSS applies
    history.pushState(null, '', href);
    flashTarget(target);
  });
});
