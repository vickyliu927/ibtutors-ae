import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tutorProfilesSection',
  title: 'Tutor Profiles Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The main title for the tutor profiles section (e.g., "Our Qualified IB Teachers and Examiners")',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'isDefault',
      title: 'Is Default Section',
      type: 'boolean',
      description: 'If checked, this content will be used as the default for all pages',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      description: 'Which page this section appears on (leave empty if isDefault is true)',
      options: {
        list: [
          { title: 'Home Page', value: 'home' },
          { title: 'Maths Page', value: 'maths' },
          { title: 'English Page', value: 'english' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      page: 'page',
      isDefault: 'isDefault',
    },
    prepare({ title, page, isDefault }) {
      return {
        title: title,
        subtitle: isDefault ? 'Default Section' : `Page: ${page}`,
      }
    },
  },
}) 