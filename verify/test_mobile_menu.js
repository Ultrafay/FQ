const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 700 } });
  await page.goto('http://localhost:8843/index.html', { waitUntil: 'networkidle' });
  await page.click('.navbar__menu-toggle');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'verify/mobile-menu-open.png' });
  await browser.close();
  console.log('done');
})();
