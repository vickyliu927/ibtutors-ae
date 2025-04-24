import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subject',
  title: 'Subjects',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Subject Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Subject Link',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'The URL path for this subject (e.g., "/maths", "/physics")',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().min(1),
      description: 'The order in which this subject should appear in the grid',
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'link'
    }
  }
}) 