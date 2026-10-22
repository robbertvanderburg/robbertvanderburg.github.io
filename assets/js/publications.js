// Fetch publications from the Semantic Scholar API and render them with
// search and year filter. The author ID and excluded papers come from
// _config.yml via data attributes on #pub-container.
(function() {
  const container = document.getElementById('pub-container');
  const searchInput = document.getElementById('pub-search');
  const yearFilter = document.getElementById('pub-year-filter');
  const countDisplay = document.getElementById('pub-count');
  if (!container) return;

  const AUTHOR_ID = container.dataset.authorId;
  const EXCLUDE = new Set(JSON.parse(container.dataset.exclude || '[]'));
  const FIELDS = 'title,authors,year,venue,journal,externalIds,url,openAccessPdf,publicationDate';
  const API_URL = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?fields=${FIELDS}&limit=1000`;
  const CACHE_KEY = `s2-papers-${AUTHOR_ID}`;
  const CACHE_TTL = 24 * 60 * 60 * 1000; // one day
  const MAX_RETRIES = 4;

  let allPubs = [];

  if (!AUTHOR_ID) {
    showError('No Semantic Scholar author ID set in <code>_config.yml</code>.');
    return;
  }

  container.innerHTML = `
    <div class="pub-loading">
      <div class="spinner"></div>
      <p>Fetching publications from Semantic Scholar…</p>
    </div>`;

  const cached = readCache();
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    init(cached.papers);
  } else {
    fetchPapers()
      .then(papers => {
        writeCache(papers);
        init(papers);
      })
      .catch(err => {
        console.error('Semantic Scholar fetch error:', err);
        // Fall back to an outdated copy rather than showing nothing.
        if (cached) init(cached.papers);
        else showError('Could not load publications right now. Please try again later.');
      });
  }

  // The public API is rate limited across all anonymous users, so a 429 is
  // common; retry with exponential backoff before giving up.
  async function fetchPapers() {
    for (let attempt = 0; ; attempt++) {
      const r = await fetch(API_URL);
      if (r.ok) return (await r.json()).data || [];
      const retryable = r.status === 429 || r.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) throw new Error(`API returned ${r.status}`);
      await new Promise(res => setTimeout(res, 1000 * 2 ** attempt));
    }
  }

  function init(papers) {
    allPubs = papers
      .filter(p => !EXCLUDE.has(p.paperId))
      .map(normalize)
      .sort((a, b) =>
        (b.date || '').localeCompare(a.date || '') ||
        (b.year || 0) - (a.year || 0) ||
        a.title.localeCompare(b.title));

    if (allPubs.length === 0) {
      showError('No publications found.');
      return;
    }

    populateYearFilter();
    renderPubs(allPubs);
  }

  function normalize(p) {
    const ids = p.externalIds || {};
    const doi = ids.DOI || '';
    const arxiv = ids.ArXiv || '';
    const venue = p.venue || p.journal?.name || (arxiv ? 'arXiv preprint' : '');
    let url = p.url || '';
    if (doi) url = `https://doi.org/${doi}`;
    else if (arxiv) url = `https://arxiv.org/abs/${arxiv}`;

    return {
      title: p.title || 'Untitled',
      year: p.year,
      date: p.publicationDate || '',
      authors: (p.authors || []).map(a => a.name).join(', '),
      venue,
      doi,
      arxiv,
      url,
      pdf: p.openAccessPdf?.url || '',
    };
  }

  function populateYearFilter() {
    if (!yearFilter) return;
    const years = [...new Set(allPubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    });
  }

  function renderPubs(pubs) {
    if (countDisplay) countDisplay.textContent = `${pubs.length} paper${pubs.length !== 1 ? 's' : ''}`;

    if (pubs.length === 0) {
      container.innerHTML = '<p class="pub-error">No matching publications found.</p>';
      return;
    }

    container.innerHTML = '<ul class="pub-list">' + pubs.map(p => {
      let links = '';
      if (p.url) links += `<a href="${esc(p.url)}" class="pub-link" target="_blank">Paper</a>`;
      if (p.doi) links += `<a href="https://doi.org/${esc(p.doi)}" class="pub-link" target="_blank">DOI</a>`;
      if (p.arxiv) links += `<a href="https://arxiv.org/abs/${esc(p.arxiv)}" class="pub-link" target="_blank">arXiv</a>`;
      if (p.pdf) links += `<a href="${esc(p.pdf)}" class="pub-link" target="_blank">PDF</a>`;

      return `
        <li class="pub-item fade-in">
          <div class="pub-title">
            ${p.url ? `<a href="${esc(p.url)}" target="_blank">${esc(p.title)}</a>` : esc(p.title)}
            ${p.year ? `<span class="pub-year-badge">${p.year}</span>` : ''}
          </div>
          <div class="pub-authors">${esc(p.authors)}</div>
          ${p.venue ? `<div class="pub-venue">${esc(p.venue)}</div>` : ''}
          ${links ? `<div class="pub-links">${links}</div>` : ''}
        </li>`;
    }).join('') + '</ul>';
  }

  function filterPubs() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const y = yearFilter?.value || '';

    renderPubs(allPubs.filter(p => {
      const matchQ = !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q);
      const matchY = !y || String(p.year) === y;
      return matchQ && matchY;
    }));
  }

  function showError(msg) {
    if (countDisplay) countDisplay.textContent = '';
    container.innerHTML = `
      <p class="pub-error">
        ${msg} In the meantime, see the full list on
        <a href="https://www.semanticscholar.org/author/${esc(AUTHOR_ID)}" target="_blank">Semantic Scholar</a>.
      </p>`;
  }

  // localStorage can throw (private mode, blocked storage); caching is optional.
  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) { return null; }
  }

  function writeCache(papers) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), papers })); } catch (e) {}
  }

  if (searchInput) searchInput.addEventListener('input', filterPubs);
  if (yearFilter) yearFilter.addEventListener('change', filterPubs);

  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML.replace(/"/g, '&quot;');
  }
})();
