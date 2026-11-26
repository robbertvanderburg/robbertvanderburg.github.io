// Run after a production Jekyll build. All browser requests read from that build.
const { chromium } = require('@playwright/test');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = path.resolve(process.env.SITE_DIR || path.join(root, '_site'));
const output = path.join(root, 'assets/downloads/robbert-van-der-burg-cv.pdf');
const receipt = path.join(__dirname, 'cv-export.json');
const digest = data => createHash('sha256').update(data).digest('hex');

async function run() {
  const html = await fs.readFile(path.join(site, 'cv/index.html'), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="(https:\/\/[^"]+)"/)?.[1];
  if (!canonical) throw new Error('Build with JEKYLL_ENV=production and bundle exec jekyll build first.');
  const url = new URL(canonical);
  const browser = await chromium.launch({ channel: process.env.CHROMIUM_CHANNEL });
  try {
    const page = await browser.newPage({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.emulateMedia({ media: 'print' });
    // Keep links in the PDF absolute and public while rendering local source and fonts.
    await page.route('**/*', async route => {
      const request = new URL(route.request().url());
      if (request.origin !== url.origin) return route.abort();
      if (request.pathname === url.pathname) {
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
      }
      const base = url.pathname.slice(0, -'/cv/'.length);
      const file = path.resolve(site, '.' + decodeURIComponent(request.pathname.slice(base.length)));
      if (!file.startsWith(site + path.sep)) return route.abort();
      await route.fulfill({ path: file });
    });
    await page.goto(canonical);
    await page.evaluate(() => document.fonts.ready);
    const source = await page.locator('main').evaluate(main => ({
      text: main.innerText.replace(/\s+/g, ' ').trim(),
      links: Array.from(main.querySelectorAll('a')).filter(a => a.getClientRects().length).map(a => a.href)
    }));
    const sourceSHA256 = digest(JSON.stringify(source));
    if (process.argv.includes('--check')) {
      const expected = JSON.parse(await fs.readFile(receipt, 'utf8'));
      if (sourceSHA256 !== expected.sourceSHA256 || digest(await fs.readFile(output)) !== expected.pdfSHA256) {
        throw new Error('The CV download is stale. Run npm run cv:pdf after rebuilding the site.');
      }
      console.log('The downloaded CV matches the current print text and links.');
      return;
    }
    const pdf = await page.pdf({ format: 'A4', tagged: true, outline: true, printBackground: true });
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, pdf);
    await fs.writeFile(receipt, JSON.stringify({ sourceSHA256, pdfSHA256: digest(pdf) }, null, 2) + '\n');
    console.log(path.relative(root, output));
  } finally {
    await browser.close();
  }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
