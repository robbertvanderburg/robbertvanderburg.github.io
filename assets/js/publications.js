// Fetch publications from Semantic Scholar API
(function() {
  const AUTHOR_ID = document.getElementById('pub-container')?.dataset.authorId;
  const container = document.getElementById('pub-container');
  const searchInput = document.getElementById('pub-search');
  const yearFilter = document.getElementById('pub-year-filter');
  const countDisplay = document.getElementById('pub-count');

  let allPubs = [];

  if (!AUTHOR_ID || !container) return;

  // Show loading
  container.innerHTML = `
    <div class="pub-loading">
      <div class="spinner"></div>
      <p>Fetching publications from Semantic Scholar…</p>
    </div>`;

  // Fetch from Semantic Scholar
  const fields = 'title,authors,year,venue,externalIds,url,publicationDate';
  fetch(`https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?fields=${fields}&limit=500`)
    .then(r => {
      if (!r.ok) throw new Error(`API returned ${r.status}`);
      return r.json();
    })
    .then(data => {
      allPubs = (data.data || [])
        .sort((a, b) => (b.year || 0) - (a.year || 0));

      if (allPubs.length === 0) {
        container.innerHTML = `<p class="pub-error">No publications found. Check your Semantic Scholar author ID in _config.yml.</p>`;
        return;
      }

      populateYearFilter();
      renderPubs(allPubs);
    })
    .catch(err => {
      console.error('Semantic Scholar fetch error:', err);
      container.innerHTML = `
        <div class="pub-error">
          <p><strong>Could not load publications.</strong></p>
          <p>Make sure your Semantic Scholar author ID is set in <code>_config.yml</code>.</p>
          <p style="font-size:0.82rem; margin-top:0.5rem;">Error: ${err.message}</p>
        </div>`;
    });

  function populateYearFilter() {
    const years = [...new Set(allPubs.map(p => p.year).filter(Boolean))].sort((a,b) => b-a);
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    });
  }

  function renderPubs(pubs) {
    if (pubs.length === 0) {
      container.innerHTML = '<p class="pub-error">No matching publications found.</p>';
      countDisplay.textContent = '0 papers';
      return;
    }

    countDisplay.textContent = `${pubs.length} paper${pubs.length !== 1 ? 's' : ''}`;

    container.innerHTML = '<ul class="pub-list">' + pubs.map(p => {
      const authors = (p.authors || []).map(a => a.name).join(', ');
      const doi = p.externalIds?.DOI;
      const arxiv = p.externalIds?.ArXiv;
      const url = p.url || (doi ? `https://doi.org/${doi}` : '');

      let links = '';
      if (url) links += `<a href="${url}" class="pub-link" target="_blank">Paper</a>`;
      if (doi) links += `<a href="https://doi.org/${doi}" class="pub-link" target="_blank">DOI</a>`;
      if (arxiv) links += `<a href="https://arxiv.org/abs/${arxiv}" class="pub-link" target="_blank">arXiv</a>`;

      return `
        <li class="pub-item fade-in">
          <div class="pub-title">
            ${url ? `<a href="${url}" target="_blank">${esc(p.title)}</a>` : esc(p.title)}
            ${p.year ? `<span class="pub-year-badge">${p.year}</span>` : ''}
          </div>
          <div class="pub-authors">${esc(authors)}</div>
          ${p.venue ? `<div class="pub-venue">${esc(p.venue)}</div>` : ''}
          ${links ? `<div class="pub-links">${links}</div>` : ''}
        </li>`;
    }).join('') + '</ul>';
  }

  function filterPubs() {
    const q = (searchInput?.value || '').toLowerCase();
    const y = yearFilter?.value || '';

    const filtered = allPubs.filter(p => {
      const matchQ = !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.authors || []).some(a => a.name.toLowerCase().includes(q)) ||
        (p.venue || '').toLowerCase().includes(q);
      const matchY = !y || String(p.year) === y;
      return matchQ && matchY;
    });

    renderPubs(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterPubs);
  if (yearFilter) yearFilter.addEventListener('change', filterPubs);

  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
