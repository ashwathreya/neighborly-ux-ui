const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
	fs.mkdirSync(screenshotsDir, { recursive: true });
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureBeforeScreenshots() {
	console.log('🚀 Starting before state screenshot capture...\n');

	const browser = await puppeteer.launch({
		headless: false, // Set to true for headless mode
		defaultViewport: { width: 1920, height: 1080 }
	});

	try {
		const page = await browser.newPage();

		// Capture Initial Basic Version
		console.log('📸 Capturing initial basic version (before-state.html)...');
		const beforeStatePath = path.join(__dirname, 'before-state.html');
		await page.goto(`file://${beforeStatePath}`, { waitUntil: 'networkidle2' });
		await wait(2000);
		await page.screenshot({
			path: path.join(screenshotsDir, '00_before_initial_basic_version.jpg'),
			type: 'jpeg',
			quality: 90,
			fullPage: true
		});
		console.log('✅ Captured: 00_before_initial_basic_version.jpg\n');

		// Capture Fragmented Platforms Problem State
		console.log('📸 Capturing fragmented platforms problem state...');
		const fragmentedPath = path.join(__dirname, 'before-state-fragmented.html');
		await page.goto(`file://${fragmentedPath}`, { waitUntil: 'networkidle2' });
		await wait(2000);
		await page.screenshot({
			path: path.join(screenshotsDir, '00_before_fragmented_platforms.jpg'),
			type: 'jpeg',
			quality: 90,
			fullPage: true
		});
		console.log('✅ Captured: 00_before_fragmented_platforms.jpg\n');

		console.log('✨ All before state screenshots captured successfully!');
		console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

	} catch (error) {
		console.error('❌ Error capturing screenshots:', error);
	} finally {
		await browser.close();
	}
}

captureBeforeScreenshots().catch(console.error);




