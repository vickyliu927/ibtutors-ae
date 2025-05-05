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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      description: 'A brief description or subtitle for the tutor profiles section',
    }),
    defineField({
      name: 'tutors',
      title: 'Featured Tutors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tutor' }] }],
      description: 'Select the tutors to display in this section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
}) 