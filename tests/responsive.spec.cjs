const { test, expect } = require('@playwright/test');
const { routes, viewports, settle } = require('./matrix.cjs');
const { layoutIssues } = require('./layout.cjs');

const axeSource = require.resolve('axe-core/axe.min.js');
async function accessibility(page) {
  await page.addScriptTag({ path: axeSource });
  const violations = await page.evaluate(async () => {
    const results = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return results.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(n => n.target) }));
  });
  expect(violations).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') failures.push(msg.text()); });
  page.on('response', r => { if (r.status() >= 400) failures.push(r.status() + ' ' + r.url()); });
  page.qaFailures = failures;
});

test.afterEach(async ({ page }) => expect(page.qaFailures).toEqual([]));

for (const [name, route] of Object.entries(routes)) {
  for (const theme of ['light', 'dark']) {
    test(name + ' at all 15 viewports in ' + theme, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      for (const viewport of viewports) {
        await test.step(viewport.width + ' × ' + viewport.height, async () => {
          await page.setViewportSize(viewport);
          const response = await page.goto(route);
          expect([200, 304]).toContain(response.status());
          await settle(page);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await expect(page.getByRole('main')).toHaveCount(1);
          await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
          expect(await page.evaluate(layoutIssues)).toEqual([]);
          if ([320, 820, 1440].includes(viewport.width)) await accessibility(page);
          if (name === 'home') {
            const portrait = page.locator('.profile-matte');
            await expect(portrait).toBeVisible();
            expect(await portrait.evaluate(n => getComputedStyle(n).maskImage)).not.toEqual('none');
          }
        });
      }
    });
  }
}

test('container-query transitions, split view and 200% default text', async ({ page }) => {
  for (const route of Object.values(routes)) {
    await page.goto(route);
    for (const width of [287, 289, 295, 297, 319, 321, 351, 353, 367, 369, 383, 385, 399, 401, 511, 513, 600, 625, 627, 671, 673, 735, 737, 767, 769, 831, 832, 833, 834, 835, 863, 865, 895, 897, 973, 975, 1023, 1025]) {
      await page.setViewportSize({ width, height: 800 });
      await settle(page);
      expect(await page.evaluate(layoutIssues), route + ' at ' + width).toEqual([]);
    }
    await page.addStyleTag({ content: 'html {font-size: 200% !important}' });
    for (const width of [320, 640]) {
      await page.setViewportSize({ width, height: 800 });
      await settle(page);
      expect(await page.evaluate(layoutIssues), route + ' with enlarged text at ' + width).toEqual([]);
    }
  }
});

test('menu keyboard, dismissal, rotation and stored theme', async ({ page, browserName }) => {
  // macOS Safari uses Option-Tab to include links with its default keyboard preference.
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.keyboard.press(tab);
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const menu = page.locator('.menu-toggle');
  const panel = page.locator('#more-navigation');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await page.keyboard.press(tab);
  expect(await panel.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await accessibility(page);
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(panel).toBeHidden();

  await menu.click();
  const panelBox = await panel.boundingBox();
  await page.mouse.click(4, panelBox.y + panelBox.height + 10);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await panel.getByRole('button', { name: /dark theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await menu.click();
  await panel.getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/#research$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.evaluate(() => scrollTo(0, 0));
  await menu.focus();
  await page.setViewportSize({ width: 1180, height: 820 });
  await expect(menu).toBeHidden();
  const research = panel.getByRole('link', { name: 'Research', exact: true });
  await expect(research).toBeFocused();
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(panel).toBeHidden();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.setViewportSize({ width: 430, height: 932 });
  await expect(panel).toBeHidden();
});

test('search, filtering, resetting and disclosure controls', async ({ page }) => {
  await page.goto('/publications/');
  const search = page.locator('#pub-search');
  const records = page.locator('#pub-container .pub-item');
  const total = await records.count();
  // An empty synchronized bibliography is a supported state.
  if (total) {
    await expect(search).toBeVisible();
    const years = await records.evaluateAll(items => [...new Set(items.map(item => item.dataset.year))]);
    const year = page.locator('#pub-year-filter');
    if (years.length > 1) {
      await year.selectOption(years[0]);
      await expect(page.locator('.pub-item:visible')).toHaveCount(await records.evaluateAll((items, y) => items.filter(item => item.dataset.year === y).length, years[0]));
      await year.selectOption('');
    }
    const query = (await records.first().locator('.paper-title').innerText()).split(/\s+/).slice(0, 3).join(' ');
    await search.fill(query);
    await expect(records.first()).toBeVisible();
    await search.fill('zz-no-such-academic-paper-zz');
    await expect(page.locator('#pub-empty')).toBeVisible();
    await expect(page.getByRole('status').first()).toContainText('0');
    await accessibility(page);
    await page.locator('#pub-reset').click();
    await expect(search).toBeFocused();
    await expect(page.locator('.pub-item:visible')).toHaveCount(total);
  }
  await page.goto('/');
  const abstract = page.locator('.preprint-preview');
  if (await abstract.count()) {
    const toggle = abstract.locator('summary');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(abstract).toHaveAttribute('open', '');
    await expect(abstract.locator('p')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(abstract.locator('p')).toBeHidden();
  }
});

test('CV index, anchored sections and printer view', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/cv/');
  const toc = page.locator('.contents');
  const disclosure = toc.locator('summary');
  if (await disclosure.isVisible()) await disclosure.click();
  await toc.getByRole('link', { name: 'Teaching' }).click();
  await expect(page).toHaveURL(/#teaching$/);
  await expect(page.getByRole('heading', { name: 'Teaching', exact: true })).toBeInViewport();
  await page.setViewportSize({ width: 1366, height: 1024 });
  await expect(toc.getByRole('link', { name: 'Education' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  for (const selector of ['.masthead', '.footer', '.contents', '[data-print]']) await expect(page.locator(selector)).toBeHidden();
  for (const heading of ['Education', 'Research', 'Teaching', 'Talks & presentations']) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
});

test('internal links, downloads and anchored destinations', async ({ page, request, baseURL }) => {
  const links = new Map();
  for (const route of Object.values(routes)) {
    await page.goto(route);
    const urls = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href));
    for (const href of urls) {
      const url = new URL(href);
      if (url.origin !== new URL(baseURL).origin) continue;
      const hashes = links.get(url.pathname) || new Set();
      if (url.hash) hashes.add(decodeURIComponent(url.hash.slice(1)));
      links.set(url.pathname, hashes);
    }
  }
  for (const [pathname, hashes] of links) {
    const response = await request.get(pathname);
    expect(response.ok(), pathname).toBe(true);
    if (pathname.endsWith('.pdf')) expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    if (hashes.size) {
      await page.goto(pathname);
      for (const id of hashes) expect(await page.evaluate(id => !!document.getElementById(id), id), pathname + '#' + id).toBe(true);
    }
  }
});

test('without JavaScript all pages, research and papers remain accessible', async ({ browser, baseURL }) => {
  const page = await browser.newPage({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 568 } });
  try {
    for (const route of Object.values(routes)) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('.masthead a[href="/news/"]')).toBeVisible();
      if (route === '/publications/') {
        await expect(page.locator('.filters')).toBeHidden();
        for (const record of await page.locator('.pub-item').all()) await expect(record).toBeVisible();
      }
    }
  } finally {
    await page.close();
  }
});

test('year and search combine on a multi-year fixture with an undated record', async ({ page }) => {
  // The live data can contain a single year. Extend only the isolated browser
  // document before the real filter script initializes, without changing site data.
  await page.route('**/assets/js/publications.js', async route => {
    const original = await route.fetch();
    const seed = () => {
      const list = document.querySelector('#pub-container');
      if (!list) return;
      const year = document.querySelector('#pub-year-filter');
      year.closest('label').hidden = false;
      const template = list.querySelector('.pub-item');
      for (const value of ['1987', 'undated']) {
        if (![...year.options].some(option => option.value === value)) year.add(new Option(value, value));
        const record = template.cloneNode(true);
        record.dataset.year = value;
        record.dataset.search = 'fixture ' + value;
        record.querySelector('.paper-title').textContent = 'Fixture ' + value;
        list.append(record);
      }
    };
    await route.fulfill({ response: original, body: '(' + seed + ')();\n' + await original.text() });
  });
  await page.goto('/publications/');
  const records = page.locator('#pub-container .pub-item');
  if (!await records.count()) return;
  const year = page.locator('#pub-year-filter');
  const search = page.locator('#pub-search');
  const visible = page.locator('#pub-container .pub-item:visible');
  for (const value of ['1987', 'undated']) {
    await year.selectOption(value);
    await search.fill('fixture');
    await expect(visible).toHaveCount(1);
    await expect(visible.first().locator('.paper-title')).toHaveText('Fixture ' + value);
    await expect(page.locator('#pub-count')).toHaveText('1 paper');
  }
  await page.locator('#pub-reset').click();
  await expect(visible).toHaveCount(await records.count());
});

test('citation disclosure, clipboard success and manual fallback', async ({ page }) => {
  // Simulate a granted and a denied clipboard, independent of OS permissions.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async text => {
        if (window.refuseCopy) throw new Error('Permission denied');
        window.copiedCitation = text;
      },
    } });
  });
  await page.goto('/publications/');
  const citation = page.locator('.citation').first();
  if (!await citation.count()) return;
  const summary = citation.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(citation).toHaveAttribute('open', '');
  const text = (await citation.locator('.citation-text').innerText()).trim();
  expect(text.length).toBeGreaterThan(0);
  await citation.getByRole('button', { name: 'Copy citation' }).click();
  await expect(citation.getByRole('status')).toHaveText('Citation copied.');
  expect(await page.evaluate(() => window.copiedCitation)).toBe(text);
  await page.evaluate(() => { window.refuseCopy = true; });
  await citation.getByRole('button', { name: 'Copy citation' }).click();
  await expect(citation.getByRole('status')).toContainText('manually');
  await expect(citation.locator('.citation-text')).toBeVisible();
  await accessibility(page);
});

test('primary publication and email links, portraits and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const actions = page.locator('.profile-spread');
  await expect(actions.getByRole('link', { name: 'Publications', exact: true })).toHaveAttribute('href', '/publications/');
  await expect(actions.locator('a[href^="mailto:"]')).toBeVisible();
  const portrait = page.locator('.profile-portrait img');
  expect(await portrait.evaluate(img => img.width > 0 && img.getAttribute('loading') !== 'lazy')).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  const network = page.locator('.network-route').first();
  await expect(network).toHaveCSS('animation-name', 'trace-network');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(network).toHaveCSS('animation-name', 'none');
  await page.locator('.menu-toggle').click();
  const panel = page.locator('#more-navigation');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('animation-name', 'none');
  await expect(panel).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('.menu-lines')).toHaveCSS('transition-duration', '0s');
});

test('phone and tablet touch input opens menus, toggles themes and expands abstracts', async ({ browser, baseURL }) => {
  const touchPage = await browser.newPage({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    await touchPage.goto('/');
    await touchPage.locator('.menu-toggle').tap();
    const toggle = touchPage.getByRole('button', { name: 'Dark theme' });
    const originalTheme = await toggle.getAttribute('aria-pressed');
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-pressed', originalTheme === 'true' ? 'false' : 'true');
    await touchPage.locator('.menu-toggle').tap();
    const abstract = touchPage.locator('.preprint-preview');
    if (await abstract.count()) {
      await abstract.locator('summary').tap();
      await expect(abstract.locator('p')).toBeVisible();
    }
    await touchPage.setViewportSize({ width: 1024, height: 768 });
    await touchPage.locator('.masthead .nav-direct[href="/cv/"]').tap();
    await expect(touchPage).toHaveURL(/\/cv\/$/);
  } finally {
    await touchPage.close();
  }
});
