# SEO Link Settings (Nofollow)

The website includes a feature to control the `rel="nofollow"` attribute on external links, which is important for SEO purposes.

## Overview

This feature allows you to:

1. Set a global default for all external links (follow or nofollow)
2. Specify domains that should always have nofollow applied
3. Specify domains that should never have nofollow applied (exceptions to the default)

## Using the Feature

### In the Sanity Studio

1. Navigate to "SEO Settings" > "Link Settings (Nofollow)"
2. Create a new Link Settings document or edit an existing one
3. Configure the following options:
   - **Default Nofollow Setting**: When enabled, all external links will have `rel="nofollow"` by default
   - **Domains to Apply Nofollow**: Specific domains that should have nofollow applied (e.g., "tutorchase.com")
   - **Domains to Exclude from Nofollow**: Specific domains that should NOT have nofollow applied, even if defaultNofollow is true

### In Your React Components

The website already uses the `ExternalLink` component for external links, which automatically applies the nofollow settings.

If you're creating a new component that includes external links, use the `ExternalLink` component instead of a regular `<a>` tag:

```jsx
import ExternalLink from '../components/ui/ExternalLink';

// In your component
<ExternalLink 
  href="https://example.com" 
  target="_blank"
  className="your-class-here"
>
  Link text
</ExternalLink>
```

## How It Works

1. The system fetches link settings from Sanity CMS
2. For each external link, it checks if the domain matches any rules
3. It applies the appropriate `rel` attribute based on these rules
4. The `rel` attribute includes standard security settings (`noopener noreferrer`) plus conditionally adds `nofollow` 