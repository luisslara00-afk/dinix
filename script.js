const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const menuBackdrop = document.querySelector('.menu-backdrop');
let menuScrollPosition = 0;

function isMenuOpen() {
  return menuButton?.getAttribute('aria-expanded') === 'true';
}

function openMenu() {
  if (!menuButton || !navigation || window.innerWidth >= 960) return;
  menuScrollPosition = window.scrollY;
  document.body.style.top = `-${menuScrollPosition}px`;
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Cerrar menú');
  navigation.classList.add('is-open');
  menuBackdrop?.classList.add('is-open');
  navigation.querySelector('a')?.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  const wasOpen = isMenuOpen();
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
  navigation?.classList.remove('is-open');
  menuBackdrop?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  document.body.style.top = '';
  if (wasOpen) window.scrollTo(0, menuScrollPosition);
  if (wasOpen && restoreFocus) requestAnimationFrame(() => menuButton.focus({ preventScroll: true }));
}

menuButton?.addEventListener('click', () => {
  if (isMenuOpen()) closeMenu({ restoreFocus: true });
  else openMenu();
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
menuBackdrop?.addEventListener('click', () => closeMenu({ restoreFocus: true }));
window.addEventListener('resize', () => { if (window.innerWidth >= 960 && isMenuOpen()) closeMenu(); });

document.addEventListener('keydown', (event) => {
  if (!isMenuOpen()) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu({ restoreFocus: true });
    return;
  }

  if (event.key !== 'Tab') return;
  const focusableItems = [menuButton, ...navigation.querySelectorAll('a[href]')];
  const currentIndex = focusableItems.indexOf(document.activeElement);

  if (event.shiftKey && currentIndex <= 0) {
    event.preventDefault();
    focusableItems[focusableItems.length - 1].focus();
  } else if (!event.shiftKey && currentIndex === focusableItems.length - 1) {
    event.preventDefault();
    focusableItems[0].focus();
  }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();
