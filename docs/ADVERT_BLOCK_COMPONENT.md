# AdvertBlock Component

## Overview

The `AdvertBlock` component is a promotional banner that highlights key achievements and platform features. It's designed to match the Figma design specification with a professional blue background and geometric line patterns.

## Component Features

### **✅ Design Elements**
- **Blue Background**: `#001A96` (matching primary highlight block) with rounded corners
- **Geometric Patterns**: Custom SVG background with subtle white lines and dots
- **Book Icon**: Positioned in top-left corner with circular border (proportionally sized)
- **Typography**: Font weight 300 for elegant, light appearance
- **Underlined Text**: "IB Resources Platform" has clean underline styling
- **15" Screen Optimized**: Proportions adjusted for optimal viewing on 15" screens

### **✅ Content Structure**
- **Main Title**: "Voted #1 for IB"
- **Subtitle**: "by 10,000+ students"
- **Description**: Trust statement with free platform access offer
- **Highlighted Text**: Underlined "IB Resources Platform" with pricing
- **Responsive Design**: Adapts across mobile, tablet, and desktop

## Design Implementation

### **Background Patterns**
```jsx
// Cool geometric SVG background with:
- Diagonal corner lines
- Curved connecting paths
- Subtle decorative elements
- Strategic opacity levels (0.05-0.1)
- Proper containment within rounded borders
```

### **Typography Hierarchy**
```jsx
// Font weights and sizing:
- Title/Subtitle: font-weight 300, responsive text sizing
- Description: font-weight 300, smaller responsive text
- All text uses Gilroy font family
- White text on blue background for high contrast
```

### **Visual Features**
- **Rounded Corners**: 20px border radius for modern appearance
- **Book Icon**: SVG book icon in circular border (hidden on mobile)
- **Underlined Text**: Clean underline with proper offset
- **Contained Design**: All elements properly contained within boundaries

## Props Interface

```tsx
interface AdvertBlockProps {
  title?: string;                    // Main headline
  subtitle?: string;                 // Secondary headline  
  description?: string;              // Main description text
  highlightText?: string;            // Text to underline (platform name)
  backgroundColor?: string;          // Background color (default: #001A96)
  className?: string;               // Additional CSS classes
}
```

## Usage

### **Default Implementation**
```jsx
<AdvertBlock />
```

### **Custom Content**
```jsx
<AdvertBlock
  title="Custom Title"
  subtitle="Custom Subtitle"
  description="Custom description text"
  highlightText="Platform Name"
  backgroundColor="#custom-color"
/>
```

## Positioning

- **Homepage Location**: Positioned after SubjectGrid section, before InteractiveTutoringPlatform
- **Layout**: Full-width responsive container with max-width constraints (1200px for 15" screen optimization)
- **Spacing**: Increased height with generous padding for enhanced visual presence

## Technical Details

### **Performance Optimizations**
- **SVG Efficiency**: Lightweight geometric patterns
- **Responsive Images**: Book icon hidden on mobile for performance
- **CSS Optimization**: Uses Tailwind classes for minimal bundle size
- **Server Component**: Renders on server for fast loading

### **Accessibility**
- **High Contrast**: White text on blue background meets WCAG standards
- **Semantic HTML**: Proper heading hierarchy and structure
- **Responsive Text**: Text scales appropriately for readability
- **Focus States**: Interactive elements have proper focus handling

### **Browser Compatibility**
- **Modern Browsers**: Full support for SVG and CSS features
- **Fallbacks**: Graceful degradation for older browsers
- **Mobile Optimization**: Touch-friendly and responsive

## Maintenance

### **Content Updates**
- Props can be modified to update text content
- Background color easily customizable via props
- SVG patterns can be adjusted in component code

### **Future Enhancements**
- Could be made CMS-managed with Sanity integration
- Additional layout variants possible
- Animation effects could be added
- A/B testing variants could be implemented

## Recent Updates

### **Height Enhancement**
- **Increased Vertical Spacing**: Enhanced proportions to match reference screenshot
  - Section padding: `py-8` → `py-12` (48px top/bottom)
  - Container padding: Mobile `py-12`, Small `py-14`, Desktop `py-[80px]` 
  - Text spacing: Increased margin between subtitle and description from `mb-6` to `mb-8`
  - SVG Background: Adjusted viewBox from 200 to 280 height with proportional path scaling
- **Visual Impact**: Taller, more prominent block with improved content breathing room
- **Maintained Width**: Container width remains at 1200px for consistent layout alignment

## Build Status

- **✅ Successful Build**: Component builds without errors
- **✅ Type Safety**: Full TypeScript interface support
- **✅ Performance**: Optimized SVG and CSS implementation
- **✅ Responsive**: Works perfectly across all device sizes
- **✅ Height Optimized**: Proportions match reference design with generous spacing

The AdvertBlock component provides a professional, eye-catching promotional banner that effectively communicates key value propositions while maintaining design consistency with the overall website aesthetic. 