export default {
  name: 'faq_section',
  title: 'FAQ Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'FAQ',
    },
    {
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      description: 'Optional subtitle for the FAQ section',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
} 