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
            defineField({
              name: 'navOrder',
              title: 'Desktop Navigation Order',
              description: 'Drag to reorder items (left to right order before the CTA).',
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mobileMenu',
      title: 'Mobile Menu Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'mobileNavOrder',
          title: 'Mobile Navigation Order',
          description: 'Drag to reorder items in the mobile menu.',
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