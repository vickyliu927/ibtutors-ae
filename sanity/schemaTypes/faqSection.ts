import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq_section',
  title: 'FAQ Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The title of the FAQ section (e.g., "FAQ")',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      description: 'Optional subtitle or description for the FAQ section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 