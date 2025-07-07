import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const linkSettingsSchema = defineType({
  name: 'linkSettings',
  title: 'SEO Link Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A descriptive title for these link settings',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'defaultNofollow',
      title: 'Default Nofollow Setting',
      type: 'boolean',
      description: 'When enabled, external links will have rel="nofollow" by default',
      initialValue: false,
    }),
    defineField({
      name: 'nofollowDomains',
      title: 'Domains to Apply Nofollow',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Specific domains that should have nofollow applied (e.g., "tutorchase.com")',
    }),
    defineField({
      name: 'followDomains',
      title: 'Domains to Exclude from Nofollow',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Specific domains that should NOT have nofollow applied, even if defaultNofollow is true',
    }),
  ],
})

export default addCloneSupport(linkSettingsSchema) 