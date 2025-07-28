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
- **Zero code changes needed** when adding new clones
- **Instant updates** - folder structure automatically updates when clones are activated/deactivated
- **Truly dynamic** - works seamlessly regardless of how many clones you create
- **Self-organizing** - clones are automatically sorted alphabetically

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

The system uses a fully dynamic approach that automatically detects active clones and creates folders:

```typescript
S.documentTypeList('clone')
  .title('Content by Website Clone')
  .filter('isActive == true')
  .defaultOrdering([{field: 'cloneName', direction: 'asc'}])
  .child((cloneId: string) => {
    return S.document()
      .schemaType('clone')
      .documentId(cloneId)
      .child((context: any) => {
        const clone = context.document?.displayed
        // Automatically generate the five categories for this clone
        return S.list()
          .title(`${clone.cloneName} Content`)
          .items(createCloneContentCategories(S, clone))
      })
  })
```

This approach:
- **Automatically fetches** all active clones from the database
- **Sorts them alphabetically** by clone name
- **Creates folders dynamically** without any manual configuration
- **Updates instantly** when clones are added/removed or activated/deactivated

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
3. **Get the clone document ID** by running: `npx sanity exec getClones.js --with-user-token` in the sanity folder
4. **Add the clone folder** in `sanity/deskStructure.ts`:
   ```typescript
   S.listItem()
     .title('Your Clone Name')
     .icon(FiGlobe)
     .child(
       S.list()
         .title('Your Clone Name Content')
         .items(createCloneContentCategories(S, {
           cloneName: 'Your Clone Name',
           cloneReference: 'actual-document-id-here'
         }))
     ),
   ```
5. **Navigate to "All Content by Website"** - your new clone folder is there
6. **Start creating content** by navigating to the appropriate category

#### 📝 Semi-Automatic Process
- **Clone creation** is done through Sanity Studio
- **Folder addition** requires one code update with the correct document ID  
- **Consistent structure** - every clone gets the same five categories
- **Proper filtering** - content is correctly filtered by clone reference

#### 🧪 Testing the System
To test the automatic folder creation:
1. Go to "Website Clones" → "All Clones"
2. Create a new clone (e.g., "Singapore Tutors")
3. Set it as "Active" 
4. Navigate to "All Content by Website"
5. You'll see "Singapore Tutors" folder appear automatically with all five categories!

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

### GROQ Filter Issues (Fixed)
- **Issue**: Error about "cloneName field not existing on tutor schema"
- **Fix**: System now uses `cloneReference._ref == "cloneId"` for filtering
- **Solution**: Updated desk structure with actual clone document IDs
- All content filtering is done by document ID references for optimal performance

### Clone Document IDs
The system now uses the actual Sanity document IDs for filtering:
- Dubai Tutors: Global content (no clone reference)
- Abu Dhabi Tutors: `9aab910c-dd46-48e9-a44f-594906d32ca7`
- Singapore Tutors: `4c395ebb-26a8-48a5-a83c-4f5d4e078587`

### Performance Issues
- The system is designed to be efficient, but with many clones, consider archiving inactive ones

## Future Enhancements

This system is designed to be extensible. Future improvements could include:
- Custom category configurations per clone
- Advanced filtering and search within categories
- Bulk operations for moving content between clones
- Analytics on content usage per clone 