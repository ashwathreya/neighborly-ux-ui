# Product Mockup Image Generation Guide

I've created a product mockup HTML file that displays the Neighborly application on both a MacBook Pro and iPhone side by side. Here's how to generate a high-quality image from it:

## Option 1: Manual Screenshot (Quickest)

1. **Open the HTML file in your browser:**
   - Double-click `product-mockup.html` to open it in your default browser
   - Or right-click and select "Open with" → choose your browser

2. **Take a screenshot:**
   - **Windows:** Press `Win + Shift + S` for Snipping Tool, or `F12` → More tools → Capture screenshot
   - **Mac:** Press `Cmd + Shift + 4` to capture a selection
   - **Or use browser extensions:**
     - Chrome: "Full Page Screen Capture" extension
     - Firefox: Built-in screenshot tool (right-click → "Take Screenshot")

3. **Crop and save:**
   - Crop to just the devices (remove any extra browser chrome)
   - Save as PNG at highest quality

## Option 2: Automated Image Generation (Best Quality)

If you have Node.js installed:

1. **Install Puppeteer:**
   ```bash
   npm install puppeteer
   ```

2. **Run the generation script:**
   ```bash
   node generate-mockup-image.js
   ```

3. **Find your image:**
   - The image will be saved as `neighborly-product-mockup.png` in the project root
   - It will be high-resolution (Retina quality) and perfectly cropped

## Option 3: Using Online Tools

1. **Open the HTML file in your browser**

2. **Use online screenshot tools:**
   - [htmlcsstoimage.com](https://htmlcsstoimage.com/) - Upload HTML or URL
   - [screenshot.rocks](https://screenshot.rocks/) - Browser-based screenshot tool
   - [html2image.app](https://html2image.app/) - Another option

3. **Set dimensions:**
   - Recommended: 1920x1080 or higher
   - Export as PNG

## Option 4: Using Design Tools

If you use Figma, Adobe XD, or similar:

1. **Open the HTML in browser and take a screenshot**

2. **Import into your design tool:**
   - Create a new frame (1920x1080 or custom size)
   - Import the screenshot
   - Add any additional polish if needed

3. **Export:**
   - Export as PNG at 2x or 3x resolution
   - Save as `neighborly-product-mockup.png`

## Tips for Best Results

- **Resolution:** Aim for at least 1920px width (3840px for Retina)
- **Format:** Use PNG for best quality (no compression artifacts)
- **Background:** The mockup already has a clean background, so you can use it as-is
- **Crop:** Remove any browser chrome/address bar for a cleaner look
- **File size:** For web use, PNG is fine. For presentations, you might want to compress slightly if file size matters

## What's Included in the Mockup

✅ MacBook Pro frame with realistic notch and base  
✅ iPhone 14/15 style frame with notch  
✅ Desktop view showing:
   - Navigation with logo, "Explore", "Sign In", "Get Started"
   - Hero headline: "Find Trusted Help Across Rover, TaskRabbit & More"
   - Supporting subtext
   - Category pills (Pet Care, Home Services, Tutoring, etc.)
   - Search bar with fields
   - Filter chips below

✅ Mobile view showing:
   - Responsive navigation
   - Stacked layout
   - Horizontal scrolling categories
   - Mobile-optimized search form

✅ Clean, professional design matching your actual Neighborly UI

The mockup is ready to use for your case study hero slide! 🎉

