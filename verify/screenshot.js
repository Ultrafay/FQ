const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const file = process.argv[2];
  const out = process.argv[3];
  const selector = process.argv[4]; // optional CSS selector to screenshot just that element
  await page.goto('file://' + path.resolve(file));
  await page.waitForTimeout(300);
  if (selector) {
    await page.locator(selector).screenshot({ path: out });
  } else {
    await page.screenshot({ path: out, fullPage: true });
  }
  await browser.close();
  console.log('saved', out);
})();
