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
      name: 'searchAliases',
      title: 'Search aliases (website names, keywords)',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Optional: add website names or extra keywords so this section can be found when searching by website name. Useful for GLOBAL sections.',
      options: {
        layout: 'tags',
      },
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
          { title: 'Location Pages', value: 'location' },
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
      name: 'locationPage',
      title: 'Location Page',
      type: 'reference',
      to: [{ type: 'locationPage' }],
      description: 'Select a specific location page this FAQ section is for. Leave empty for general location FAQs that apply to all locations.',
      hidden: ({ document }: any) => document?.pageType !== 'location',
      options: {
        filter: ({ document }: any) => {
          if (document?.cloneReference?._ref) {
            return {
              filter: 'cloneReference._ref == $cloneId || !defined(cloneReference)',
              params: { cloneId: document.cloneReference._ref }
            };
          }
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
  __experimental_search: [
    { path: 'title', weight: 10 },
    { path: 'subtitle', weight: 6 },
    { path: 'searchAliases', weight: 9 },
    // Allow searching by the website/clone name and id
    { path: 'cloneReference->cloneName', weight: 9 },
    { path: 'cloneReference->cloneId.current', weight: 5 },
    // Helpful contextual fields when searching inside relations
    { path: 'pageType', weight: 2 },
    { path: 'subjectPage->title', weight: 5 },
    { path: 'subjectPage->subject', weight: 5 },
    { path: 'locationPage->location', weight: 5 },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      pageType: 'pageType',
      // Keep simple paths (no '->') to avoid Studio key validation issues
      subjectPageTitle: 'subjectPage.title',
      subjectPageSubject: 'subjectPage.subject',
      locationPageLocation: 'locationPage.location',
    },
    prepare(selection: any) {
      const {
        title = '',
        subtitle = '',
        pageType = '',
        subjectPageTitle = '',
        subjectPageSubject = '',
        locationPageLocation = '',
      } = selection || {};
      const pageTypeLabels: Record<string, string> = {
        homepage: '🏠 Homepage',
        subject: '📚 Subject Pages',
        curriculum: '🎓 Curriculum Pages',
        location: '📍 Location Pages',
      };

      const pageTypeLabel = pageTypeLabels[pageType as string] || '❓ Unknown';
      const subjectOrLocation = subjectPageTitle || subjectPageSubject || locationPageLocation || '';
      const composedTitle = [title, subjectOrLocation].filter(Boolean).join(' — ');
      
      return {
        title: composedTitle,
        subtitle: `${pageTypeLabel}${subtitle ? ` • ${subtitle}` : ''}`,
      }
    },
  },
})

export default addCloneSupport(faqSectionSchema) 