// Theme toggle with system preference detection and persistence
(function() {
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');

  // Determine initial theme
  if (stored) {
    html.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  updateIcons();

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateIcons();
    }
  });

  function updateIcons() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.sun-icon').forEach(el => el.style.display = isDark ? 'none' : 'block');
    document.querySelectorAll('.moon-icon').forEach(el => el.style.display = isDark ? 'block' : 'none');
  }

  // Expose to global scope
  window.toggleTheme = function() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcons();
  };
})();
