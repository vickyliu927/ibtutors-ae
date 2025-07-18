import { defineType, defineField } from 'sanity';
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const navbarSettingsSchema = defineType({
  name: 'navbarSettings',
  title: 'Navbar Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo Section',
      type: 'object',
      fields: [
        {
          name: 'logoText',
          title: 'Logo Text Image',
          type: 'image',
          description: 'Main logo text image',
          validation: Rule => Rule.required(),
        },
        {
          name: 'logoIcon',
          title: 'Logo Icon Image',
          type: 'image',
          description: 'Logo icon image',
          validation: Rule => Rule.required(),
        },
        {
          name: 'brandText',
          title: 'Brand Text',
          type: 'string',
          description: 'Text below the logo (e.g., "Dubai Tutors")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'logoLink',
          title: 'Logo Link',
          type: 'string',
          description: 'URL when logo is clicked',
          initialValue: '/',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Labels',
      type: 'object',
      fields: [
        {
          name: 'levelsText',
          title: 'Levels Dropdown Text',
          type: 'string',
          description: 'Text for the levels dropdown (e.g., "All Levels")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'subjectsText',
          title: 'Subjects Dropdown Text',
          type: 'string',
          description: 'Text for the subjects dropdown (e.g., "All Subjects")',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'CTA Button Text',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Text to display on the main CTA button',
    }),
    defineField({
      name: 'buttonLink',
      title: 'CTA Button Link',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'URL the CTA button should link to',
      initialValue: '#contact-form',
    }),

  ],
  preview: {
    select: {
      title: 'logo.brandText',
      subtitle: 'buttonText',
    },
    prepare(selection: any) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Navbar Settings',
        subtitle: `CTA: ${subtitle || 'Not set'}`,
      };
    },
  },
})

export default addCloneSupport(navbarSettingsSchema) 