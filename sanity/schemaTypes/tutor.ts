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
      name: 'displayOnHomepage',
      title: 'Display on Homepage',
      type: 'boolean',
      description: 'Show this tutor on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'displayOnSubjectPages',
      title: 'Display on Subject Pages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'subjectPage' }] }],
      description: 'Select which subject pages this tutor should appear on',
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
      description: 'Link for the "Hire a Tutor" button. For subject pages, use /{slug}#contact-form format (e.g., "/online-dubai-english-tutor#contact-form"). For homepage, use "/#contact-form"',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'profilePDF',
      title: 'Profile PDF',
      type: 'file',
      description: 'PDF file that will be available through the "View Profile" button',
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
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Tutor rating (e.g., 4.8)',
      validation: (Rule: any) => Rule.min(0).max(5).precision(1),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
      description: 'Total number of reviews received',
      validation: (Rule: any) => Rule.min(0).precision(0),
    }),
    defineField({
      name: 'activeStudents',
      title: 'Active Students',
      type: 'number',
      description: 'Number of current active students',
      validation: (Rule: any) => Rule.min(0).precision(0),
    }),
    defineField({
      name: 'totalLessons',
      title: 'Total Lessons',
      type: 'number',
      description: 'Total number of lessons conducted',
      validation: (Rule: any) => Rule.min(0).precision(0),
    }),
    defineField({
      name: 'languagesSpoken',
      title: 'Languages Spoken',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string',
            },
            {
              name: 'proficiency',
              title: 'Proficiency',
              type: 'string',
              options: {
                list: [
                  'Native',
                  'Fluent',
                  'Advanced',
                  'Intermediate',
                  'Basic'
                ]
              }
            }
          ],
          preview: {
            select: {
              language: 'language',
              proficiency: 'proficiency',
            },
            prepare({ language, proficiency }) {
              return {
                title: `${language} (${proficiency})`,
              }
            }
          }
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