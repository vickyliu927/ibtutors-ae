import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trustedInstitutionsBanner',
  title: 'Trusted Institutions Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'Main title text for the banner (e.g., "TUTORS FROM AND STUDENTS ACCEPTED INTO")',
    }),
    defineField({
      name: 'subtitle',
      title: 'Banner Subtitle',
      type: 'string',
      description: 'Subtitle text for the banner (e.g., "THE WORLD\'S TOP UNIVERSITIES")',
    }),
    defineField({
      name: 'institutions',
      title: 'Institution Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Institution Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'logo',
              title: 'Institution Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Controls the display order of institutions (lower numbers appear first)',
              validation: (Rule: any) => Rule.precision(0).positive(),
              initialValue: 100,
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Background color of the banner (default: light gray)',
      initialValue: '#f8f9fa',
    }),
    defineField({
      name: 'carouselSpeed',
      title: 'Carousel Speed',
      type: 'number',
      description: 'Speed of the logo carousel in seconds (e.g., 5 for 5 seconds per slide)',
      validation: (Rule: any) => Rule.precision(1).positive(),
      initialValue: 5,
    }),
    defineField({
      name: 'enabled',
      title: 'Enable Banner',
      type: 'boolean',
      description: 'Enable or disable the banner',
      initialValue: true,
    }),
  ],
}); 