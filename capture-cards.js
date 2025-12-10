const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:3000/search?serviceType=pet%20care&location=90210', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const card = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('[style*="cursor: pointer"]'));
    return cards.find(c => c.textContent && (c.textContent.includes('⭐') || c.textContent.includes('$')));
  });
  
  if (card && card.asElement()) {
    await card.asElement().screenshot({ path: 'screenshots/07_provider_card_default.jpg', type: 'jpeg', quality: 90 });
    await card.asElement().hover();
    await new Promise(r => setTimeout(r, 500));
    await card.asElement().screenshot({ path: 'screenshots/08_provider_card_hover.jpg', type: 'jpeg', quality: 90 });
    console.log('✅ Captured provider card screenshots!');
  }
  
  await browser.close();
})();




