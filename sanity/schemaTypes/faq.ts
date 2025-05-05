import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'The frequently asked question',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
      description: 'The answer to the question',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
      description: 'The order in which this FAQ should appear (lower numbers appear first)',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
    prepare({ title = '', subtitle = '' }: Record<string, string>) {
      return {
        title,
        subtitle: subtitle?.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle,
      }
    },
  },
}) 