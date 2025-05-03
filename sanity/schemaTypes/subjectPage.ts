import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'subjectPage',
  title: 'Subject Page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero', // Reuse your existing hero schema
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tutorProfiles',
      title: 'Tutor Profiles',
      type: 'array',
      of: [{ type: 'tutor' }], // Reuse your existing tutor schema
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'testimonialSection',
      title: 'Testimonial Section',
      type: 'testimonial_section', // Reuse your existing testimonial section schema
      validation: Rule => Rule.required(),
    }),
  ],
})
