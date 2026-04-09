const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateCompleteMockup() {
    console.log('🚀 Starting complete landing page mockup generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // Capture desktop screenshot
        const pageDesktop = await browser.newPage();
        await pageDesktop.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2
        });

        let loaded = false;
        try {
            console.log('📡 Capturing desktop view from http://localhost:3000...');
            await pageDesktop.goto('http://localhost:3000', {
                waitUntil: 'networkidle2',
                timeout: 5000
            });
            loaded = true;
            console.log('✅ Desktop view loaded');
        } catch (e) {
            console.log('⚠️  Localhost not available');
        }

        if (!loaded) {
            const htmlPath = path.resolve(__dirname, 'product-mockup.html');
            await pageDesktop.goto(`file://${htmlPath}`, {
                waitUntil: 'networkidle0'
            });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const desktopScreenshotPath = path.resolve(__dirname, 'desktop-screenshot.png');
        await pageDesktop.screenshot({
            path: desktopScreenshotPath,
            fullPage: true,
            type: 'png'
        });
        await pageDesktop.close();

        // Capture mobile screenshot
        const pageMobile = await browser.newPage();
        await pageMobile.setViewport({
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true
        });

        try {
            console.log('📡 Capturing mobile view from http://localhost:3000...');
            await pageMobile.goto('http://localhost:3000', {
                waitUntil: 'networkidle2',
                timeout: 5000
            });
        } catch (e) {
            const htmlPath = path.resolve(__dirname, 'product-mockup.html');
            await pageMobile.goto(`file://${htmlPath}`, {
                waitUntil: 'networkidle0'
            });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const mobileScreenshotPath = path.resolve(__dirname, 'mobile-screenshot.png');
        await pageMobile.screenshot({
            path: mobileScreenshotPath,
            fullPage: true,
            type: 'png'
        });
        await pageMobile.close();

        console.log('✅ Screenshots captured');

        // Create combined mockup HTML with both devices
        const mockupHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neighborly Complete Mockup</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 40px;
        }

        .mockup-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 80px;
            max-width: 1800px;
            width: 100%;
        }

        /* MacBook Pro Frame */
        .laptop-container {
            position: relative;
            width: 1200px;
        }

        .laptop {
            width: 100%;
            position: relative;
            transform: rotateX(2deg);
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

        .screen-reflection {
            position: absolute;
            top: 14px;
            left: 14px;
            right: 14px;
            height: 40%;
            background: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 100%
            );
            border-radius: 12px 12px 0 0;
            pointer-events: none;
            z-index: 5;
        }

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

        /* iPhone Frame */
        .iphone-container {
            position: relative;
            width: 340px;
            margin-left: -40px;
            z-index: 2;
        }

        .iphone {
            width: 100%;
            position: relative;
        }

        .iphone-screen {
            width: 100%;
            aspect-ratio: 9 / 19.5;
            background: #1d1d1f;
            border-radius: 50px;
            padding: 8px;
            box-shadow: 
                0 30px 80px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 0 40px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .iphone-content {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 42px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) inset;
        }

        .iphone-content img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .iphone-notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 30px;
            background: #1d1d1f;
            border-radius: 0 0 22px 22px;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .iphone-camera {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: #2d2d2f;
            border-radius: 50%;
            border: 1px solid #1d1d1f;
        }

        .iphone-shadow {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 70%;
            height: 30px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            filter: blur(25px);
            z-index: -1;
        }

        .iphone-reflection {
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            height: 35%;
            background: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 100%
            );
            border-radius: 42px 42px 0 0;
            pointer-events: none;
            z-index: 5;
        }

        @media print {
            body {
                background: white;
            }
        }
    </style>
</head>
<body>
    <div class="mockup-container">
        <!-- MacBook Pro -->
        <div class="laptop-container">
            <div class="laptop">
                <div class="laptop-screen">
                    <div class="notch">
                        <div class="camera"></div>
                    </div>
                    <div class="screen-content">
                        <img src="desktop-screenshot.png" alt="Neighborly Desktop Landing Page">
                        <div class="screen-reflection"></div>
                    </div>
                </div>
                <div class="keyboard-shadow"></div>
                <div class="laptop-base"></div>
                <div class="laptop-shadow"></div>
            </div>
        </div>

        <!-- iPhone -->
        <div class="iphone-container">
            <div class="iphone">
                <div class="iphone-screen">
                    <div class="iphone-notch">
                        <div class="iphone-camera"></div>
                    </div>
                    <div class="iphone-content">
                        <img src="mobile-screenshot.png" alt="Neighborly Mobile Landing Page">
                        <div class="iphone-reflection"></div>
                    </div>
                </div>
                <div class="iphone-shadow"></div>
            </div>
        </div>
    </div>
</body>
</html>`;

        const mockupHTMLPath = path.resolve(__dirname, 'complete-mockup.html');
        fs.writeFileSync(mockupHTMLPath, mockupHTML);

        console.log('✅ Complete mockup HTML created');

        // Generate final image
        const pageFinal = await browser.newPage();
        await pageFinal.setViewport({
            width: 2000,
            height: 1400,
            deviceScaleFactor: 2
        });

        await pageFinal.goto(`file://${mockupHTMLPath}`, {
            waitUntil: 'networkidle0'
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const finalPath = path.resolve(__dirname, 'neighborly-complete-mockup.png');
        await pageFinal.screenshot({
            path: finalPath,
            fullPage: false,
            type: 'png'
        });

        await browser.close();

        console.log('✅ Complete mockup image generated!');
        console.log(`📁 Saved to: ${finalPath}`);
        console.log('✨ Done! Your exact landing page is now displayed in both laptop and iPhone frames!');

    } catch (error) {
        console.error('❌ Error generating mockup:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    generateCompleteMockup()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to generate mockup:', error);
            process.exit(1);
        });
}

module.exports = { generateCompleteMockup };

