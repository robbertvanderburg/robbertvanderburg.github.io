// Search and year filter for the publications list.
// The list itself is rendered at build time from _data/publications.yml;
// this script only shows/hides the existing items.
(function() {
  const container = document.getElementById('pub-container');
  const searchInput = document.getElementById('pub-search');
  const yearFilter = document.getElementById('pub-year-filter');
  const countDisplay = document.getElementById('pub-count');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.pub-item'));

  const emptyMsg = document.createElement('p');
  emptyMsg.className = 'pub-error';
  emptyMsg.textContent = 'No matching publications found.';
  emptyMsg.style.display = 'none';
  container.appendChild(emptyMsg);

  function filterPubs() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const y = yearFilter?.value || '';
    let shown = 0;

    items.forEach(item => {
      const d = item.dataset;
      const matchQ = !q ||
        (d.title || '').includes(q) ||
        (d.authors || '').includes(q) ||
        (d.venue || '').includes(q);
      const matchY = !y || d.year === y;
      const visible = matchQ && matchY;
      item.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });

    emptyMsg.style.display = shown === 0 ? '' : 'none';
    if (countDisplay) countDisplay.textContent = `${shown} paper${shown !== 1 ? 's' : ''}`;
  }

  if (searchInput) searchInput.addEventListener('input', filterPubs);
  if (yearFilter) yearFilter.addEventListener('change', filterPubs);
})();
