# Dashboard Screenshots Guide

## Overview

This guide helps you capture all dashboard and user profile settings screenshots for your UX/UI Design case study.

## Dashboard Pages to Capture

### Main Dashboard Pages
1. **Dashboard Main** (`/dashboard`) - Main dashboard overview
2. **Profile Page** (`/dashboard/profile`) - User profile settings and information
3. **Settings Page** (`/dashboard/settings`) - Account settings, notifications, privacy
4. **Bookings Page** (`/dashboard/bookings`) - User's booking history
5. **Messages Page** (`/dashboard/messages`) - Messaging interface

### Additional Screenshots Needed
- Profile form fields (close-up)
- Settings notifications section
- Settings privacy section
- Dashboard navigation menu
- Mobile views of dashboard pages

## How to Capture

### Option 1: Run the Complete Script
```bash
node capture-dashboard-screenshots.js
```

### Option 2: Run Individual Scripts
```bash
# Capture remaining dashboard screenshots
node capture-remaining-dashboard.js
```

### Option 3: Manual Capture
1. Make sure you're logged in (or set localStorage with user data)
2. Navigate to each dashboard page
3. Take screenshots manually using browser DevTools or screenshot tools

## Screenshot List

### Required Dashboard Screenshots:
- [ ] `25_dashboard_main.jpg` - Main dashboard page
- [ ] `26_dashboard_profile.jpg` - Profile page (full)
- [ ] `27_dashboard_profile_form.jpg` - Profile form fields
- [ ] `28_dashboard_settings.jpg` - Settings page (full)
- [ ] `29_dashboard_settings_notifications.jpg` - Notifications section
- [ ] `30_dashboard_settings_privacy.jpg` - Privacy section
- [ ] `31_dashboard_bookings.jpg` - Bookings page
- [ ] `32_dashboard_messages.jpg` - Messages page
- [ ] `33_dashboard_navigation.jpg` - Navigation menu
- [ ] `34_dashboard_mobile.jpg` - Mobile dashboard view
- [ ] `35_dashboard_profile_mobile.jpg` - Mobile profile view

## Notes

- All dashboard pages require authentication
- The script automatically sets up a mock user session
- Screenshots are saved as JPG format with 90% quality
- Mobile views are captured at 375x667 resolution

## Troubleshooting

If screenshots fail:
1. Make sure the dev server is running
2. Check that you can access `/dashboard` in your browser
3. Verify localStorage is being set correctly
4. Try running the script again

---

**All dashboard screenshots should be captured to complete your case study presentation!**




