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
            {
              name: 'allLevelsPageLink',
              title: 'All Levels Page Link',
              type: 'string',
              description: 'URL for the "All Levels" overview page',
              initialValue: '/levels',
            },
            {
              name: 'allSubjectsPageLink', 
              title: 'All Subjects Page Link',
              type: 'string',
              description: 'URL for the "All Subjects" overview page',
              initialValue: '/subjects',
            },
            defineField({
              name: 'subjectsMenuGroups',
              title: 'Subjects Menu Groups',
              description: 'Organize the All Subjects dropdown into groups. Each group can contain selected subject pages.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'subjectsMenuGroup',
                  title: 'Subjects Group',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Group Title',
                      type: 'string',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'linkTarget',
                      title: 'Group Link Target',
                      description: 'Optional. Where to navigate when clicking the group name (subject or curriculum page).',
                      type: 'reference',
                      to: [{ type: 'subjectPage' }, { type: 'curriculumPage' }],
                      options: { disableNew: true },
                    }),
                    defineField({
                      name: 'items',
                      title: 'Subject Pages',
                      type: 'array',
                      of: [
                        { type: 'reference', to: [{ type: 'subjectPage' }] }
                      ],
                      description: 'Select which subject pages appear under this group (drag to reorder).',
                    })
                  ]
                }
              ]
            }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mobileMenu',
      title: 'Mobile Menu Settings',
      type: 'object',
      fields: [
        {
          name: 'closeButtonColor',
          title: 'Close Button Color',
          type: 'string',
          description: 'Color for the close button in mobile menu',
          initialValue: '#000000',
        },
        {
          name: 'dropdownArrowColor',
          title: 'Dropdown Arrow Color',
          type: 'string',
          description: 'Color for dropdown arrows in mobile menu',
          initialValue: '#001A96',
        },
        {
          name: 'borderColor',
          title: 'Border Color',
          type: 'string', 
          description: 'Color for borders in mobile menu',
          initialValue: '#F7F7FC',
        },
      ],
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