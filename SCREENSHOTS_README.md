# Screenshot Capture Guide

This guide explains how to capture all the important UI screenshots for your UX/UI Design case study presentation.

## Prerequisites

1. **Development server must be running**
   - Make sure both the web app (port 3000) and API (port 4000) are running
   - Run `npm run dev` in the project root if not already running

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install Puppeteer and other required dependencies.

## How to Capture Screenshots

1. **Start the development servers** (if not already running):
   ```bash
   npm run dev
   ```
   Wait for both servers to be ready (you should see "Ready" messages).

2. **Run the screenshot capture script**:
   ```bash
   npm run screenshots
   ```
   
   Or directly:
   ```bash
   node capture-screenshots.js
   ```

3. **Wait for completion**
   - The script will automatically navigate through your app
   - It will capture 24+ screenshots of all important UI elements
   - Screenshots will be saved in the `screenshots/` folder as JPG files

## Screenshots Captured

The script captures the following screenshots:

### Homepage Screenshots
1. `01_homepage_hero_logged_out.jpg` - Hero section (logged out state)
2. `02_homepage_service_categories.jpg` - Service categories grid
3. `03_homepage_how_it_works.jpg` - How it works section
4. `04_homepage_testimonials.jpg` - Testimonials section
5. `21_homepage_hero_logged_in.jpg` - Hero section (logged in state)
6. `22_top_services_section.jpg` - Top services near you
7. `23_top_rated_by_platform.jpg` - Top-rated by platform section
8. `24_trending_right_now.jpg` - Trending right now section

### Search Results Screenshots
5. `05_search_results_full_page.jpg` - Full search results page
6. `06_filter_sidebar_expanded.jpg` - Filter sidebar (expanded)
7. `07_provider_card_default.jpg` - Provider card (default state)
8. `08_provider_card_hover.jpg` - Provider card (hover state)
9. `09_platform_filter_tabs.jpg` - Platform filter tabs
19. `19_smart_keyword_search.jpg` - Smart keyword search in action
20. `20_price_range_slider.jpg` - Price range slider

### Provider Detail Modal Screenshots
10. `10_provider_modal_overview.jpg` - Modal Overview tab
11. `11_provider_modal_experience.jpg` - Modal Experience tab
12. `12_provider_modal_portfolio.jpg` - Modal Portfolio tab
13. `13_provider_modal_reviews.jpg` - Modal Reviews tab

### Authentication Screenshots
14. `14_login_modal.jpg` - Login modal

### Responsive Design Screenshots
15. `15_mobile_homepage.jpg` - Mobile view (homepage)
16. `16_mobile_search_results.jpg` - Mobile view (search results)
17. `17_tablet_search_results.jpg` - Tablet view (search results)

### Other States
18. `18_empty_state.jpg` - Empty state (no results)

## Troubleshooting

### Server Not Running
If you see connection errors:
- Make sure `npm run dev` is running
- Check that ports 3000 and 4000 are available
- Wait a few seconds after starting the server before running the screenshot script

### Screenshots Not Capturing
- Make sure the development server is fully loaded
- Check browser console for any JavaScript errors
- Try running the script again (sometimes timing issues occur)

### Missing Elements in Screenshots
- Some elements may need more time to load
- Increase wait times in the script if needed
- Make sure you have data in your database/API responses

## Customization

You can modify `capture-screenshots.js` to:
- Change screenshot quality (currently 90)
- Adjust viewport sizes
- Add more screenshots
- Change file names
- Modify wait times

## Notes

- Screenshots are saved as JPG format for smaller file sizes
- Quality is set to 90 for good balance between quality and file size
- The script uses headless browser mode for faster execution
- All screenshots are saved in the `screenshots/` directory

## Next Steps

After capturing screenshots:
1. Review all screenshots in the `screenshots/` folder
2. Select the best ones for your presentation
3. Organize them according to your case study flow
4. Use them in your portfolio presentation

Good luck with your UX/UI Design case study! 🎨




