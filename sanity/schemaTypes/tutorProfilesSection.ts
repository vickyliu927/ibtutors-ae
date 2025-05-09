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
      name: 'ctaText',
      title: 'Call-to-Action Text',
      type: 'string',
      description: 'Text that will be displayed as a link (e.g., "View all our Maths tutors on TutorChase, the world\'s top tutoring provider")',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call-to-Action Link URL',
      type: 'url',
      description: 'URL where the link text will direct to',
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