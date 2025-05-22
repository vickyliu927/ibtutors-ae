import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'navbarSettings',
  title: 'Navbar Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Text to display on the main navbar button',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      validation: Rule => Rule.required(),
      description: 'URL the navbar button should link to',
    }),
    defineField({
      name: 'navigationButtons',
      title: 'Navigation Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'buttonType',
              title: 'Button Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Curriculum', value: 'curriculum' },
                  { title: 'Subject Dropdown', value: 'subjectDropdown' },
                ],
                layout: 'radio',
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'displayText',
              title: 'Display Text',
              type: 'string',
              description: 'Text to display on the button',
              validation: Rule => Rule.required(),
            },
            {
              name: 'curriculumSlug',
              title: 'Curriculum Slug',
              type: 'string',
              description: 'Slug of the curriculum (only for curriculum buttons)',
              hidden: ({ parent }) => parent?.buttonType !== 'curriculum',
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers will appear first',
              validation: Rule => Rule.required().min(1).precision(0),
            },
            {
              name: 'isActive',
              title: 'Is Active',
              type: 'boolean',
              description: 'Whether this button should be displayed',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'displayText',
              subtitle: 'buttonType',
              order: 'displayOrder',
              active: 'isActive',
            },
            prepare({ title, subtitle, order, active }) {
              return {
                title: title || 'Untitled Button',
                subtitle: `${subtitle === 'curriculum' ? 'Curriculum' : 'Subject Dropdown'} - Order: ${order} ${!active ? '(Inactive)' : ''}`,
              };
            },
          },
        },
      ],
      description: 'Customize and order navigation buttons',
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order (Legacy)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'itemType',
              title: 'Item Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Curriculum', value: 'curriculum' },
                  { title: 'Subject Dropdown', value: 'subjectDropdown' },
                  { title: 'Button', value: 'button' },
                ],
                layout: 'radio',
              },
              validation: Rule => Rule.required(),
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers will appear first',
              validation: Rule => Rule.required().min(1).precision(0),
            },
          ],
          preview: {
            select: {
              title: 'itemType',
              subtitle: 'displayOrder',
            },
            prepare({ title, subtitle }) {
              return {
                title: title === 'curriculum' ? 'Curriculum Pages' :
                       title === 'subjectDropdown' ? 'Subject Dropdown' : 'CTA Button',
                subtitle: `Display Order: ${subtitle}`,
              };
            },
          },
        },
      ],
      description: 'Legacy field - Please use Navigation Buttons instead',
    }),
  ],
}); 