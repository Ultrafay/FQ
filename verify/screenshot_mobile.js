const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const out = process.argv[3];
  const width = parseInt(process.argv[4] || '375');
  const height = parseInt(process.argv[5] || '900');
  const fullPage = process.argv[6] !== 'false';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  await page.screenshot({ path: out, fullPage });
  await browser.close();
  console.log('saved', out, `(viewport ${width}px, content scrollWidth ${scrollWidth}px${scrollWidth > clientWidth ? ' <<< HORIZONTAL OVERFLOW' : ''})`);
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
})();
