import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'SEO',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Title for your site, search engines and social media',
      validation: Rule => Rule.required().max(70)
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Describe your site for search engines and social media',
      validation: Rule => Rule.required().max(180)
    })
  ],
  preview: {
    select: {
      title: 'title',
    }
  }
}) 