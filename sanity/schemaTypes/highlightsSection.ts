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
            }),
            defineField({
              name: 'iconType',
              title: 'Icon Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Star (for featured card)', value: 'star' },
                  { title: 'Language/Certificate', value: 'language' },
                  { title: 'Education/Books', value: 'education' },
                ],
                layout: 'radio',
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'isFeatured',
              title: 'Featured Card (Blue Background)',
              type: 'boolean',
              description: 'Check this to make the card have a blue background',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'iconType',
              featured: 'isFeatured',
            },
            prepare({ title, subtitle, featured }) {
              return {
                title: title || 'Untitled Highlight',
                subtitle: `${subtitle || 'No icon'} ${featured ? '(Featured)' : ''}`,
              };
            },
          },
        }
      ],
      validation: Rule => Rule.required().min(3).max(3),
      description: 'Add exactly 3 highlights for the homepage. One should be marked as featured (blue background).'
    })
  ]
})

export default addCloneSupport(highlightsSectionSchema) 