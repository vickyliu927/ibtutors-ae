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
  ],
}); 