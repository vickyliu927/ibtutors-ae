import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const platformBannerSchema = defineType({
  name: 'platformBanner',
  title: 'Platform Banner',
  type: 'document',
  initialValue: {
    title: 'Engaging Lessons with our Online Platform',
    subtitle: 'ONLINE TUTORING PLATFORM',
    description: 'Our online platform brings lessons to life, allowing students to draw diagrams, solve equations, edit essays, and annotate work. We deliver elite tutoring worldwide, matching students with the best tutors available.',
    features: [
      { feature: 'Interactive whiteboard for real-time collaboration' },
      { feature: 'HD video and crystal-clear audio' },
      { feature: 'Document sharing and annotation tools' }
    ]
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The main title for the platform banner section (e.g., "Engaging Lessons with our Online Platform")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The subtitle or heading below the title (e.g., "ONLINE TUTORING PLATFORM")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'The main description text explaining the platform features',
    }),
    defineField({
      name: 'features',
      title: 'Platform Features',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'feature',
              title: 'Feature',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
          ],
        },
      ],
      description: 'List of platform features (e.g., "Interactive whiteboard", "HD video")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})

export default addCloneSupport(platformBannerSchema) 