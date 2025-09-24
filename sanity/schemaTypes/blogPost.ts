import { defineField, defineType } from 'sanity'
import blockContent from './blockContent'
import { addCloneSupport, createCloneAwareSlugField } from '../lib/cloneSchemaHelpers'

const blogPost = defineType({
  name: 'blogPost',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'relations', title: 'Relations' },
    { name: 'sidebar', title: 'Sidebar' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    createCloneAwareSlugField({ source: 'title' }),
    defineField({
      name: 'featured',
      title: 'Featured article',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time',
      description: 'Estimated time to read the article (in minutes)',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'imageCaption',
      title: 'Caption',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Alternative text',
      type: 'string',
      description: 'Important for SEO and accessibility.',
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'blogAuthor' }],
      group: 'relations',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogCategory' }] }],
      group: 'relations',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      description: 'Short introductory text for cards and article page (required field).',
      type: 'text',
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: Rule => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'faqReferences',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'relations',
    }),
    // Additional description block (title + description)
    defineField({
      name: 'additionalDescriptionTitle',
      title: 'Additional description title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'additionalDescription',
      title: 'Additional description',
      type: 'text',
      group: 'content',
    }),
    // Tutor card block
    defineField({
      name: 'tutorCard',
      title: 'Tutor card',
      type: 'object',
      group: 'relations',
      fields: [
        defineField({
          name: 'tutor',
          title: 'Tutor',
          type: 'reference',
          to: [{ type: 'tutor' }],
        }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      group: 'relations',
    }),
    defineField({
      name: 'tutorAdvertBlock',
      title: 'Tutor advert block',
      type: 'object',
      group: 'sidebar',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
        defineField({ name: 'buttonText', title: 'Button text', type: 'string' }),
        defineField({ name: 'buttonLink', title: 'Button link', type: 'url' }),
        defineField({
          name: 'tutors',
          title: 'Tutors List',
          description: 'Select up to 3 tutors to display in the list',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'tutor' }] }],
          validation: Rule => Rule.max(3),
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: 'resourceLinks',
      title: 'List of Links with resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: Rule => Rule.required() }),
          ],
        },
      ],
      group: 'sidebar',
    }),
    defineField({
      name: 'sidebarLinks',
      title: 'Sidebar links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: Rule => Rule.required() }),
          ],
        },
      ],
      group: 'sidebar',
    }),
    // SEO fields
    defineField({
      name: 'pageTitle',
      title: 'Page title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'pageDescription',
      title: 'Description',
      type: 'text',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'author.name',
    },
  },
})

export default addCloneSupport(blogPost)


