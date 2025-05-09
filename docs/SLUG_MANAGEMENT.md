# Subject Slug Management System

This document explains the dynamic URL system that automatically updates all references to subject pages when their slugs are changed in Sanity.

## Overview

When a subject page slug is changed in Sanity (e.g., from "english" to "online-dubai-english-tutor"), the system automatically:

1. Updates all links in the subject grid on the homepage
2. Updates the "Hire a Tutor" button links for tutors associated with that subject
3. Revalidates the affected pages to reflect changes immediately

## How It Works

### 1. Slug Manager Service

The `slugManager.ts` service:
- Maintains a cache of subject page slugs
- Provides functions to get the current URL for any subject
- Handles both subject names and IDs for lookups

### 2. React Hook

The `useSubjectUrl.ts` hook:
- Allows React components to easily get current subject page URLs
- Reactively updates when slugs change

### 3. Automatic Link Updates

When a subject page slug changes, the system:
- Updates all tutor "Hire a Tutor" button links for that subject
- Updates navigation components automatically

### 4. Sanity Webhook

A webhook endpoint (`/api/sanity-webhook/route.ts`) listens for:
- Subject page slug changes in Sanity
- Automatically updates related tutor links

## Setup Instructions

1. **Configure Sanity Webhook**:
   In your Sanity dashboard, create a new webhook:
   - Name: "Update Slug References"
   - URL: `https://your-website.com/api/sanity-webhook`
   - Trigger on: "Changes to documents of type 'subjectPage'"
   - Filter: `{"_type": "subjectPage"}`
   - Secret: Generate a secret and set it as `SANITY_WEBHOOK_SECRET` in your environment variables

2. **Environment Variables**:
   ```
   SANITY_WEBHOOK_SECRET=your-secret-here
   ```

## Usage in Components

```tsx
// Example usage in a component
import { useSubjectUrl } from '../hooks/useSubjectUrl';

const MyComponent = () => {
  // Get the current URL for the English subject page
  const englishPageUrl = useSubjectUrl('English', 'contact-form'); 
  
  return (
    <a href={englishPageUrl}>Contact an English Tutor</a>
  );
};
```

## Best Practices

1. Always use the slug manager or hook instead of hardcoding subject page URLs
2. When setting a tutor's "Hire Button Link" in Sanity, use the format:
   - `/{slug}#contact-form` (e.g., "/online-dubai-english-tutor#contact-form")
3. For the homepage link, use "/#contact-form"

## Troubleshooting

If links aren't updating properly:
1. Check that the webhook is properly configured in Sanity
2. Verify the tutor is properly associated with the subject page in Sanity
3. Try manually triggering a revalidation by editing and saving the subject page 