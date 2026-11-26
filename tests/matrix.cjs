const routes = { home: '/', publications: '/publications/', cv: '/cv/', news: '/news/' };

const viewports = [
  [320, 568], [375, 667], [390, 844], [430, 932], [844, 390],
  [768, 1024], [820, 1180], [1024, 1366], [1024, 768], [1180, 820],
  [1366, 1024], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440],
].map(([width, height]) => ({ width, height }));

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) {
      if (img.loading === 'lazy') img.scrollIntoView();
      if (!img.complete) {
        await new Promise((resolve, reject) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', () => reject(new Error('Image failed: ' + img.src)), { once: true });
        });
      }
      if (!img.naturalWidth) throw new Error('Image has no natural width: ' + img.currentSrc);
      await img.decode();
    }
    scrollTo(0, 0);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

module.exports = { routes, viewports, settle };
