import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subjectHeader',
  title: 'Subject Page Header',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Header Title',
      type: 'string',
      description: 'The main title for the subject page (e.g. "IB Maths Tutors")',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      description: 'A brief description or subtitle for the subject page',
      rows: 2,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Optional background image for the header section',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: 'Text to display on the CTA button',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button should link to',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'title',
    },
  },
}) 