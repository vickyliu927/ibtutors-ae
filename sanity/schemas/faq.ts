import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'The FAQ question (e.g., "Are IB Tutor available during Ramadan and other UAE holidays?")',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
      description: 'The answer to the FAQ question',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().min(1),
      description: 'The order in which this FAQ should appear (1 being first)',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle,
      }
    },
  },
}) 