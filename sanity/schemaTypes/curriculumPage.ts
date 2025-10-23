import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const curriculumPageSchema = defineType({
  name: 'curriculumPage',
  title: 'Curriculum Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'curriculum',
      title: 'Curriculum',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Navigation Display Order',
      type: 'number',
      description: 'Controls the order in which this curriculum appears in navigation menus and the homepage grid (lower numbers appear first)',
      validation: Rule => Rule.required().precision(0).positive(),
      initialValue: 100,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: Rule => Rule.custom((slug, context) => {
        // Require slug only when external redirect is NOT enabled
        const redirectOn = Boolean((context as any)?.document?.externalRedirectEnabled);
        if (redirectOn) return true;
        return slug && slug.current ? true : 'Slug is required unless external redirect is enabled';
      }),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'externalRedirectEnabled',
      title: 'Enable External Redirect',
      type: 'boolean',
      description: 'If enabled, visiting this curriculum page will redirect to the URL below instead of rendering content.',
      initialValue: false,
    }),
    defineField({
      name: 'externalRedirectUrl',
      title: 'External Redirect URL',
      type: 'url',
      description: 'Destination to redirect visitors to when redirect is enabled',
      hidden: ({ parent }) => !parent?.externalRedirectEnabled,
      validation: Rule => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }).error('Valid URL required when redirect is enabled'),
    }),
    defineField({
      name: 'externalRedirectPermanent',
      title: 'Permanent Redirect (308)',
      type: 'boolean',
      description: 'If checked, use a permanent redirect (308). Otherwise a temporary redirect (307) is used.',
      hidden: ({ parent }) => !parent?.externalRedirectEnabled,
      initialValue: false,
    }),
    defineField({
      name: 'firstSection',
      title: 'First section on tutors page',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.custom((value, context) => {
            const redirectOn = Boolean((context as any)?.document?.externalRedirectEnabled);
            if (redirectOn) return true; // optional when redirecting externally
            return value ? true : 'Title is required unless external redirect is enabled';
          }),
        },
        {
          name: 'highlightedWords',
          title: 'Words to Highlight',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Words in the title that should be highlighted in blue (e.g., "IB", "English")',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.custom((value, context) => {
            const redirectOn = Boolean((context as any)?.document?.externalRedirectEnabled);
            if (redirectOn) return true; // optional when redirecting externally
            return value ? true : 'Description is required unless external redirect is enabled';
          }),
        },
      ],
    }),
    defineField({
      name: 'tutorsListSectionHead',
      title: 'Tutors list section head',
      type: 'object',
      fields: [
        {
          name: 'smallTextBeforeTitle',
          title: 'Small text before title',
          type: 'string',
        },
        {
          name: 'sectionTitle',
          title: 'Section title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        defineField({
          name: 'ctaRichText',
          title: 'Call-to-Action Rich Text',
          description: 'Optional rich text CTA supporting inline links for multiple phrases. If set, it will be used instead of CTA Text/URL.',
          type: 'blockContent',
        }),
        {
          name: 'ctaLinkText',
          title: 'Call-to-Action Link Text',
          type: 'string',
          description: 'Text that will be displayed as a link (e.g., "View all our IB Maths tutors on TutorChase, the world\'s #1 IB tutoring provider")',
        },
        {
          name: 'ctaLink',
          title: 'Call-to-Action Link URL',
          type: 'url',
          description: 'URL where the link text will direct to',
        },
        {
          name: 'tutorProfileSectionPriceDescription',
          title: 'Tutor Profile Section Price Description',
          type: 'string',
          description: 'Description text for the price section (e.g., "Rates Vary By Tutor Experience And Qualifications")',
        },
        {
          name: 'tutorProfileSectionPriceTag',
          title: 'Tutor Profile Section Price Tag',
          type: 'string',
          description: 'Price tag text (e.g., "From £59/hour")',
        },
      ],
    }),
    defineField({
      name: 'tutorsList',
      title: 'List of tutors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tutor' }] }],
    }),

    defineField({
      name: 'subjectPages',
      title: 'Subject Pages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'subjectPage' }] }],
      description: 'Add curriculum-specific subject pages (e.g., IB Maths, IB English) to show under this curriculum in the navbar.',
    }),
    defineField({
      name: 'testimonials',
      title: 'Curriculum Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Select testimonials specific to this curriculum',
    }),
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'reference',
      to: [{ type: 'faq_section' }],
      description: 'Optional: Add a FAQ section to this curriculum page',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'pageTitle',
          title: 'Page title',
          type: 'string',
          validation: Rule => Rule.required(),
          description: 'Title for your site, search engines and social media',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required(),
          description: 'Describe your site for search engines and social media',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'curriculum',
      subtitle: 'title',
    },
  },
})

export default addCloneSupport(curriculumPageSchema) 