const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const out = process.argv[3];
  const selector = process.argv[4];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  if (selector) {
    await page.locator(selector).screenshot({ path: out });
  } else {
    await page.screenshot({ path: out, fullPage: true });
  }
  await browser.close();
  console.log('saved', out);
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
})();
