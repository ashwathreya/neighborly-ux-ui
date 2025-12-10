const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Check which screenshots already exist
const existingScreenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.jpg'));

async function captureRemainingScreenshots() {
  console.log('🚀 Starting remaining screenshot capture...');
  console.log(`📊 Already have ${existingScreenshots.length} screenshots`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const baseUrl = 'http://localhost:3000';
  
  try {
    // Wait for server
    console.log('⏳ Connecting to server...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await wait(1000);

    // 7. Provider Card - Default State
    if (!existingScreenshots.includes('07_provider_card_default.jpg')) {
      console.log('📸 Capturing provider card (default)...');
      await page.goto(`${baseUrl}/search?serviceType=pet%20care&location=90210`, { waitUntil: 'networkidle2' });
      await wait(2000);
      const providerCard = await page.evaluateHandle(() => {
        const cards = Array.from(document.querySelectorAll('[style*="cursor: pointer"]'));
        return cards.find(card => card.textContent && (card.textContent.includes('⭐') || card.textContent.includes('$')));
      });
      if (providerCard && providerCard.asElement()) {
        await providerCard.asElement().screenshot({
          path: path.join(screenshotsDir, '07_provider_card_default.jpg'),
          type: 'jpeg',
          quality: 90
        });
      }
    }

    // 8. Provider Card - Hover State
    if (!existingScreenshots.includes('08_provider_card_hover.jpg')) {
      console.log('📸 Capturing provider card (hover)...');
      await page.goto(`${baseUrl}/search?serviceType=pet%20care&location=90210`, { waitUntil: 'networkidle2' });
      await wait(2000);
      const firstCard = await page.evaluateHandle(() => {
        const cards = Array.from(document.querySelectorAll('[style*="cursor: pointer"]'));
        return cards.find(card => card.textContent && (card.textContent.includes('⭐') || card.textContent.includes('$')));
      });
      if (firstCard && firstCard.asElement()) {
        await firstCard.asElement().hover();
        await wait(500);
        await firstCard.asElement().screenshot({
          path: path.join(screenshotsDir, '08_provider_card_hover.jpg'),
          type: 'jpeg',
          quality: 90
        });
      }
    }

    // 18. Empty State
    if (!existingScreenshots.includes('18_empty_state.jpg')) {
      console.log('📸 Capturing empty state...');
      await page.goto(`${baseUrl}/search?serviceType=invalid&location=99999`, { waitUntil: 'networkidle2' });
      await wait(2000);
      await page.screenshot({
        path: path.join(screenshotsDir, '18_empty_state.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false
      });
    }

    // 19. Smart Keyword Search
    if (!existingScreenshots.includes('19_smart_keyword_search.jpg')) {
      console.log('📸 Capturing smart keyword search...');
      await page.goto(`${baseUrl}/search?serviceType=pet%20care&location=90210`, { waitUntil: 'networkidle2' });
      await wait(2000);
      const keywordInput = await page.$('input[placeholder*="Try:"]');
      if (keywordInput) {
        await keywordInput.type('math', { delay: 100 });
        await wait(1000);
        await page.screenshot({
          path: path.join(screenshotsDir, '19_smart_keyword_search.jpg'),
          type: 'jpeg',
          quality: 90,
          fullPage: false
        });
      }
    }

    // 20. Price Range Slider
    if (!existingScreenshots.includes('20_price_range_slider.jpg')) {
      console.log('📸 Capturing price range slider...');
      await page.goto(`${baseUrl}/search?serviceType=pet%20care&location=90210`, { waitUntil: 'networkidle2' });
      await wait(2000);
      const sliderSection = await page.evaluateHandle(() => {
        const labels = Array.from(document.querySelectorAll('label'));
        const payRateLabel = labels.find(l => l.textContent?.includes('Pay Rate'));
        return payRateLabel?.closest('div');
      });
      if (sliderSection && sliderSection.asElement()) {
        await sliderSection.asElement().screenshot({
          path: path.join(screenshotsDir, '20_price_range_slider.jpg'),
          type: 'jpeg',
          quality: 90
        });
      }
    }

    // 21. Homepage Hero (Logged In)
    if (!existingScreenshots.includes('21_homepage_hero_logged_in.jpg')) {
      console.log('📸 Capturing homepage hero (logged in)...');
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await wait(1000);
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' }));
        localStorage.setItem('token', 'mock-token');
      });
      await page.reload({ waitUntil: 'networkidle2' });
      await wait(2000);
      await page.screenshot({
        path: path.join(screenshotsDir, '21_homepage_hero_logged_in.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1920, height: 800 }
      });
    }

    // 22. Top Services Section
    if (!existingScreenshots.includes('22_top_services_section.jpg')) {
      console.log('📸 Capturing top services section...');
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await wait(1000);
      await page.evaluate(() => window.scrollTo(0, 900));
      await wait(1000);
      await page.screenshot({
        path: path.join(screenshotsDir, '22_top_services_section.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false
      });
    }

    // 23. Top-Rated by Platform
    if (!existingScreenshots.includes('23_top_rated_by_platform.jpg')) {
      console.log('📸 Capturing top-rated by platform section...');
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await wait(1000);
      await page.evaluate(() => window.scrollTo(0, 1500));
      await wait(1000);
      await page.screenshot({
        path: path.join(screenshotsDir, '23_top_rated_by_platform.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false
      });
    }

    // 24. Trending Right Now
    if (!existingScreenshots.includes('24_trending_right_now.jpg')) {
      console.log('📸 Capturing trending section...');
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      await wait(1000);
      await page.evaluate(() => window.scrollTo(0, 2100));
      await wait(1000);
      await page.screenshot({
        path: path.join(screenshotsDir, '24_trending_right_now.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: false
      });
    }

    console.log('✅ Remaining screenshots captured!');
    const finalCount = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.jpg')).length;
    console.log(`📁 Total screenshots: ${finalCount}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureRemainingScreenshots().catch(console.error);




