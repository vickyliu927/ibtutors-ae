# Dynamic Clone Folders in Sanity Studio

## Overview

The Sanity Studio now automatically creates organized folder structures for each clone website. When you create a new clone (like "Singapore Tutors"), the system automatically generates a complete folder structure with five standard content categories.

## How It Works

### Automatic Folder Creation

1. **When a new clone is created**: A new folder with the clone's name is automatically added to the "All Content by Website" section
2. **Five standard categories**: Each clone automatically gets these five content organization categories:
   - 📊 **Homepage Content**: Hero sections, navbar settings, highlights, testimonials, etc.
   - 📚 **Subject Pages Content**: Subject-specific content, hero sections, FAQ sections
   - 🎯 **Curriculum Pages Content**: Curriculum-specific settings and FAQ sections
   - 💬 **Forms & Communication**: Contact forms and form submissions
   - 👥 **Content Library**: Reusable content like tutors, testimonials, and FAQ items

3. **Automatic filtering**: All documents are automatically filtered by their clone reference, so you only see content relevant to that specific clone

### Content Organization

#### Global vs Clone-Specific Content

- **Dubai Tutors**: Treated as the baseline/global content (documents without a clone reference)
- **Other Clones**: Show only documents that are specifically linked to that clone via the `cloneReference` field

#### Smart Filtering

The system uses intelligent filters to show the right content:

```groovy
// For global content (Dubai Tutors)
'_type == "hero" && !defined(cloneReference)'

// For clone-specific content
'_type == "hero" && cloneReference->cloneName == "Singapore Tutors"'
```

## Benefits

### 1. **Scalable Content Management**
- No need to manually create folder structures for new clones
- Consistent organization across all clones
- Easy to find and manage content for specific regions/markets

### 2. **Improved Content Discovery**
- Content is automatically categorized by type and clone
- Clear separation between different website variants
- Reduced confusion about which content belongs to which clone

### 3. **Streamlined Workflow**
- Content editors can quickly navigate to their specific clone
- All content types are organized in logical categories
- Form submissions are automatically filtered by source website

### 4. **Maintenance-Free Structure**
- No code changes needed when adding new clones
- Folder structure automatically updates when clones are activated/deactivated
- Consistent experience regardless of how many clones exist

## Content Categories Explained

### 📊 Homepage Content
Contains all sections that appear on the homepage:
- Navbar Settings
- Hero Sections
- Highlights Sections
- Tutor Profile Sections
- Trusted Institutions Banners
- Subject Grid Sections
- Advert Block Sections
- Platform Banners
- Testimonial Sections
- FAQ Sections (Homepage)
- Footer Sections

### 📚 Subject Pages Content
Contains content specific to subject pages:
- Subject Hero Sections
- Subject Page Settings
- FAQ Sections (Subject Pages)

### 🎯 Curriculum Pages Content
Contains curriculum-related content:
- Curriculum Page Settings
- FAQ Sections (Curriculum Pages)

### 💬 Forms & Communication
Contains forms and communication content:
- Contact Form Content
- Contact Form Submissions (filtered by source website)

### 👥 Content Library
Contains reusable content that can be shared:
- Tutors
- Testimonials
- FAQ Items
- All FAQ Sections (Overview)

## Technical Implementation

### Desk Structure Configuration

The system uses a helper function `createCloneContentCategories()` that generates the five standard categories for any clone. The main structure uses Sanity's document context system to access clone data:

```typescript
S.documentTypeList('clone')
  .filter('isActive == true')
  .child((cloneId: string) => {
    return S.document()
      .schemaType('clone')
      .documentId(cloneId)
      .child((context: any) => {
        const clone = context.document?.displayed
        // Generate categories based on clone data
      })
  })
```

### Special Handling for Dubai Tutors

Dubai Tutors is treated as the baseline clone and shows global content (documents without a clone reference). This maintains backward compatibility and provides a clear place for default content.

## Usage Instructions

### For Content Editors

1. **Navigate to "All Content by Website"** in the Sanity Studio sidebar
2. **Select your clone** from the list of active clones
3. **Choose the appropriate category** for the content you want to edit:
   - Use "Homepage Content" for main website sections
   - Use "Subject Pages Content" for subject-specific content
   - Use "Curriculum Pages Content" for curriculum-specific content
   - Use "Forms & Communication" for contact forms and submissions
   - Use "Content Library" for reusable content like tutors and testimonials

### For New Clone Creation

1. **Create a new clone** in the "Website Clones" → "All Clones" section
2. **Set it as active** using the "Active" toggle
3. **The folder structure appears automatically** in "All Content by Website"
4. **Start creating content** by navigating to the appropriate category

### Best Practices

1. **Use the clone reference field** when creating new content to ensure it appears in the correct clone folder
2. **Keep content organized** by using the appropriate category for each content type
3. **Use descriptive names** for clones to make navigation easier
4. **Regularly review inactive clones** and archive them if no longer needed

## Troubleshooting

### Clone Not Appearing in Folder List
- Check that the clone is marked as "Active" in the clone settings
- Refresh the Studio if changes don't appear immediately

### Content Not Showing in Clone Folder
- Verify the content has the correct clone reference set
- Check that the content type is supported in the category you're looking in

### Performance Issues
- The system is designed to be efficient, but with many clones, consider archiving inactive ones

## Future Enhancements

This system is designed to be extensible. Future improvements could include:
- Custom category configurations per clone
- Advanced filtering and search within categories
- Bulk operations for moving content between clones
- Analytics on content usage per clone 