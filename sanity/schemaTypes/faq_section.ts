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
      validation: (Rule: any) => Rule.required(),
      description: 'The main title for the FAQ section (e.g., "Frequently Asked Questions")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      description: 'An optional subtitle or description for the FAQ section',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'FAQ' }] }],
      validation: (Rule: any) => Rule.required(),
      description: 'Select the FAQs to display in this section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare({ title = '', subtitle = '' }: Record<string, string>) {
      return {
        title,
        subtitle,
      }
    },
  },
}) 