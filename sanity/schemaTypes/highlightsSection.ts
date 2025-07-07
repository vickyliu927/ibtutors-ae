import { defineType, defineField } from 'sanity';
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const highlightsSectionSchema = defineType({
  name: 'highlightsSection',
  title: 'Homepage Highlights Section',
  type: 'document',
  fields: [
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Name of the icon (e.g., globe, book, check). Choose from a predefined set in the frontend.'
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: Rule => Rule.required(),
            })
          ]
        }
      ],
      validation: Rule => Rule.required().min(3).max(3),
      description: 'Add exactly 3 highlights for the homepage.'
    })
  ]
})

export default addCloneSupport(highlightsSectionSchema) 