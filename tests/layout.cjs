// Deliberate overlaps (portrait mask, network drawing and sticky header) are
// excluded. Compare distinct content columns, actions and reading-order blocks.
function layoutIssues() {
  const issues = [];
  const viewport = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > viewport + 1) issues.push('document extends beyond viewport');
  const visible = node => node.getClientRects().length &&
    getComputedStyle(node).visibility !== 'hidden' && !node.closest('[hidden]');
  function check(peers, label) {
    function boxes(elements) {
      return [...elements].flatMap(node => getComputedStyle(node).display === 'contents' ? boxes(node.children) : [node]);
    }
    const nodes = boxes(peers).filter(visible);
    for (const [index, node] of nodes.entries()) {
      const a = node.getBoundingClientRect();
      if (a.left < -1 || a.right > viewport + 1) issues.push(label + ' extends beyond viewport');
      for (const next of nodes.slice(index + 1)) {
        const b = next.getBoundingClientRect();
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
          issues.push(label + ' overlaps: ' + node.tagName + ' / ' + next.tagName);
        }
      }
    }
  }
  for (const selector of [
    '.profile-spread', '.profile-actions', '.preprint-note', '.research-intro', '.directions',
    '.academic-timeline li', '.pub-item', '.paper-links', '.filters', '.cv-section article',
    '.archive-year', '.record-meta',
  ]) {
    for (const parent of document.querySelectorAll(selector)) check(parent.children, selector);
  }
  check(document.querySelectorAll('.masthead a, .masthead button'), 'header controls');
  return issues;
}
module.exports = { layoutIssues };
