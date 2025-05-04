import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tutor',
  title: 'Tutors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'professionalTitle',
      title: 'Professional Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'e.g., "Professional IB Tutor", "IB Mathematics Tutor"',
    }),
    defineField({
      name: 'personallyInterviewed',
      title: 'Personally Interviewed',
      type: 'boolean',
      description: 'Show "Personally Interviewed" badge if checked',
      initialValue: false,
    }),
    defineField({
      name: 'education',
      title: 'University/Education',
      type: 'object',
      fields: [
        {
          name: 'university',
          title: 'University',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'degree',
          title: 'Degree',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        }
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
      description: 'Detailed description of teaching experience and approach',
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'specialization',
      title: 'Specialization/Subject Area',
      type: 'object',
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'mainSubject',
          title: 'Main Subject',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
          options: {
            list: [
              'IB Mathematics',
              'IB Physics',
              'IB Chemistry',
              'IB Biology',
              'IB English',
              'IB Economics',
              'IB Computer Science',
              'IB Business Management',
              'IB Psychology',
            ],
          },
        },
        {
          name: 'additionalSubjects',
          title: 'Additional Subjects',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              'IB Mathematics',
              'IB Physics',
              'IB Chemistry',
              'IB Biology',
              'IB English',
              'IB Economics',
              'IB Computer Science',
              'IB Business Management',
              'IB Psychology',
            ],
          },
        }
      ],
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    }),
    defineField({
      name: 'hireButtonLink',
      title: 'Hire Button Link',
      type: 'url',
      description: 'Link for the "Hire a Tutor" button',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Hourly Rate',
      type: 'object',
      description: 'Optional hourly rate information',
      fields: [
        {
          name: 'amount',
          title: 'Amount',
          type: 'number',
          description: 'The hourly rate amount',
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          description: 'The currency of the hourly rate',
          options: {
            list: [
              { title: 'AED (UAE Dirham)', value: 'AED' },
              { title: 'USD (US Dollar)', value: 'USD' },
              { title: 'GBP (British Pound)', value: 'GBP' },
              { title: 'EUR (Euro)', value: 'EUR' },
            ],
          },
        },
        {
          name: 'displayText',
          title: 'Display Text',
          type: 'string',
          description: 'Custom text to display for the price (e.g., "Starting from AED 200/hour")',
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'professionalTitle',
      media: 'profilePhoto',
    },
  },
}) 