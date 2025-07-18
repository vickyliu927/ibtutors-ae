import { defineType, defineField } from 'sanity';
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const navbarSettingsSchema = defineType({
  name: 'navbarSettings',
  title: 'Navbar Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Company logo image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'logoLink',
      title: 'Logo Link',
      type: 'string',
      description: 'URL when logo is clicked',
      initialValue: '/',
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
      title: 'buttonText',
      media: 'logo',
    },
    prepare(selection: any) {
      const { title } = selection;
      return {
        title: 'Navbar Settings',
        subtitle: `CTA: ${title || 'Not set'}`,
        media: selection.media,
      };
    },
  },
})

export default addCloneSupport(navbarSettingsSchema) 