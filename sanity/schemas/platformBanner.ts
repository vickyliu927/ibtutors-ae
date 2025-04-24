import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'platform_banner',
  title: 'Platform_Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'platformImage',
      title: 'Platform Interface Image',
      type: 'image',
      description: 'The main platform interface image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'whiteBoardImage',
      title: 'Whiteboard Example Image',
      type: 'image',
      description: 'Example image showing the whiteboard feature',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      media: 'platformImage',
    },
    prepare({ media }) {
      return {
        title: 'Platform_Banner',
        media,
      }
    },
  },
}) 