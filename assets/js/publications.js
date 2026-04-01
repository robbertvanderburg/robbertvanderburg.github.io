// Fetch publications from ORCID public API
(function() {
  const container = document.getElementById('pub-container');
  const searchInput = document.getElementById('pub-search');
  const yearFilter = document.getElementById('pub-year-filter');
  const countDisplay = document.getElementById('pub-count');

  const ORCID_ID = container?.dataset.orcidId;
  if (!ORCID_ID || !container) return;

  let allPubs = [];

  // Show loading
  container.innerHTML = `
    <div class="pub-loading">
      <div class="spinner"></div>
      <p>Fetching publications from ORCID…</p>
    </div>`;

  // Fetch works from ORCID public API (no token needed for public data)
  fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
    headers: { 'Accept': 'application/json' }
  })
    .then(r => {
      if (!r.ok) throw new Error(`ORCID API returned ${r.status}`);
      return r.json();
    })
    .then(data => {
      const groups = data.group || [];

      allPubs = groups.map(g => {
        // Each group can have multiple sources; take the first work-summary
        const summary = g['work-summary'] && g['work-summary'][0];
        if (!summary) return null;

        const title = summary.title?.title?.value || 'Untitled';
        const year = summary['publication-date']?.year?.value
                     ? parseInt(summary['publication-date'].year.value)
                     : null;
        const journal = summary['journal-title']?.value || '';
        const type = summary.type || '';

        // Extract external IDs (DOI, arXiv, etc.)
        const extIds = summary['external-ids']?.['external-id'] || [];
        const doi = extIds.find(e => e['external-id-type'] === 'doi');
        const arxiv = extIds.find(e => e['external-id-type'] === 'arxiv');

        const doiValue = doi?.['external-id-value'] || '';
        const arxivValue = arxiv?.['external-id-value'] || '';

        // Build a URL
        let url = '';
        if (doiValue) url = `https://doi.org/${doiValue}`;
        else if (arxivValue) url = `https://arxiv.org/abs/${arxivValue}`;
        else if (summary.url?.value) url = summary.url.value;

        // Contributors (may not always be present in summary)
        const putCode = summary['put-code'];

        return { title, year, journal, type, doiValue, arxivValue, url, putCode };
      })
      .filter(Boolean)
      .sort((a, b) => (b.year || 0) - (a.year || 0));

      if (allPubs.length === 0) {
        container.innerHTML = `<p class="pub-error">No publications found. Check your ORCID ID in _config.yml and make sure your works are set to public visibility.</p>`;
        return;
      }

      populateYearFilter();
      renderPubs(allPubs);

      // Optionally fetch full details for each work to get authors
      fetchAuthors();
    })
    .catch(err => {
      console.error('ORCID fetch error:', err);
      container.innerHTML = `
        <div class="pub-error">
          <p><strong>Could not load publications.</strong></p>
          <p>Make sure your ORCID ID is set in <code>_config.yml</code> and your works are publicly visible.</p>
          <p style="font-size:0.82rem; margin-top:0.5rem;">Error: ${err.message}</p>
        </div>`;
    });

  // Fetch individual work details to get author lists
  function fetchAuthors() {
    // Batch fetch: ORCID allows fetching individual works
    // We do this in the background and update the DOM when ready
    const fetches = allPubs.map((pub, idx) => {
      if (!pub.putCode) return Promise.resolve();
      return fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/work/${pub.putCode}`, {
        headers: { 'Accept': 'application/json' }
      })
      .then(r => r.ok ? r.json() : null)
      .then(work => {
        if (!work) return;
        const contributors = work.contributors?.contributor || [];
        const authors = contributors
          .map(c => c['credit-name']?.value)
          .filter(Boolean)
          .join(', ');
        if (authors) {
          allPubs[idx].authors = authors;
          // Update the DOM element if it exists
          const el = document.querySelector(`[data-pub-index="${idx}"] .pub-authors`);
          if (el) el.textContent = authors;
        }
      })
      .catch(() => {}); // Silently ignore individual failures
    });

    // Throttle: fetch 5 at a time to avoid rate limiting
    const batchSize = 5;
    let i = 0;
    function nextBatch() {
      const batch = fetches.slice(i, i + batchSize);
      if (batch.length === 0) return;
      Promise.all(batch).then(() => {
        i += batchSize;
        setTimeout(nextBatch, 200);
      });
    }
    nextBatch();
  }

  function populateYearFilter() {
    const years = [...new Set(allPubs.map(p => p.year).filter(Boolean))].sort((a,b) => b - a);
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

    container.innerHTML = '<ul class="pub-list">' + pubs.map((p, idx) => {
      let links = '';
      if (p.url) links += `<a href="${p.url}" class="pub-link" target="_blank">Paper</a>`;
      if (p.doiValue) links += `<a href="https://doi.org/${p.doiValue}" class="pub-link" target="_blank">DOI</a>`;
      if (p.arxivValue) links += `<a href="https://arxiv.org/abs/${p.arxivValue}" class="pub-link" target="_blank">arXiv</a>`;

      return `
        <li class="pub-item fade-in" data-pub-index="${idx}">
          <div class="pub-title">
            ${p.url ? `<a href="${p.url}" target="_blank">${esc(p.title)}</a>` : esc(p.title)}
            ${p.year ? `<span class="pub-year-badge">${p.year}</span>` : ''}
          </div>
          <div class="pub-authors">${esc(p.authors || 'Loading authors…')}</div>
          ${p.journal ? `<div class="pub-venue">${esc(p.journal)}</div>` : ''}
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
        (p.journal || '').toLowerCase().includes(q);
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
