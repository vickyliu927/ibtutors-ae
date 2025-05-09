# Next.js + Tailwind CSS Tutor Website Boilerplate

This is a boilerplate for creating tutor websites using Next.js and Tailwind CSS.

## Features

- Next.js 13+ with App Router
- TypeScript support
- Tailwind CSS for styling
- Responsive design
- SEO optimized
- Component-based architecture
- JSON-based data management

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── components/    # Reusable UI components
│   ├── globals.css   # Global styles and Tailwind imports
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── data/            # JSON data files (deprecated - using Sanity now)
├── public/          # Static assets
│   └── images/
├── sanity/          # Sanity CMS integration
│   ├── lib/         # Sanity utility functions
│   └── schemaTypes/ # Content schemas
├── next.config.js  # Next.js configuration
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

1. Add your images to `public/images/`
2. Modify the color scheme in `tailwind.config.ts`
3. Update content through the Sanity Studio interface
4. Modify components under `app/components/` as needed

## Dependencies

- Next.js
- React
- TypeScript
- Tailwind CSS
- @tailwindcss/forms 