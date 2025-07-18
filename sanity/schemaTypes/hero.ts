import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const heroSchema = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'titleFirstRow',
      title: 'Title First Row',
      type: 'string',
      description: 'First line of the title (appears in black)',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'titleSecondRow',
      title: 'Title Second Row',
      type: 'string',
      description: 'Second line of the title (appears in blue)',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rating',
      title: 'Rating Section',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Rating Score',
          type: 'string',
          description: 'e.g., "4.92/5"',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'basedOnText',
          title: 'Based On Text',
          type: 'string',
          description: 'e.g., "based on"',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'reviewCount',
          title: 'Review Count',
          type: 'string',
          description: 'e.g., "480 reviews"',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titleFirstRow',
      subtitle: 'titleSecondRow',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle,
        media: selection.media,
      };
    },
  },
})

export default addCloneSupport(heroSchema)
