import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'platformBanner',
  title: 'Platform Banner',
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
    defineField({
      name: 'documentSharingImage',
      title: 'Document Sharing Example Image',
      type: 'image',
      description: 'Example image showing document sharing feature',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'platformImage',
      media: 'platformImage',
    },
    prepare({ title, media }) {
      return {
        title: 'Platform Banner',
        media,
      }
    },
  },
}) 