import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mathsPage',
  title: 'Maths Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The main title of the maths page',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'A subtitle or tagline for the maths page',
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      description: 'Main description of the IB maths tutoring services',
    }),
    defineField({
      name: 'featuredTutors',
      title: 'Featured Maths Tutors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tutor' }] }],
      description: 'Select maths tutors to feature on this page',
    }),
    defineField({
      name: 'mathsSubjects',
      title: 'Maths Subjects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Subject Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'e.g., "IB Mathematics Analysis and Approaches HL"',
            },
            {
              name: 'description',
              title: 'Subject Description',
              type: 'text',
              description: 'Brief description of the subject and what it covers',
            },
            {
              name: 'topics',
              title: 'Key Topics',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'List of key topics covered in this subject',
            },
          ],
        },
      ],
      description: 'Different maths subjects and courses offered',
    }),
    defineField({
      name: 'testimonials',
      title: 'Maths-Specific Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Select testimonials specific to maths tutoring',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title used for search engines and browser tabs',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for search engine results',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Keywords for search engine optimization',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
}) 