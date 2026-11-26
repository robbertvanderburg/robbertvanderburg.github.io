// Filtering progressively enhances the build-time bibliography.
(() => {
  const list = document.querySelector('#pub-container');
  if (!list) return;
  const search = document.querySelector('#pub-search');
  const year = document.querySelector('#pub-year-filter');
  const empty = document.querySelector('#pub-empty');
  const count = document.querySelector('#pub-count');
  const papers = Array.from(list.children);
  function filter() {
    const terms = search.value.toLowerCase().match(/\S+/g) || [];
    let matches = 0;
    papers.forEach(paper => {
      const data = paper.dataset;
      const textMatches = terms.every(term => data.search.includes(term));
      paper.hidden = !textMatches || (year.value !== '' && year.value !== data.year);
      if (!paper.hidden) matches++;
    });
    empty.hidden = matches > 0;
    count.textContent = matches + (matches === 1 ? ' paper' : ' papers');
  }
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  document.querySelector('#pub-reset').addEventListener('click', () => {
    search.value = '';
    year.value = '';
    filter();
    search.focus();
  });
  document.querySelector('.filters').hidden = false;
  filter();
})();
