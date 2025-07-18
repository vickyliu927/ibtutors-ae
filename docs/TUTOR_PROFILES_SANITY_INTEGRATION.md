# Tutor Profiles Section - Sanity Integration

## Overview

The Tutor Profiles section has been fully integrated with Sanity CMS, making all text content editable by content managers. Previously hardcoded elements are now dynamically pulled from Sanity.

## What Was Changed

### Previously Hardcoded Content (Now Editable in Sanity):
1. **"Trusted by 15,000+ students across Dubai and globally."** → `trustedByText` field
2. **"Our Qualified Dubai Teachers and Examiners"** → `title` field  
3. **"We have a team of expert online tutors at prices ranging from AED 140-390/hour."** → `description` field
4. **"Contact us with your requirements and budget and we'll find the perfect tutor for you!"** → `contactText` field

### Still Dynamic from Other Sources:
- Individual tutor data (names, photos, bios, subjects, etc.)
- CTA links and text (when provided by subject pages)

## Sanity Schema Fields

### New Fields Added to `tutorProfilesSection`:

```typescript
{
  trustedByText: string (required) - Orange subtitle text
  title: string (required) - Main section title
  description: text (required) - Light description paragraph
  contactText: text (required) - Bold contact call-to-action
  subtitle: text (legacy) - Kept for backward compatibility
  ctaText: string - Call-to-action link text
  ctaLink: url - Call-to-action link URL
}
```

## How to Edit Content

### In Sanity Studio:

1. **Navigate to Content > Tutor Profiles Section**
2. **Edit the following fields:**
   - **Trusted By Text**: The orange subtitle (e.g., "Trusted by 15,000+ students...")
   - **Main Section Title**: The main title (e.g., "Our Qualified Dubai Teachers...")
   - **Description**: The light description text (e.g., "We have a team of expert...")
   - **Contact Text**: The bold contact text (e.g., "Contact us with your requirements...")
   - **Call-to-Action Text**: Optional link text
   - **Call-to-Action Link URL**: Optional link destination

3. **Publish changes** and they will appear on the website immediately

## File Changes Made

### 1. Sanity Schema (`sanity/schemaTypes/tutorProfilesSection.ts`)
- Added `trustedByText`, `description`, `contactText` fields
- Updated field descriptions and validation
- Marked legacy `subtitle` field

### 2. Component (`app/components/TutorProfiles.tsx`)
- Added new props interface for Sanity fields
- Updated component to use dynamic content with fallbacks
- Maintained backward compatibility

### 3. Queries (`app/lib/cloneQueries.ts`)
- Updated tutorProfilesSection query to fetch new fields
- Maintains clone-aware functionality

### 4. Pages (`app/page.tsx`)
- Updated homepage to pass new Sanity fields to component
- Subject pages use fallback values automatically

## Setup Script

Run the setup script to initialize default content:

```bash
cd sanity
node createTutorProfilesSection.js
```

This script will:
- Create a new tutorProfilesSection document with default content
- OR update existing document with new fields (if missing)

## Fallback Behavior

If Sanity fields are empty or missing, the component will show the original hardcoded content as fallbacks, ensuring the website never breaks.

## Clone Support

The tutor profiles section supports the clone system, meaning different website clones can have different content for this section while sharing the same tutor data.

## Testing

1. **Check Current Content**: Visit homepage to see current content
2. **Edit in Sanity**: Update fields in Sanity Studio
3. **Verify Changes**: Refresh homepage to see updates
4. **Test Fallbacks**: Clear a field in Sanity to test fallback content

## Benefits

- ✅ **Content Manager Friendly**: Non-technical users can edit all text
- ✅ **No Code Changes**: Content updates don't require developer intervention  
- ✅ **SEO Flexible**: Titles and descriptions can be optimized per clone
- ✅ **Fallback Safe**: Website never breaks if Sanity data is missing
- ✅ **Clone Aware**: Different content for different website versions 