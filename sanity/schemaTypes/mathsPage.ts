import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mathsPage',
  title: 'Maths Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      description: 'The main title of the maths page (e.g., "Our Professional IB Maths Tutors")',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      description: 'The subtitle text below the main title',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'tutorChaseLink',
      title: 'TutorChase Link',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Link Text',
          type: 'string',
          description: 'The text to display for the TutorChase link',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'url',
          title: 'URL',
          type: 'url',
          description: 'The URL for the TutorChase link',
          validation: (Rule: any) => Rule.required(),
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 