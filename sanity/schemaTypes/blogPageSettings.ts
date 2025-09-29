import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const blogPageSettings = defineType({
  name: 'blogPageSettings',
  title: 'Blog Page Settings',
  type: 'document',
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', validation: Rule => Rule.required().max(70) }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', validation: Rule => Rule.required().max(180) }),
  ],
  preview: {
    select: { title: 'seoTitle' },
    prepare: ({ title }) => ({ title: title || 'Blog Page Settings' })
  }
})

export default addCloneSupport(blogPageSettings)


