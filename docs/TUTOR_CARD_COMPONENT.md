# TutorCard Component

## Overview

The `TutorCard` component is a new design implementation that exactly matches the Figma design specifications. It provides a clean, modern card layout for displaying tutor information with a fixed horizontal layout.

## Features

- **Fixed Dimensions**: 1120px × 280px card size
- **Horizontal Layout**: 280×280px image on left, information panel on right
- **Figma-Exact Styling**: Matches colors, fonts, and spacing from design
- **Responsive Elements**: Star ratings, student counts, subject tags
- **Professional Typography**: Uses Gilroy font family as specified

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [280x280 Image]  │  Name    ★★★★★ 4.9    👥 100+ students   │
│                   │  🎓 University | Department              │
│                   │  Description text here...                │
│                   │  Teaches: [Subject Tag]    [Hire Button] │
└─────────────────────────────────────────────────────────────┘
```

## Usage

### Basic Usage

```tsx
import TutorCard, { TutorCardData } from "./components/TutorCard";

const tutorData: TutorCardData = {
  _id: "tutor-1",
  name: "Megan",
  professionalTitle: "IB Maths Tutor | University of Amsterdam",
  experience:
    "I'm Megan, an IB Mathematics tutor with 5 years of experience...",
  profilePhoto: tutorImageObject,
  specialization: {
    mainSubject: "IB Maths",
    additionalSubjects: ["Statistics", "Calculus"],
  },
  hireButtonLink: "/#contact-form",
  rating: 4.9,
  activeStudents: 100,
};

<TutorCard tutor={tutorData} />;
```

### Integration with TutorProfiles

The `TutorProfiles` component now supports the new card design via the `useNewCardDesign` prop:

```tsx
import TutorProfiles from "./components/TutorProfiles";

<TutorProfiles
  tutors={tutorData}
  useNewCardDesign={true}
  // ... other props
/>;
```

## Data Interface

```typescript
interface TutorCardData {
  _id: string;
  name: string;
  professionalTitle?: string;
  experience: string;
  profilePhoto: any; // Sanity image object
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  hireButtonLink: string;
  rating?: number;
  activeStudents?: number;
}
```

## Design Specifications

### Colors

- **Border**: `#E6E7ED`
- **Background**: `#FFF` (white)
- **Text Primary**: `#171D23` (dark)
- **Tag Background**: `#FBFCFD` (light gray)
- **Subject Tag Text**: `#001A96` (blue)
- **Button Background**: `#171D23` (dark)
- **Button Text**: `#FFF` (white)
- **Icon Colors**: `#F57C40` (orange), `#4053B0` (blue)

### Typography

- **Font Family**: Gilroy (with fallbacks)
- **Name**: 24px, font-weight 700
- **Content**: 16px, font-weight 400
- **Tags**: 14px, font-weight 700

### Layout

- **Card**: 1120px × 280px, border-radius 20px
- **Image**: 280px × 280px, border-radius 3px 0 0 3px
- **Padding**: 24px 32px 0 32px (top section)
- **Button**: 16px 36px padding, border-radius 16px 0 0 0

## Icons

The component includes several SVG icons:

- **Star Rating**: 5 golden stars with rating number
- **Students**: People icon with count
- **Education**: Graduation cap icon
- **Button**: Located at bottom-right corner

## Fallbacks

- **Missing Image**: Uses Figma design image as fallback
- **Missing Rating**: Defaults to 4.9
- **Missing Student Count**: Defaults to 100+
- **Missing Professional Title**: Uses sample text

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Next.js Image component requirements
- SVG support for icons

## Testing

A test page is available at `/tutor-card-test` to preview the component with sample data.

## Migration Notes

- The new component is separate from the existing `TutorProfiles` complex design
- Both designs can coexist - use `useNewCardDesign` prop to switch
- Data interface is compatible with existing `TutorData` structure
- No breaking changes to existing implementations
