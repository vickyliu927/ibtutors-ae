# Subject Hero Sections

## Overview

The Subject Hero Section system allows you to create customized hero content for each subject page, with automatic fallback to default content when no subject-specific hero is configured.

## How It Works

### 1. Subject-Specific Hero Content
- Each subject page can have its own unique hero section
- Customize rating, title, and subtitle for individual subjects
- Hero content is automatically fetched based on the current subject page

### 2. Fallback System
- Default/fallback hero content is used when no subject-specific hero exists
- Ensures all subject pages always have hero content
- Graceful degradation for incomplete configurations

## Managing Hero Sections in Sanity

### Location
Navigate to: **Sanity Studio** → **Subject Pages Content** → **Subject Hero Sections**

### Creating Subject-Specific Hero Sections

1. **Create New Document**
   - Click "Create" in Subject Hero Sections
   - Select the target subject page from the "Subject Page" dropdown
   - Leave "Use as Default/Fallback" unchecked

2. **Configure Content**
   - **Rating Section**: Set score, "based on" text, and review count
   - **Main Title**: Split into two parts (dark text + blue text)
   - **Subtitle**: Descriptive text below the title

3. **Example Configuration**
   ```
   Subject Page: IB Maths
   Rating Score: "4.95/5"
   Based On Text: "based on"
   Review Count: "1200+ reviews"
   Title First Part: "#1 Rated "
   Title Second Part: "IB Maths Tutors"
   Subtitle: "Master IB Mathematics with our experienced examiners..."
   ```

### Creating Default/Fallback Hero Section

1. **Create New Document**
   - Enable "Use as Default/Fallback"
   - Leave "Subject Page" empty
   - Configure general content that works for all subjects

2. **Purpose**
   - Used when no subject-specific hero exists
   - Provides consistent experience across all pages
   - Prevents broken or missing hero sections

## Technical Implementation

### Data Flow

```
Subject Page Request
       ↓
SubjectHeroSection Component
       ↓
getSubjectHeroData(subjectSlug)
       ↓
1. Search for subject-specific hero
2. If not found, use default/fallback
       ↓
Render hero content
```

### Sanity Schema Structure

```typescript
subjectHeroSection {
  subjectPage: reference to subjectPage (optional)
  isDefault: boolean
  rating: {
    score: string
    basedOnText: string
    reviewCount: string
  }
  title: {
    firstPart: string  // Dark text
    secondPart: string // Blue text
  }
  subtitle: text
}
```

### Component Usage

```tsx
// In subject pages
<SubjectHeroSection subjectSlug={params.subject} />

// Component automatically:
// 1. Fetches subject-specific content
// 2. Falls back to default if needed
// 3. Re-fetches when subject changes
```

## Preview Labels in Sanity

Hero sections are labeled for easy identification:
- 📚 **Subject Name** - Subject-specific hero
- 🌐 **Default/Fallback Hero** - Global fallback
- ❓ **Unassigned Hero** - No subject selected

## Best Practices

### Content Strategy
1. **Create Default First**
   - Set up fallback hero before subject-specific ones
   - Use general language that works for all subjects

2. **Prioritize Key Subjects**
   - Start with your most important/popular subjects
   - Customize content to highlight subject-specific benefits

3. **Consistent Messaging**
   - Maintain brand voice across all hero sections
   - Use similar structure but subject-specific details

### Content Guidelines
- **Rating scores** should reflect actual data for credibility
- **Titles** should include subject name for clarity
- **Subtitles** should highlight subject-specific benefits
- **Review counts** can be subject-specific or general

## Troubleshooting

### Hero Not Showing
1. Check if subject-specific hero exists
2. Verify default/fallback hero is created and marked as default
3. Ensure subject page reference is correct

### Wrong Content Displaying
1. Verify subject page slug matches URL parameter
2. Check subject page reference in hero section
3. Clear browser cache and reload

### Performance Considerations
- Hero data is cached for 10 minutes
- Subject changes trigger automatic re-fetching
- No performance impact on navigation between subjects

## Clone Support

The subject hero system is fully compatible with the clone architecture:
- Each clone can have different hero sections
- Subject-specific customization works within each clone
- Fallback system respects clone boundaries 