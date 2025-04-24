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
├── data/            # JSON data files
│   ├── subjects.json
│   └── tutors.json
├── public/          # Static assets
│   └── images/
├── next.config.js  # Next.js configuration
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

1. Update `data/tutors.json` with your tutor information
2. Update `data/subjects.json` with your subject list
3. Add your images to `public/images/`
4. Modify the color scheme in `tailwind.config.ts`
5. Update content in components under `app/components/`

## Dependencies

- Next.js
- React
- TypeScript
- Tailwind CSS
- @tailwindcss/forms 