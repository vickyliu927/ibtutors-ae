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
      name: 'subjectPage',
      title: 'Subject Page',
      type: 'reference',
      to: [{ type: 'subjectPage' }],
      description: 'Select a specific subject page this FAQ section is for. Leave empty for general subject FAQs that apply to all subjects.',
      hidden: ({ document }: any) => document?.pageType !== 'subject',
      options: {
        filter: ({ document }: any) => {
          // If this FAQ section has a clone reference, filter subject pages by the same clone
          if (document?.cloneReference?._ref) {
            return {
              filter: 'cloneReference._ref == $cloneId || !defined(cloneReference)',
              params: { cloneId: document.cloneReference._ref }
            };
          }
          // Otherwise show all subject pages
          return {};
        },
      },
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
      subjectPageTitle: 'subjectPage.title',
      subjectPageSubject: 'subjectPage.subject',
    },
    prepare({ title = '', subtitle = '', pageType = '', subjectPageTitle = '', subjectPageSubject = '' }: Record<string, string>) {
      const pageTypeLabels: Record<string, string> = {
        homepage: '🏠 Homepage',
        subject: '📚 Subject Pages',
        curriculum: '🎓 Curriculum Pages',
        general: '🌐 General/Shared',
      };

      const pageTypeLabel = pageTypeLabels[pageType] || '❓ Unknown';
      const subjectLabel = subjectPageTitle ? ` → ${subjectPageTitle}` : (subjectPageSubject ? ` → ${subjectPageSubject}` : '');
      
      return {
        title: `${title}`,
        subtitle: `${pageTypeLabel}${subjectLabel}${subtitle ? ` • ${subtitle}` : ''}`,
      }
    },
  },
})

export default addCloneSupport(faqSectionSchema) 