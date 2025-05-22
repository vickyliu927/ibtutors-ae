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
      name: 'navigationOrder',
      title: 'Navigation Order',
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
      description: 'Control the order of items in the navigation bar',
    }),
  ],
}); 