const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Serve the page using local file URL
  await page.goto('http://localhost:8998/');
  
  const slides = ['uae', 'ksa', 'qatar', 'bahrain'];
  
  for (let i = 0; i < slides.length; i++) {
    // Click the dot to activate the slide
    const dots = await page.$$('.hero__dot');
    await dots[i].click();
    
    // Wait a bit for the transition
    await page.waitForTimeout(700);
    
    // Screenshot the hero section
    const hero = await page.$('.hero');
    await hero.screenshot({ path: `verify/hero-${slides[i]}.png` });
    console.log(`Saved verify/hero-${slides[i]}.png`);
  }
  
  await browser.close();
})();
