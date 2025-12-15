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
      title: 'Navigation',
      description: 'Configure desktop navigation order. Leave empty to show only the homepage.',
      type: 'object',
      initialValue: {
        navOrder: [],
      },
      fields: [
        defineField({
          name: 'navOrder',
          title: 'Navigation Order',
          description: 'Drag to add/reorder: All Subjects, All Locations, selected Curriculum pages, and Blog. Leave empty to disable all and show only the homepage.',
          type: 'array',
          of: [
            defineField({
              type: 'object',
              name: 'navItem',
              title: 'Nav Item',
              fields: [
                defineField({
                  name: 'itemType',
                  title: 'Item Type',
                  type: 'string',
                  options: { list: [
                    { title: 'All Subjects', value: 'allSubjects' },
                    { title: 'All Locations', value: 'locations' },
                    { title: 'Curriculum', value: 'curriculum' },
                    { title: 'Blog', value: 'blog' },
                  ] },
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'curriculumTarget',
                  title: 'Curriculum Page',
                  type: 'reference',
                  to: [{ type: 'curriculumPage' }],
                  options: { disableNew: true },
                  hidden: ({ parent }) => parent?.itemType !== 'curriculum',
                  validation: Rule => Rule.custom((val, ctx) => (ctx.parent as any)?.itemType === 'curriculum' ? (val ? true : 'Select a curriculum page') : true)
                })
              ],
              preview: {
                select: { itemType: 'itemType', title: 'curriculumTarget.title' },
                prepare: (sel: any) => sel.itemType === 'curriculum' ? { title: sel.title || 'Curriculum' } : { title: sel.itemType }
              }
            })
          ],
        }),
      ],
    }),
    defineField({
      name: 'mobileMenu',
      title: 'Mobile Menu Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'mobileNavOrder',
          title: 'Mobile Navigation Order',
          description: 'Drag to reorder: All Subjects, All Locations, selected Curriculum pages, and Blog.',
          type: 'array',
          of: [
            defineField({
              type: 'object',
              name: 'mobileNavItem',
              title: 'Mobile Nav Item',
              fields: [
                defineField({
                  name: 'itemType',
                  title: 'Item Type',
                  type: 'string',
                  options: { list: [
                    { title: 'All Subjects', value: 'allSubjects' },
                    { title: 'All Locations', value: 'locations' },
                    { title: 'Curriculum', value: 'curriculum' },
                    { title: 'Blog', value: 'blog' },
                  ] },
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: 'curriculumTarget',
                  title: 'Curriculum Page',
                  type: 'reference',
                  to: [{ type: 'curriculumPage' }],
                  options: { disableNew: true },
                  hidden: ({ parent }) => parent?.itemType !== 'curriculum',
                  validation: Rule => Rule.custom((val, ctx) => (ctx.parent as any)?.itemType === 'curriculum' ? (val ? true : 'Select a curriculum page') : true)
                })
              ],
              preview: { select: { itemType: 'itemType', title: 'curriculumTarget.title' }, prepare: (sel: any) => sel.itemType === 'curriculum' ? { title: sel.title || 'Curriculum' } : { title: sel.itemType } }
            })
          ]
        }),
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
      // Optional: when empty, CTA button will be hidden in the navbar
      description: 'Optional URL for the CTA button. Leave empty to hide the button.',
      initialValue: undefined,
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