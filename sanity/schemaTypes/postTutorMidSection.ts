import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const postTutorMidSectionSchema = defineType({
  name: 'postTutorMidSection',
  title: 'Lesson Structure',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Section',
      type: 'boolean',
      description: 'Enable or disable Lesson Structure for this clone/website.',
      initialValue: false,
    }),
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Small label above the title (e.g., "LESSON STRUCTURE").',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main heading.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short paragraph under the title.',
    }),
    defineField({
      name: 'cardBackgroundColor',
      title: 'Card Background Color',
      type: 'string',
      description: 'Background color for the session cards.',
      initialValue: '#FEF2EC',
    }),
    defineField({
      name: 'sessions',
      title: 'Sessions',
      type: 'array',
      description: 'Up to six sessions displayed as cards.',
      of: [
        defineField({
          name: 'session',
          title: 'Session',
          type: 'object',
          fields: [
            defineField({
              name: 'sessionNumber',
              title: 'Session Number Label',
              type: 'string',
              description: 'e.g., "Session 1".',
            }),
            defineField({
              name: 'title',
              title: 'Session Title',
              type: 'string',
            }),
            defineField({
              name: 'bulletPoints',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
})

export default addCloneSupport(postTutorMidSectionSchema)


