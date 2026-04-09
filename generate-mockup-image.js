const puppeteer = require('puppeteer');
const path = require('path');

async function generateMockupImage() {
    console.log('🚀 Starting mockup image generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Set viewport to high resolution
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2 // Retina quality
        });

        // Load the HTML file
        const htmlPath = path.resolve(__dirname, 'product-mockup.html');
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'networkidle0'
        });

        // Wait a bit for any animations or rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Take screenshot
        const outputPath = path.resolve(__dirname, 'neighborly-product-mockup.png');
        await page.screenshot({
            path: outputPath,
            fullPage: true,
            type: 'png'
        });

        console.log(`✅ Mockup image generated successfully!`);
        console.log(`📁 Saved to: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error generating mockup:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run if executed directly
if (require.main === module) {
    generateMockupImage()
        .then(() => {
            console.log('✨ Done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to generate mockup:', error);
            process.exit(1);
        });
}

module.exports = { generateMockupImage };
