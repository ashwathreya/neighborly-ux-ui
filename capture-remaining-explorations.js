const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
const explorationsDir = path.join(__dirname, 'explorations');

const remaining = [
	{
		file: 'modal-vs-fullpage-modal.html',
		name: '05_exploration_modal_view',
		description: 'Modal Detail View'
	},
	{
		file: 'modal-vs-fullpage-fullpage.html',
		name: '06_exploration_fullpage_view',
		description: 'Full Page Detail View'
	},
	{
		file: 'hierarchy-before.html',
		name: '07_exploration_hierarchy_before',
		description: 'Hierarchy Before'
	},
	{
		file: 'hierarchy-after.html',
		name: '08_exploration_hierarchy_after',
		description: 'Hierarchy After'
	},
	{
		file: 'mobile-before.html',
		name: '09_exploration_mobile_before',
		description: 'Mobile Before',
		viewport: { width: 375, height: 812 }
	},
	{
		file: 'mobile-after.html',
		name: '10_exploration_mobile_after',
		description: 'Mobile After',
		viewport: { width: 375, height: 812 }
	}
];

async function captureRemaining() {
	console.log('🚀 Capturing remaining exploration screenshots...\n');

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: { width: 1920, height: 1080 }
	});

	try {
		for (const exploration of remaining) {
			console.log(`📸 ${exploration.description}...`);
			const page = await browser.newPage();
			
			if (exploration.viewport) {
				await page.setViewport(exploration.viewport);
			}
			
			const filePath = path.join(explorationsDir, exploration.file);
			await page.goto(`file://${filePath}`, { waitUntil: 'load', timeout: 10000 });
			await new Promise(r => setTimeout(r, 1000));
			
			await page.screenshot({
				path: path.join(screenshotsDir, `${exploration.name}.jpg`),
				type: 'jpeg',
				quality: 90,
				fullPage: true
			});
			
			console.log(`✅ ${exploration.name}.jpg\n`);
			await page.close();
		}

		console.log('✨ All remaining screenshots captured!');
	} catch (error) {
		console.error('❌ Error:', error.message);
	} finally {
		await browser.close();
	}
}

captureRemaining().catch(console.error);




