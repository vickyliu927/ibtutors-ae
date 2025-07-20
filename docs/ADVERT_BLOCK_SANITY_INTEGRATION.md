# AdvertBlock Sanity CMS Integration

## Overview

The AdvertBlock component has been fully integrated with Sanity CMS, making all content elements editable while maintaining the visual design and layout as code. This integration supports the clone-aware multi-domain architecture with fallback hierarchy.

## Integration Summary

### **✅ Content Made Editable in Sanity**
- **Main Title**: "Voted #1 for IB" - fully customizable
- **Subtitle**: "by 10,000+ students" - editable with validation
- **Description Text**: Main promotional description - configurable
- **Highlighted Platform Name**: "IB Resources Platform" - editable with underline styling
- **Pricing Text**: "- normally £29/month!" - fully customizable
- **Background Color**: Hex color picker with validation
- **Enable/Disable Toggle**: Show or hide the entire section
- **Display Order**: Control positioning relative to other sections

### **✅ Visual Elements (Kept as Code)**
- **Geometric Background**: SVG patterns and decorative elements
- **Layout Structure**: Responsive design and spacing
- **Typography**: Font weights, sizes, and hierarchy
- **Book Icon**: Positioned decorative element
- **Hover Effects**: Interactive states and animations

## Sanity Schema Configuration

### **Core Fields**
```typescript
interface AdvertBlockSectionData {
  title: string;              // Main headline
  subtitle: string;           // Secondary headline
  description: string;        // Promotional description
  highlightText: string;      // Underlined platform name
  pricingText: string;        // Pricing information
  backgroundColor: string;    // Hex color code
  enabled: boolean;          // Show/hide toggle
  displayOrder: number;      // Section ordering
  cloneReference?: Clone;    // Multi-domain support
  customizations?: object;   // Clone-specific overrides
  isActive: boolean;         // Active status
}
```

### **Field Validation**
- **Title**: Max 60 characters for optimal display
- **Subtitle**: Max 80 characters with responsive design
- **Description**: Max 200 characters for readability
- **Platform Name**: Max 50 characters for layout consistency
- **Pricing Text**: Max 50 characters for design balance
- **Background Color**: Hex color validation (#001A96 format)
- **Display Order**: Positive integer validation

## Component Integration

### **Data Flow**
```jsx
// Homepage data fetching
const advertBlockSection = content.advertBlockSection.data
  ? cloneQueryUtils.getContentWithCustomizations(content.advertBlockSection)
  : null;

// Component usage
{advertBlockSection?.enabled !== false ? (
  <AdvertBlock sectionData={advertBlockSection} />
) : null}

// Component implementation
const AdvertBlock: React.FC<AdvertBlockProps> = ({ sectionData }) => {
  const title = sectionData?.title || "Voted #1 for IB";
  const subtitle = sectionData?.subtitle || "by 10,000+ students";
  const description = sectionData?.description || "Default description...";
  const highlightText = sectionData?.highlightText || "IB Resources Platform";
  const pricingText = sectionData?.pricingText || "- normally £29/month!";
  const backgroundColor = sectionData?.backgroundColor || "#001A96";
  
  // Visual elements remain as code
  return (
    <section>
      {/* SVG Background Patterns */}
      {/* Dynamic Content */}
      {/* Layout Structure */}
    </section>
  );
};
```

## Clone-Aware Multi-Domain Support

### **Fallback Hierarchy**
1. **Clone-Specific**: Custom content for specific domains
2. **Baseline**: Shared content across related clones
3. **Default**: Global fallback content

### **Content Resolution**
```typescript
// Query structure with 3-tier fallback
const advertBlockSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery(
    'advertBlockSection',
    cloneId,
    // All editable fields included
  ),
  
  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = advertBlockSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query);
    return resolveContent(result);
  }
};
```

### **Customization Options**
- **Clone-Specific Content**: Unique advert blocks per domain
- **Field-Level Overrides**: Customize individual fields per clone
- **Shared Baseline**: Common content with domain-specific tweaks
- **Global Defaults**: Fallback content for new or unconfigured domains

## Sanity Studio Configuration

### **Desk Structure Integration**
```typescript
// Added to Homepage Content section
S.documentTypeListItem('advertBlockSection')
  .title('Advert Block Sections'),
```

### **Content Management Features**
- **Visual Preview**: See title, subtitle, and status at a glance
- **Status Indicators**: ✅ enabled, ❌ disabled
- **Clone Information**: Shows which clone content belongs to
- **Display Order**: Sort by position in page layout
- **Search & Filter**: Find content by clone or status

### **Document Preview**
```
✅ Voted #1 for IB (Global)
by 10,000+ students | Order: 5
```

### **Schema Fix Applied**
- **Removed Emoji Icon**: Fixed InvalidCharacterError by removing emoji from schema preview
- **Clean Preview**: Document preview now shows status, title, clone info, and order without icon

## Data Fetching & Performance

### **Homepage Integration**
```typescript
// Parallel query execution
const [
  // ... other sections
  advertBlockSection,
  // ... remaining sections
] = await Promise.all([
  // ... other queries
  advertBlockSectionQueries.fetch(cloneId),
  // ... remaining queries
]);
```

### **Performance Optimizations**
- **Server-Side Rendering**: All content fetched on server
- **Parallel Queries**: AdvertBlock fetched with other homepage content
- **Clone-Aware Caching**: Efficient content resolution
- **Fallback Defaults**: No additional requests for missing content

## Installation & Setup

### **Schema Registration**
```typescript
// sanity/schemaTypes/index.ts
import advertBlockSection from './advertBlockSection'

export const schemaTypes = [
  // ... existing schemas
  advertBlockSection,
]
```

### **Initial Content Creation**
```bash
# Run initialization script
node sanity/createAdvertBlockSection.js
```

### **Homepage Data Pipeline**
```typescript
// app/lib/cloneQueries.ts - Already integrated
export const homepageQueries = {
  async fetchAll(cloneId: string) {
    // advertBlockSection included in parallel fetching
  }
};
```

## Content Management Workflow

### **Creating New AdvertBlock Content**
1. **Navigate** to Sanity Studio → Homepage Content → Advert Block Sections
2. **Create** new document
3. **Configure** content fields:
   - Set compelling title and subtitle
   - Write promotional description
   - Configure platform name and pricing
   - Choose background color
   - Set display order and enable status
4. **Assign** to specific clone (or leave global)
5. **Publish** document

### **Clone-Specific Customization**
1. **Duplicate** baseline content or create new
2. **Set Clone Reference** to target domain
3. **Customize** specific fields in main content or customizations object
4. **Publish** clone-specific version

### **Content Strategy**
- **Global Baseline**: Standard promotional content
- **Regional Variations**: Localized pricing and platform names
- **Campaign Specific**: Temporary promotional content
- **A/B Testing**: Different versions for testing

## Recent Updates

### **Font Weight Enhancement**
- **Title Bold**: Changed from font-weight 300 to font-semibold (600)
- **Visual Impact**: Stronger headline presence
- **Maintained Balance**: Subtitle remains light weight for hierarchy

### **Complete Sanity Integration**
- **Hardcoded to Dynamic**: All text content now managed in CMS
- **Fallback Safety**: Robust defaults prevent empty content
- **Clone Support**: Full multi-domain content management
- **Performance**: Optimized data fetching and caching

## Benefits Achieved

### **Content Management**
- ✅ **No Code Changes**: Update promotional content without deployments
- ✅ **Multi-Domain**: Unique content per domain with shared fallbacks
- ✅ **Real-Time**: Instant content updates via Sanity CDN
- ✅ **Validation**: Built-in content validation and guidelines

### **Developer Experience**
- ✅ **Type Safety**: Full TypeScript integration
- ✅ **Maintainable**: Clean separation of content and presentation
- ✅ **Extensible**: Easy to add new fields or features
- ✅ **Debuggable**: Clear data flow and error handling

### **Business Value**
- ✅ **Marketing Agility**: Rapid promotional content updates
- ✅ **Localization**: Domain-specific messaging and pricing
- ✅ **Campaign Management**: Easy promotional content scheduling
- ✅ **Consistency**: Standardized content formats with flexibility

## Build Status

- **✅ Successful Build**: All changes compile without errors
- **✅ Schema Validation**: Sanity schema properly registered
- **✅ Data Flow**: Complete homepage data pipeline integration
- **✅ Component Updates**: AdvertBlock component fully CMS-integrated
- **✅ Content Creation**: Default content successfully initialized

The AdvertBlock component is now fully content-managed while maintaining all visual design elements and performance characteristics! 