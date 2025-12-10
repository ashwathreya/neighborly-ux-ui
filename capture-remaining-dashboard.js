const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const screenshotsDir = path.join(__dirname, 'screenshots');
const existing = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.jpg'));

async function captureRemaining() {
  console.log('🚀 Capturing remaining dashboard screenshots...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await wait(500);

    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ 
        name: 'John Doe', 
        email: 'john.doe@example.com', 
        role: 'user',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Los Angeles, CA 90210',
        bio: 'Experienced pet owner and service provider'
      }));
      localStorage.setItem('token', 'mock-auth-token-12345');
    });

    const screenshots = [
      { num: 27, url: '/dashboard/profile', name: 'dashboard_profile_form', scroll: 200 },
      { num: 28, url: '/dashboard/settings', name: 'dashboard_settings', fullPage: true },
      { num: 29, url: '/dashboard/settings', name: 'dashboard_settings_notifications', scroll: 0 },
      { num: 30, url: '/dashboard/settings', name: 'dashboard_settings_privacy', scroll: 400 },
      { num: 31, url: '/dashboard/bookings', name: 'dashboard_bookings', fullPage: true },
      { num: 32, url: '/dashboard/messages', name: 'dashboard_messages', fullPage: true },
      { num: 33, url: '/dashboard', name: 'dashboard_navigation', clip: { x: 0, y: 0, width: 1920, height: 150 } },
    ];

    for (const shot of screenshots) {
      if (existing.includes(`${shot.num}_${shot.name}.jpg`)) {
        console.log(`⏭️  Skipping ${shot.name} (already exists)`);
        continue;
      }
      
      console.log(`📸 Capturing ${shot.name}...`);
      await page.goto(`http://localhost:3000${shot.url}`, { waitUntil: 'networkidle2' });
      await wait(1500);
      
      if (shot.scroll !== undefined) {
        await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
        await wait(300);
      }
      
      const options = {
        path: path.join(screenshotsDir, `${shot.num}_${shot.name}.jpg`),
        type: 'jpeg',
        quality: 90
      };
      
      if (shot.fullPage) {
        options.fullPage = true;
      } else if (shot.clip) {
        options.clip = shot.clip;
      }
      
      await page.screenshot(options);
    }

    // Mobile views
    await page.setViewport({ width: 375, height: 667 });
    
    if (!existing.includes('34_dashboard_mobile.jpg')) {
      console.log('📸 Capturing dashboard mobile...');
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
      await wait(1500);
      await page.screenshot({
        path: path.join(screenshotsDir, '34_dashboard_mobile.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: true
      });
    }

    if (!existing.includes('35_dashboard_profile_mobile.jpg')) {
      console.log('📸 Capturing dashboard profile mobile...');
      await page.goto('http://localhost:3000/dashboard/profile', { waitUntil: 'networkidle2' });
      await wait(1500);
      await page.screenshot({
        path: path.join(screenshotsDir, '35_dashboard_profile_mobile.jpg'),
        type: 'jpeg',
        quality: 90,
        fullPage: true
      });
    }

    console.log('✅ Dashboard screenshots complete!');
    const count = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.jpg')).length;
    console.log(`📁 Total screenshots: ${count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureRemaining().catch(console.error);




