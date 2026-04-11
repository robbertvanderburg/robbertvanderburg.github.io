// Fetch publications from OpenAlex API
(function() {
  const container = document.getElementById('pub-container');
  const searchInput = document.getElementById('pub-search');
  const yearFilter = document.getElementById('pub-year-filter');
  const countDisplay = document.getElementById('pub-count');

  const AUTHOR_ID = container?.dataset.authorId;
  if (!AUTHOR_ID || !container) return;

  let allPubs = [];

  container.innerHTML = `
    <div class="pub-loading">
      <div class="spinner"></div>
      <p>Fetching publications from OpenAlex…</p>
    </div>`;

  const url = `https://api.openalex.org/works?filter=author.id:${AUTHOR_ID}&sort=publication_year:desc&per_page=100&mailto=r.vander.burg@vu.nl`;

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`OpenAlex API returned ${r.status}`);
      return r.json();
    })
    .then(data => {
      const results = data.results || [];

      allPubs = results.map(work => {
        const title = work.title || 'Untitled';
        const year = work.publication_year || null;

        const authors = (work.authorships || [])
          .map(a => a.author?.display_name)
          .filter(Boolean)
          .join(', ');

        const venue = work.primary_location?.source?.display_name || '';

        const doi = work.doi ? work.doi.replace('https://doi.org/', '') : '';
        const ids = work.ids || {};

        let arxiv = '';
        const locations = work.locations || [];
        for (const loc of locations) {
          const landing = loc.landing_page_url || '';
          const arxivMatch = landing.match(/arxiv\.org\/abs\/(.+)/);
          if (arxivMatch) {
            arxiv = arxivMatch[1];
            break;
          }
        }
        if (!arxiv && ids.arxiv) {
          arxiv = ids.arxiv.replace('https://arxiv.org/abs/', '');
        }

        let url = '';
        if (doi) url = `https://doi.org/${doi}`;
        else if (arxiv) url = `https://arxiv.org/abs/${arxiv}`;
        else if (work.primary_location?.landing_page_url) url = work.primary_location.landing_page_url;

        const oaPdf = work.open_access?.oa_url || '';

        return { title, year, authors, venue, doi, arxiv, url, oaPdf };
      });

      if (allPubs.length === 0) {
        container.innerHTML = `<p class="pub-error">No publications found. Check your OpenAlex author ID in _config.yml.</p>`;
        return;
      }

      populateYearFilter();
      renderPubs(allPubs);
    })
    .catch(err => {
      console.error('OpenAlex fetch error:', err);
      container.innerHTML = `
        <div class="pub-error">
          <p><strong>Could not load publications.</strong></p>
          <p>Make sure your OpenAlex author ID is set in <code>_config.yml</code>.</p>
          <p style="font-size:0.82rem; margin-top:0.5rem;">Error: ${err.message}</p>
        </div>`;
    });

  function populateYearFilter() {
    const years = [...new Set(allPubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
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
      let links = '';
      if (p.url) links += `<a href="${p.url}" class="pub-link" target="_blank">Paper</a>`;
      if (p.doi) links += `<a href="https://doi.org/${p.doi}" class="pub-link" target="_blank">DOI</a>`;
      if (p.arxiv) links += `<a href="https://arxiv.org/abs/${p.arxiv}" class="pub-link" target="_blank">arXiv</a>`;
      if (p.oaPdf) links += `<a href="${p.oaPdf}" class="pub-link" target="_blank">PDF</a>`;

      return `
        <li class="pub-item fade-in">
          <div class="pub-title">
            ${p.url ? `<a href="${p.url}" target="_blank">${esc(p.title)}</a>` : esc(p.title)}
            ${p.year ? `<span class="pub-year-badge">${p.year}</span>` : ''}
          </div>
          <div class="pub-authors">${esc(p.authors)}</div>
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
        (p.authors || '').toLowerCase().includes(q) ||
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