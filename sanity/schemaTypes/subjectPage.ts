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
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
  
    }),
    defineField({
      name: 'navigationMenu',
      title: 'Navigation Menu',
      type: 'reference',
      to: [{ type: 'navigationMenu' }],
      
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero', // Reuse your existing hero schema
   
    }),
    defineField({
      name: 'tutorProfiles',
      title: 'Tutor Profiles',
      type: 'array',
      of: [{ type: 'tutor' }], // Reuse your existing tutor schema
    
    }),
    defineField({
      name: 'testimonialSection',
      title: 'Testimonial Section',
      type: 'testimonial_section', // Reuse your existing testimonial section schema
    
    }),
    defineField({
      name: 'contactForm',
      title: 'Contact Form',
      type: 'reference',
      to: [{ type: 'contactFormSubmission' }],
 
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'reference',
      to: [{ type: 'footerSection' }],
 
    }),
  ],
})
