import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const faqSectionSchema = defineType({
  name: 'faq_section',
  title: 'FAQ Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'The main title for the FAQ section (e.g., "Frequently Asked Questions")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      description: 'An optional subtitle or description for the FAQ section',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Subject Pages', value: 'subject' },
          { title: 'Curriculum Pages', value: 'curriculum' },
          { title: 'General/Shared', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'homepage',
      validation: (Rule: any) => Rule.required(),
      description: 'Which type of page this FAQ section is designed for',
    }),
    defineField({
      name: 'faqReferences',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      validation: (Rule: any) => Rule.required(),
      description: 'Select the FAQs to display in this section',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      pageType: 'pageType',
    },
    prepare({ title = '', subtitle = '', pageType = '' }: Record<string, string>) {
      const pageTypeLabels: Record<string, string> = {
        homepage: '🏠 Homepage',
        subject: '📚 Subject Pages',
        curriculum: '🎓 Curriculum Pages',
        general: '🌐 General/Shared',
      };

      const pageTypeLabel = pageTypeLabels[pageType] || '❓ Unknown';
      
      return {
        title: `${title}`,
        subtitle: `${pageTypeLabel}${subtitle ? ` • ${subtitle}` : ''}`,
      }
    },
  },
})

export default addCloneSupport(faqSectionSchema) 