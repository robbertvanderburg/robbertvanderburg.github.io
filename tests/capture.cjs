// Capture full-page, CSS-pixel-sized WebP files from an already running local build.
const { copyFile, mkdir, mkdtemp, readFile, rm } = require('node:fs/promises');
const { resolve, join } = require('node:path');
const { execFileSync } = require('node:child_process');
const { tmpdir } = require('node:os');
const { chromium } = require('@playwright/test');
const { routes, viewports, settle } = require('./matrix.cjs');

async function capture() {
  const phase = process.argv[2];
  const verify = process.argv.includes('--verify');
  const differences = [];
  if (!['before', 'after'].includes(phase)) throw new Error('Supply the capture phase: before or after.');
  const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4000';
  const out = resolve('docs/ux-audit/screenshots', phase);
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.CHROMIUM_CHANNEL });
  const temp = await mkdtemp(join(tmpdir(), 'site-capture-'));
  const png = join(temp, 'page.png');
  try {
    const page = await browser.newPage({ baseURL, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    for (const viewport of viewports) {
      const { width, height } = viewport;
      await page.setViewportSize(viewport);
      for (const colorScheme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme });
        for (const [name, route] of Object.entries(routes)) {
          const response = await page.goto(route);
          if (!response.ok()) throw new Error(route + ' returned ' + response.status());
          await settle(page);
          // Playwright preserves layout and container-query widths during full-page capture.
          await page.screenshot({ path: png, fullPage: true, animations: 'disabled' });
          const nameWithSize = name + '-' + width + 'x' + height + '-' + colorScheme + '.webp';
          const reference = join(out, nameWithSize);
          const target = verify ? join(temp, 'actual.webp') : reference;
          execFileSync('cwebp', ['-quiet', '-q', '89', png, '-o', target]);
          if (verify && !(await readFile(reference)).equals(await readFile(target))) {
            const diffDir = resolve('test-results/visual-differences');
            await mkdir(diffDir, { recursive: true });
            await copyFile(target, join(diffDir, nameWithSize));
            differences.push(nameWithSize);
          }
        }
      }
      console.log(phase, width + 'x' + height);
    }
    if (differences.length) throw new Error('Visual differences: ' + differences.join(', '));
  } finally {
    await browser.close();
    await rm(temp, { recursive: true, force: true });
  }
}

capture().catch(error => { console.error(error); process.exitCode = 1; });
