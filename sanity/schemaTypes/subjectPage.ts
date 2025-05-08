import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subjectPage',
  title: 'Subject Pages',
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
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: Rule => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
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
          validation: Rule => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required(),
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
      ],
    }),
    defineField({
      name: 'tutorsList',
      title: 'List of tutors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tutor' }] }],
    }),
    defineField({
      name: 'testimonials',
      title: 'Subject Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Select testimonials specific to this subject',
    }),
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'reference',
      to: [{ type: 'faq_section' }],
      description: 'Optional: Add a FAQ section to this subject page',
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
      title: 'subject',
      subtitle: 'title',
    },
  },
}) 