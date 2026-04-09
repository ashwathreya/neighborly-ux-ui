# Search Page Design Specifications for Figma

## Page Structure & Layout

### Overall Container
- **Max Width**: 1600px
- **Padding**: 32px (all sides)
- **Background**: Dynamic gradient overlay (see Background section)
- **Grid Layout**: 2 columns when filters shown, 1 column when hidden
  - **Filter Sidebar**: 320px width (when visible)
  - **Main Content**: 1fr (flexible)
  - **Gap**: 32px

---

## Top Navigation Bar

### Dimensions
- **Height**: 80px
- **Background**: Linear gradient: `#667eea` → `#764ba2` → `#6366f1` (135deg)
- **Padding**: 20px 32px
- **Box Shadow**: `0 4px 12px rgba(0,0,0,0.1)`

### Logo & Title
- **Text**: "Neighborly"
- **Font Size**: 24px
- **Font Weight**: 800 (Extra Bold)
- **Color**: White (#FFFFFF)
- **Letter Spacing**: -0.5px

### Navigation Links
- **Font Size**: 15px
- **Font Weight**: 500 (Medium)
- **Color**: White (#FFFFFF)
- **Opacity**: 0.9 (hover: 1.0)
- **Spacing**: 32px between links

---

## Filter Sidebar (320px width)

### Container
- **Background**: White (#FFFFFF)
- **Border Radius**: 20px
- **Padding**: 24px
- **Box Shadow**: `0 8px 24px rgba(0,0,0,0.08)`
- **Position**: Sticky (if needed in Figma)

### Section Headers
- **Font Size**: 20px
- **Font Weight**: 700 (Bold)
- **Color**: #111827
- **Margin Bottom**: 24px

### Filter Labels
- **Font Size**: 14px
- **Font Weight**: 600 (Semi-Bold)
- **Color**: #374151
- **Margin Bottom**: 8px

---

### 1. Smart Keywords Section
- **Input Field**:
  - Padding: 10px 14px
  - Border: 2px solid #e5e7eb
  - Border Radius: 10px
  - Font Size: 14px
  - Background: White (or #f3f4ff when active)
  - Focus Border: #6366f1

- **Badges**:
  - "AI Powered" - Font Size: 11px, Color: #6366f1
  - "New" - Font Size: 11px, Background: #10b981, Color: White, Padding: 2px 6px, Border Radius: 4px

---

### 2. Search by Name
- **Grid Layout**: 1fr 60px (First Name field | Last Initial field)
- **Gap**: 8px
- **Input Fields**:
  - Padding: 10px 14px
  - Border: 2px solid #e5e7eb
  - Border Radius: 10px
  - Font Size: 14px

---

### 3. Pay Rate Slider
- **Slider Track**:
  - Height: 6px
  - Background: #e5e7eb
  - Border Radius: 3px
  
- **Active Range**:
  - Background: Linear gradient `#6366f1` → `#8b5cf6`
  
- **Values Display**:
  - Font Size: 14px
  - Color: #6b7280
  - Range Text (bottom): Font Size: 12px

---

### 4. Can Help With (Specialties)
- **Button Style** (Unselected):
  - Padding: 8px 14px
  - Border: 2px solid #e5e7eb
  - Border Radius: 8px
  - Background: White
  - Color: #374151
  - Font Size: 13px
  - Font Weight: 500

- **Button Style** (Selected):
  - Border: 2px solid #6366f1
  - Background: #6366f110 (10% opacity)
  - Color: #6366f1
  - Same padding/size

- **Layout**: Flex wrap, Gap: 8px

---

### 5. Rating Filter
- **Buttons**: 3 options (⭐ 4.0, ⭐ 4.5, ⭐ 5.0)
- **Padding**: 8px 12px
- **Border**: 2px solid #e5e7eb (or #6366f1 when selected)
- **Border Radius**: 8px
- **Gap**: 12px between buttons
- **Star Icon**: Font Size: 16px
- **Rating Text**: Font Size: 14px, Font Weight: 600

---

### 6. Background Checked Only
- **Checkbox**: 20px × 20px
- **Accent Color**: #6366f1
- **Label**: Font Size: 14px, Font Weight: 500, Color: #374151
- **Gap**: 12px

---

## Main Content Area

### Search Results Header
- **Container**:
  - Background: White (#FFFFFF)
  - Border Radius: 20px
  - Padding: 24px
  - Box Shadow: `0 8px 24px rgba(0,0,0,0.08)`
  - Margin Bottom: 24px

- **Title**:
  - Text: "Search Results"
  - Font Size: 24px-32px (clamp)
  - Font Weight: 800
  - Color: #111827
  - Margin Bottom: 8px

- **Subtitle**:
  - Font Size: 16px
  - Color: #6b7280

- **Show/Hide Filters Button**:
  - Padding: 10px 20px
  - Border Radius: 12px
  - Font Size: 14px
  - Font Weight: 600
  - **Active State**: Background: #6366f1, Color: White
  - **Inactive State**: Background: #f3f4f6, Color: #374151

---

### Sort & Platform Filters Section
- **Sort Dropdown**:
  - Padding: 10px 16px
  - Border: 2px solid #e5e7eb
  - Border Radius: 12px
  - Font Size: 14px
  - Font Weight: 500
  - Focus Border: #6366f1

- **Platform Filter Buttons**:
  - Padding: 8px 16px
  - Border Radius: 10px
  - Font Size: 13px
  - Font Weight: 600
  - **Unselected**: Background: `${platform.color}15`, Border: 2px solid `${platform.color}30`, Color: #111827
  - **Selected**: Background: `${platform.color}`, Border: 2px solid `${platform.color}`, Color: White
  - **Count Badge**: Padding: 2px 8px, Border Radius: 6px, Font Size: 11px, Font Weight: 700

---

## Interactive Map Section

### Container
- **Background**: White (#FFFFFF)
- **Border Radius**: 20px
- **Padding**: 24px
- **Box Shadow**: `0 8px 24px rgba(0,0,0,0.08)`
- **Margin Bottom**: 24px

### Header
- **Title**: Font Size: 20px, Font Weight: 700, Color: #111827
- **Zoom Controls** (3 buttons in row):
  - Minus Button: Padding: 8px 12px, Background: #f3f4f6, Border: 1px solid #e5e7eb, Border Radius: 8px, Font Size: 18px
  - Zoom Percentage: Font Size: 14px, Font Weight: 600, Color: #6b7280, Min Width: 60px
  - Plus Button: Same as minus
  - Auto Button (when visible): Padding: 6px 12px, Background: #6366f1, Color: White, Border Radius: 6px, Font Size: 12px

### Radius Slider Section
- **Container**:
  - Background: #f9fafb
  - Border Radius: 12px
  - Padding: 16px
  - Margin Bottom: 16px

- **Label Row**:
  - Font Size: 14px, Font Weight: 600, Color: #374151
  - Number Input: Padding: 4px 8px, Border: 1px solid #d1d5db, Border Radius: 6px, Width: 70px, Font Size: 14px

- **Slider Track**:
  - Height: 8px
  - Border Radius: 4px
  - Background: Gradient from #6366f1 to #e5e7eb (dynamic based on value)

- **Slider Labels**: Font Size: 11px, Color: #9ca3af

### Map Area
- **Dimensions**: 500px height
- **Background**: Linear gradient `#e0e7ff` → `#ddd6fe` → `#fce7f3` (135deg)
- **Border**: 2px solid #e5e7eb
- **Border Radius**: 12px
- **Position**: Relative (for overlays)

### Map Elements
- **Grid Pattern**: 40px × 40px pattern, Stroke: #cbd5e1, Opacity: 0.3
- **Radius Circle** (when < 100mi):
  - Fill: rgba(99, 102, 241, 0.05)
  - Stroke: #6366f1, 2px, Dash: 5,5, Opacity: 0.6
  - Label: Font Size: 14px, Font Weight: 700, Color: #6366f1

- **User Location Marker** (Center):
  - Circle: 10px radius, Fill: #ef4444, Stroke: White, 3px
  - Pulse Ring: 10px radius, Stroke: #ef4444, 2px, Opacity: 0.5
  - Label: Font Size: 14px, Font Weight: 700, Color: #ef4444

- **Provider Markers**:
  - Circle: 6px radius, Fill: `${platform.color}`, Stroke: White, 2px
  - Distance Label: Font Size: 12px, Font Weight: 600, Color: `${platform.color}`
  - Connection Line: Stroke: `${platform.color}`, 2px, Opacity: 0.2, Dash: 4,4

### Map Overlays

#### Legend (Bottom Left)
- **Position**: Absolute, Bottom: 16px, Left: 16px
- **Background**: rgba(255, 255, 255, 0.95)
- **Backdrop Filter**: Blur(10px)
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Box Shadow**: `0 4px 12px rgba(0,0,0,0.1)`
- **Font Size**: 12px
- **Title**: Font Weight: 700, Color: #111827

#### Stats Overlay (Top Right)
- **Position**: Absolute, Top: 16px, Right: 16px
- **Background**: rgba(255, 255, 255, 0.95)
- **Backdrop Filter**: Blur(10px)
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Min Width**: 180px
- **Title**: Font Weight: 700, Color: #111827, Font Size: 13px
- **Radius Value**: Font Size: 18px, Font Weight: 800, Color: #6366f1
- **Stats Text**: Font Size: 11px, Color: #6b7280

### Tooltip (on hover)
- **Position**: Absolute, above marker
- **Background**: White (#FFFFFF)
- **Border**: 2px solid `${platform.color}`
- **Border Radius**: 12px
- **Padding**: 12px
- **Min Width**: 220px
- **Max Width**: 280px
- **Box Shadow**: `0 8px 24px rgba(0,0,0,0.15)`

**Tooltip Content**:
- **Avatar**: 40px × 40px circle, Gradient background, Border: 2px
- **Name**: Font Size: 15px, Font Weight: 700, Color: #111827
- **Platform**: Font Size: 12px, Color: #6b7280
- **Rating/Price Row**: Border Bottom: 1px solid #e5e7eb, Padding Bottom: 8px
- **Specialties**: Chips with padding: 2px 8px, Border Radius: 6px, Font Size: 11px
- **More Info Button**: 
  - Width: 100%
  - Padding: 8px 12px
  - Background: Gradient with `${platform.color}`
  - Color: White
  - Border Radius: 8px
  - Font Size: 13px
  - Font Weight: 600

---

## Provider Cards Grid

### Grid Layout
- **Columns**: `repeat(auto-fill, minmax(400px, 1fr))`
- **Gap**: 16px

### Individual Card
- **Background**: White (#FFFFFF)
- **Border Radius**: 16px
- **Padding**: 20px
- **Border**: 2px solid #e5e7eb
- **Box Shadow**: `0 4px 12px rgba(0,0,0,0.08)`
- **Cursor**: Pointer

**Hover State**:
- Border Color: `${platform.color}`
- Transform: translateY(-6px)
- Box Shadow: `0 16px 40px ${platform.color}30`

### Card Components

#### Platform Badge (Top Right)
- **Position**: Absolute, Top: 12px, Right: 12px
- **Padding**: 4px 10px
- **Background**: `${platform.color}`
- **Color**: White
- **Border Radius**: 12px
- **Font Size**: 11px
- **Font Weight**: 700

#### Provider Avatar
- **Size**: 80px × 80px
- **Border Radius**: 50% (circle)
- **Background**: Gradient with platform color
- **Border**: 3px solid platform color
- **Font Size**: 32px
- **Font Weight**: 700

#### Provider Name
- **Font Size**: 22px
- **Font Weight**: 700
- **Color**: #111827

#### Rating Row
- **Star Icon**: Font Size: 20px
- **Rating**: Font Size: 18px, Font Weight: 700
- **Reviews**: Font Size: 14px, Opacity: 0.9

#### Price
- **Font Size**: 24px
- **Font Weight**: 800
- **Color**: `${platform.color}`

#### Location & Distance
- **Font Size**: 14px
- **Color**: #6b7280

#### Specialties
- **Chips**: Padding: 4px 10px, Background: `${platform.color}15`, Color: `${platform.color}`, Border Radius: 8px, Font Size: 12px
- **Gap**: 6px

#### Verified Badge
- **Padding**: 4px 12px
- **Background**: rgba(255,255,255,0.2)
- **Border Radius**: 12px
- **Font Size**: 12px
- **Font Weight**: 700
- **Backdrop Filter**: Blur(10px)

---

## Color Palette

### Primary Colors
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Accent**: #10b981 (Green for "New" badges)

### Text Colors
- **Primary Text**: #111827
- **Secondary Text**: #374151
- **Tertiary Text**: #6b7280
- **Light Text**: #9ca3af

### Background Colors
- **White**: #FFFFFF
- **Gray Light**: #f3f4f6
- **Gray Medium**: #e5e7eb
- **Gray Dark**: #d1d5db

### Status Colors
- **Error/User Location**: #ef4444 (Red)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)

### Platform Colors (Examples)
- Rover: #00B9B4
- Wag: #FF6B6B
- TaskRabbit: #00C853
- Thumbtack: #009688
- Care.com: #4A90E2

---

## Typography

### Font Families
- Primary: System fonts (Inter, -apple-system, BlinkMacSystemFont, etc.)
- Fallback: sans-serif

### Font Sizes
- **Hero/Title**: 24px-32px (clamp)
- **H1**: 24px
- **H2**: 20px
- **H3**: 18px
- **Body Large**: 16px
- **Body**: 14px
- **Body Small**: 13px
- **Caption**: 12px
- **Tiny**: 11px

### Font Weights
- **Extra Bold**: 800
- **Bold**: 700
- **Semi-Bold**: 600
- **Medium**: 500
- **Regular**: 400

---

## Spacing System

- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 24px
- **2XL**: 32px

---

## Border Radius

- **Small**: 6px
- **Medium**: 8px-10px
- **Large**: 12px
- **XL**: 16px
- **2XL**: 20px
- **Circle**: 50% (for avatars, buttons)

---

## Shadows

- **Small**: `0 4px 12px rgba(0,0,0,0.08)`
- **Medium**: `0 8px 24px rgba(0,0,0,0.08)`
- **Large**: `0 16px 40px rgba(0,0,0,0.3)`
- **Overlay**: `0 4px 12px rgba(0,0,0,0.1)`

---

## Background Gradients

### Page Background (Dynamic)
- Base: Image overlay or gradient
- Overlay: `linear-gradient(135deg, #667eea08 0%, #f8fafc 50%, #764ba208 100%)`
- Attachment: Fixed

### Navigation Bar
- `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6366f1 100%)`

### Map Background
- `linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 50%, #fce7f3 100%)`

---

## Interactive States

### Buttons
- **Default**: As specified above
- **Hover**: Slight transform (translateY(-1px to -2px)), enhanced shadow
- **Active**: Slight scale down (0.98)
- **Disabled**: Opacity: 0.5, Cursor: not-allowed

### Input Fields
- **Default**: Border: 2px solid #e5e7eb
- **Focus**: Border: 2px solid #6366f1, Outline: none
- **Error**: Border: 2px solid #ef4444

### Cards
- **Default**: As specified
- **Hover**: Border color changes to platform color, translateY(-6px), enhanced shadow
- **Selected**: Border: 3px solid platform color

---

## Loading & Empty States

### Loading State
- **Icon**: ⏳ (48px), Animation: spin
- **Text**: "Searching across all platforms..."
- **Font Size**: 18px
- **Color**: #6b7280

### Empty State
- **Icon**: 🔍 (64px)
- **Title**: Font Size: 24px, Font Weight: 700, Color: #111827
- **Message**: Font Size: 16px, Color: #6b7280
- **Button**: Gradient background, White text, 12px border radius

---

## Responsive Breakpoints (Reference)

- **Desktop**: 1600px max width
- **Tablet**: Filters collapse at ~1024px
- **Mobile**: Single column, stacked layout

---

## Notes for Figma Implementation

1. **Auto Layout**: Use Figma Auto Layout for all sections
2. **Components**: Create reusable components for:
   - Provider Cards
   - Filter Buttons
   - Platform Badges
   - Map Markers
   - Tooltips

3. **Variants**: Create component variants for:
   - Selected/Unselected filter buttons
   - Hover states
   - Different platform colors

4. **Interactive Prototyping**: Set up hover states and click interactions

5. **Design Tokens**: Use Figma Variables for:
   - Colors
   - Spacing
   - Border Radius
   - Typography

6. **Map**: Use a placeholder illustration or create a simplified SVG representation

7. **Grid Pattern**: Use a repeated pattern element for the map background

---

## Additional Design Elements

### Icons
- Use emoji or icon fonts for:
  - ⭐ (Star/Rating)
  - 📍 (Location)
  - 🔍 (Search)
  - ✨ (Sparkle/Feature)
  - ✓ (Verified/Check)

### Platform Icons
- Each platform has a unique emoji/icon and color
- See platform data for complete list

### Animations (for prototyping)
- Card hover: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Button hover: 0.2s ease
- Loading spinner: 1s linear infinite

---

This specification provides all the details needed to recreate the search page in Figma. Use these exact measurements, colors, and styling to ensure consistency.

