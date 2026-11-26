// Apply the saved preference before paint. Storage is optional in private browsing.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('theme'); } catch {}
  function applyTheme() {
    const dark = preference === 'dark' || (preference !== 'light' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }
  }
  applyTheme();
  system.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.querySelector('[data-print]');
    if (printButton) {
      printButton.hidden = false;
      printButton.addEventListener('click', () => window.print());
    }

    const button = document.querySelector('.theme-toggle');
    button.hidden = false;
    applyTheme();
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', preference); } catch {}
      applyTheme();
    });

    const header = document.querySelector('.masthead');
    const menu = header.querySelector('.menu-toggle');
    const panel = document.getElementById('more-navigation');
    panel.classList.add('dismiss-immediately');
    header.classList.add('nav-ready');
    let compact = menu.offsetWidth > 0;

    function setMenu(open, animateClose = false) {
      panel.classList.toggle('dismiss-immediately', !open && !animateClose);
      panel.inert = compact && !open;
      menu.setAttribute('aria-expanded', String(open));
    }
    function closeMenu() {
      if (menu.getAttribute('aria-expanded') === 'true') setMenu(false);
    }
    setMenu(false);
    menu.addEventListener('click', () => {
      setMenu(menu.getAttribute('aria-expanded') !== 'true', true);
    });
    header.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        menu.focus();
        setMenu(false, true);
      }
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener('focusin', event => {
      if (!header.contains(event.target)) closeMenu();
    });
    header.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || menu.getAttribute('aria-expanded') !== 'true') return;
      closeMenu();
      if (link.hash && link.pathname === location.pathname) document.getElementById(link.hash.slice(1))?.focus();
    });
    function measureHeader() {
      const nextCompact = menu.offsetWidth > 0;
      if (compact !== nextCompact) {
        compact = nextCompact;
        if (compact && panel.contains(document.activeElement)) menu.focus();
        setMenu(false);
      }
      const height = header.offsetHeight;
      root.style.setProperty('--mast-height', height + 'px');
      root.classList.toggle('sticky-header', !compact && height <= window.innerHeight / 4);
    }
    measureHeader();
    window.addEventListener('resize', measureHeader);
    if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(measureHeader)).observe(header);

    function markLocation() {
      document.querySelectorAll('.masthead, .footer nav').forEach(group => {
        const links = Array.from(group.querySelectorAll('a')).filter(link => link.pathname === location.pathname);
        const section = links.find(link => link.hash && link.hash === location.hash);
        links.forEach(link => {
          if (link === section) link.setAttribute('aria-current', 'location');
          else if (!section && !link.hash) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      });
    }
    markLocation();
    window.addEventListener('hashchange', markLocation);
  });
})();
