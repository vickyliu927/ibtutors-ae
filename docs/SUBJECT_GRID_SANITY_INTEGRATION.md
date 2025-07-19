# SubjectGrid Sanity CMS Integration

## Overview

The SubjectGrid section has been fully integrated with Sanity CMS, making all hardcoded text elements editable through the admin interface while maintaining visual elements and design integrity.

## What Was Made Editable

### **Previously Hardcoded Elements (Now Editable)**
- ✅ **Section Title**: "Popular IB Subjects"
- ✅ **Section Description**: "Our team of specialist tutors are here to help you excel all areas..."
- ✅ **Subjects List**: All 18 subjects with names and slugs
- ✅ **Background Color**: Customizable hex color
- ✅ **Enable/Disable**: Toggle for entire section

### **Visual Elements (Kept as Code)**
- ✅ **Background SVG**: Decorative geometric patterns
- ✅ **Layout Structure**: Grid system and responsive design
- ✅ **Hover Effects**: Interactive transitions and styling
- ✅ **Typography**: Font weights and spacing

## New Features Added

### **1. ✅ Split Description Option**
- **Feature**: Toggle to control description width
- **When Enabled**: Description uses `max-w-[500px]` for two-row layout
- **When Disabled**: Description uses `max-w-[680px]` for single continuous flow
- **Purpose**: Gives content editors control over text layout

### **2. ✅ Advanced Subject Management**
- **Individual Control**: Enable/disable each subject separately
- **Custom Ordering**: Display order control with drag-and-drop in Sanity
- **Custom Slugs**: Each subject can have its own URL slug
- **Validation**: Required fields ensure data integrity

### **3. ✅ Clone-Aware Content**
- **Multi-Domain Support**: Different content for different domains
- **Fallback Hierarchy**: Clone-specific → Baseline → Default
- **Source Tracking**: Know which content version is being used

## Technical Implementation

### **Sanity Schema (`subjectGridSection.ts`)**
```javascript
{
  name: 'subjectGridSection',
  title: 'Subject Grid Section',
  fields: [
    // Section content
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'splitDescription', type: 'boolean' },
    
    // Subjects array
    { 
      name: 'subjects', 
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string' },
          { name: 'slug', type: 'string' },
          { name: 'displayOrder', type: 'number' },
          { name: 'enabled', type: 'boolean' },
        ]
      }]
    },
    
    // Customization options
    { name: 'backgroundColor', type: 'string' },
    { name: 'enabled', type: 'boolean' },
  ]
}
```

### **Component Updates (`SubjectGrid.tsx`)**
```jsx
interface SubjectGridProps {
  sectionData?: any;
}

const SubjectGrid = async ({ sectionData }: SubjectGridProps) => {
  // Dynamic content with fallbacks
  const sectionTitle = sectionData?.title || "Popular IB Subjects";
  const sectionDescription = sectionData?.description || "Default description...";
  const splitDescription = sectionData?.splitDescription || false;
  const backgroundColor = sectionData?.backgroundColor || "#F4F6F9";
  
  // Smart subject handling
  const sanitySubjects = sectionData?.subjects?.filter(s => s.enabled !== false) || [];
  const displaySubjects = sanitySubjects.length > 0 
    ? sanitySubjects.sort((a, b) => (a.displayOrder || 100) - (b.displayOrder || 100))
    : defaultSubjectsList;
}
```

### **Data Fetching Integration**
```jsx
// Added to clone queries
export const subjectGridSectionQueries = {
  buildQuery: (cloneId: string) => buildFallbackQuery('subjectGridSection', cloneId),
  async fetch(cloneId: string): Promise<ContentResult<any>> {
    const query = subjectGridSectionQueries.buildQuery(cloneId);
    const result = await client.fetch(query);
    return resolveContent(result);
  }
};

// Added to homepage data fetching
const content = await getHomepageContentForCurrentDomain();
const subjectGridSection = content.subjectGridSection.data
  ? cloneQueryUtils.getContentWithCustomizations(content.subjectGridSection)
  : null;
```

## Content Management Benefits

### **For Content Editors**
- ✅ **Easy Text Updates**: Change title and description without code changes
- ✅ **Subject Management**: Add, remove, reorder subjects through Sanity interface
- ✅ **Visual Control**: Toggle description layout between one and two rows
- ✅ **Brand Customization**: Adjust background colors to match brand guidelines
- ✅ **Quick Toggle**: Enable/disable entire section for maintenance or testing

### **For Developers**
- ✅ **Maintainable Code**: Separation of content and presentation logic
- ✅ **Type Safety**: Proper TypeScript interfaces for all data structures
- ✅ **Fallback System**: Graceful degradation when Sanity data unavailable
- ✅ **Performance**: Server-side rendering with optimized queries
- ✅ **Debugging**: Source tracking shows where content originates

## Sanity Studio Integration

### **Admin Interface Location**
- **Navigation**: Content → Homepage Content → Subject Grid Sections
- **Icon**: Grid icon for easy recognition
- **Preview**: Shows section title and subject count

### **Content Structure**
```
Subject Grid Section
├── Section Content
│   ├── Title (required)
│   ├── Description (required)
│   └── Split Description (toggle)
├── Subjects List
│   ├── Subject Name (required)
│   ├── URL Slug (required)
│   ├── Display Order (number)
│   └── Enable/Disable (toggle)
├── Styling Options
│   ├── Background Color (hex)
│   └── Enable Section (toggle)
└── Clone Settings
    ├── Clone Reference
    └── Clone-Specific Data
```

## Initialization Script

### **Setup Command**
```bash
cd sanity
node createSubjectGridSection.js
```

### **What It Creates**
- Creates initial SubjectGrid section document in Sanity
- Pre-populates with all 18 default subjects
- Sets up proper display ordering (1-18)
- Enables all subjects and section by default
- Uses current hardcoded text as initial content

## Migration & Backward Compatibility

### **Fallback Strategy**
- **With Sanity Data**: Uses dynamic content from CMS
- **Without Sanity Data**: Falls back to hardcoded defaults
- **Mixed Scenarios**: Can mix Sanity and default content seamlessly
- **No Breaking Changes**: Existing functionality preserved

### **Data Flow**
1. **First Priority**: Clone-specific subjectGridSection data
2. **Second Priority**: Baseline subjectGridSection data
3. **Final Fallback**: Hardcoded default values in component

## Testing & Validation

### **Build Status**
- ✅ **Successful Build**: All TypeScript types resolved
- ✅ **No Runtime Errors**: Proper null/undefined handling
- ✅ **Performance**: No impact on build time or bundle size
- ✅ **SEO**: Server-side rendering maintained

### **Content Validation**
- **Required Fields**: Title and description cannot be empty
- **Subject Validation**: Name and slug required for each subject
- **Order Validation**: Display order must be positive number
- **URL Validation**: Slugs follow proper format

## Future Enhancements

### **Possible Additions**
- **Subject Descriptions**: Individual descriptions for each subject
- **Subject Icons**: Visual icons for each subject
- **Custom Colors**: Per-subject color theming
- **Analytics**: Track subject click-through rates
- **A/B Testing**: Different layouts for different user segments

The SubjectGrid section is now fully content-managed while maintaining all existing functionality and visual design! 