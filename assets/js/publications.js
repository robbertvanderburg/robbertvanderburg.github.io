// Filtering progressively enhances the build-time bibliography.
(() => {
  const list = document.querySelector('#pub-container');
  if (!list) return;
  const search = document.querySelector('#pub-search');
  const year = document.querySelector('#pub-year-filter');
  const empty = document.querySelector('#pub-empty');
  const count = document.querySelector('#pub-count');
  const reset = document.querySelector('#pub-reset');
  const papers = Array.from(list.children);
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  let previousCount = papers.length;
  let countFeedback;
  motion.addEventListener('change', () => countFeedback?.cancel());

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
    reset.hidden = !search.value && !year.value;
    if (matches !== previousCount) {
      previousCount = matches;
      count.textContent = matches + (matches === 1 ? ' paper' : ' papers');
      countFeedback?.cancel();
      if (motion.matches && count.animate) {
        const style = getComputedStyle(count);
        countFeedback = count.animate(
          [{ color: style.getPropertyValue('--wine') }, { color: style.color }],
          { duration: 420, easing: 'ease-out' }
        );
      }
    }
  }
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  reset.addEventListener('click', () => {
    search.value = '';
    year.value = '';
    filter();
    search.focus();
  });
  document.querySelector('.filters').hidden = false;
  if (navigator.clipboard?.writeText) {
    list.querySelectorAll('[data-copy-citation]').forEach(button => {
      button.hidden = false;
      const citation = button.closest('.citation');
      const text = citation.querySelector('.citation-text');
      const status = citation.querySelector('[role="status"]');
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text.textContent.trim());
          status.textContent = 'Citation copied.';
        } catch {
          status.textContent = 'Select the citation above to copy it manually.';
        }
      });
      citation.addEventListener('toggle', () => { status.textContent = ''; });
    });
  }
  filter();
})();
