const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateLandingPageMockup() {
    console.log('🚀 Starting landing page mockup generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Set high resolution viewport for desktop
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2 // Retina quality
        });

        // Try to load from localhost first, fallback to the HTML file
        let loaded = false;
        
        // Try localhost:3000 (common Next.js port)
        try {
            console.log('📡 Attempting to load from http://localhost:3000...');
            await page.goto('http://localhost:3000', {
                waitUntil: 'networkidle2',
                timeout: 5000
            });
            loaded = true;
            console.log('✅ Loaded from localhost:3000');
        } catch (e) {
            console.log('⚠️  Localhost not available, using HTML mockup...');
        }

        // If localhost didn't work, use the HTML file
        if (!loaded) {
            const htmlPath = path.resolve(__dirname, 'product-mockup.html');
            await page.goto(`file://${htmlPath}`, {
                waitUntil: 'networkidle0'
            });
        }

        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Take screenshot of just the landing page content
        const screenshotPath = path.resolve(__dirname, 'landing-page-screenshot.png');
        await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: 'png'
        });

        console.log('✅ Landing page screenshot captured');
        console.log(`📁 Saved to: ${screenshotPath}`);

        // Now create the laptop mockup HTML with the screenshot embedded
        await browser.close();

        // Create enhanced mockup HTML with realistic laptop frame
        const mockupHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neighborly Landing Page Mockup</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 40px;
        }

        .laptop-container {
            position: relative;
            width: 1200px;
            perspective: 2000px;
        }

        /* Realistic MacBook Pro Frame */
        .laptop {
            width: 100%;
            position: relative;
            transform: rotateX(5deg);
            transform-style: preserve-3d;
        }

        .laptop-screen {
            width: 100%;
            aspect-ratio: 16 / 10;
            background: #1d1d1f;
            border-radius: 20px 20px 0 0;
            padding: 14px;
            box-shadow: 
                0 40px 100px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 0 60px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .screen-content {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) inset;
        }

        .screen-content img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        /* Notch */
        .notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 220px;
            height: 28px;
            background: #1d1d1f;
            border-radius: 0 0 18px 18px;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .camera {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: #2d2d2f;
            border-radius: 50%;
            border: 1px solid #1d1d1f;
        }

        /* Laptop Base */
        .laptop-base {
            width: 110%;
            height: 24px;
            background: linear-gradient(to bottom, #2d2d2f 0%, #1d1d1f 100%);
            margin: 0 auto;
            border-radius: 0 0 30px 30px;
            position: relative;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            transform: translateX(-5%);
        }

        .laptop-base::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 2px;
        }

        /* Keyboard area shadow */
        .keyboard-shadow {
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
            filter: blur(4px);
        }

        /* Screen reflection */
        .screen-reflection {
            position: absolute;
            top: 14px;
            left: 14px;
            right: 14px;
            height: 40%;
            background: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 100%
            );
            border-radius: 12px 12px 0 0;
            pointer-events: none;
            z-index: 5;
        }

        /* Ambient lighting effects */
        .laptop::before {
            content: '';
            position: absolute;
            top: -50px;
            left: -50px;
            right: -50px;
            bottom: -100px;
            background: radial-gradient(
                ellipse at center top,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 70%
            );
            pointer-events: none;
            z-index: -1;
        }

        /* Shadow under laptop */
        .laptop-shadow {
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 40px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            filter: blur(30px);
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="laptop-container">
        <div class="laptop">
            <div class="laptop-screen">
                <div class="notch">
                    <div class="camera"></div>
                </div>
                <div class="screen-content">
                    <img src="landing-page-screenshot.png" alt="Neighborly Landing Page">
                    <div class="screen-reflection"></div>
                </div>
            </div>
            <div class="keyboard-shadow"></div>
            <div class="laptop-base"></div>
            <div class="laptop-shadow"></div>
        </div>
    </div>
</body>
</html>`;

        const mockupHTMLPath = path.resolve(__dirname, 'landing-page-laptop-mockup.html');
        fs.writeFileSync(mockupHTMLPath, mockupHTML);

        console.log('✅ Laptop mockup HTML created');
        console.log(`📁 Saved to: ${mockupHTMLPath}`);

        // Now generate the final image with the laptop frame
        const browser2 = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page2 = await browser2.newPage();
        await page2.setViewport({
            width: 1600,
            height: 1200,
            deviceScaleFactor: 2
        });

        await page2.goto(`file://${mockupHTMLPath}`, {
            waitUntil: 'networkidle0'
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        const finalPath = path.resolve(__dirname, 'neighborly-laptop-mockup.png');
        await page2.screenshot({
            path: finalPath,
            fullPage: false,
            type: 'png'
        });

        await browser2.close();

        console.log('✅ Final laptop mockup image generated!');
        console.log(`📁 Saved to: ${finalPath}`);
        console.log('✨ Done! Your landing page is now displayed in a realistic laptop frame!');

    } catch (error) {
        console.error('❌ Error generating mockup:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run if executed directly
if (require.main === module) {
    generateLandingPageMockup()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to generate mockup:', error);
            process.exit(1);
        });
}

module.exports = { generateLandingPageMockup };

