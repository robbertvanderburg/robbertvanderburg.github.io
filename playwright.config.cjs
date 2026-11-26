const { defineConfig } = require('@playwright/test');

// With no external server, run a new local production build once per suite.
const baseURL = process.env.SITE_URL || 'http://127.0.0.1:4379';
module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  workers: 3,
  reporter: 'list',
  use: { baseURL, reducedMotion: 'reduce', colorScheme: 'light' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', channel: process.env.CHROMIUM_CHANNEL } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: process.env.SITE_URL ? undefined : {
    command: 'bundle exec jekyll serve --no-watch --host 127.0.0.1 --port 4379',
    url: baseURL,
    timeout: 90000,
    env: { JEKYLL_ENV: 'production' },
  },
});
