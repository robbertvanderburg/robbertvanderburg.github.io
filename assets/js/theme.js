// Apply the saved preference before paint. Storage is optional in private browsing.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('theme'); } catch {}
  function applyTheme() {
    const dark = preference === 'dark' || (preference !== 'light' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('.theme-toggle')?.setAttribute('aria-pressed', String(dark));
  }
  applyTheme();
  system.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    button.hidden = false;
    applyTheme();
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', preference); } catch {}
      applyTheme();
    });

    const menu = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#primary-nav');
    const narrow = window.matchMedia('(max-width: 47rem)');
    function showMenu(open) {
      menu.setAttribute('aria-expanded', String(open));
      nav.hidden = narrow.matches && !open;
    }
    function resize() {
      menu.hidden = !narrow.matches;
      showMenu(false);
    }
    resize();
    narrow.addEventListener('change', resize);
    menu.addEventListener('click', () => showMenu(nav.hidden));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        showMenu(false);
        menu.focus();
      }
    });
    const header = document.querySelector('.masthead');
    // Zoom and text enlargement can wrap the navigation onto more than one line.
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        root.style.setProperty('--mast-height', header.offsetHeight + 'px');
      }).observe(header);
    }
    document.addEventListener('focusin', event => {
      if (!header.contains(event.target)) showMenu(false);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) showMenu(false);
    });
    nav.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && narrow.matches) {
        showMenu(false);
        if (link.hash && link.pathname === location.pathname) document.querySelector(link.hash)?.focus();
      }
    });
  });
})();
