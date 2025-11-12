import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactFormSubmission',
  title: 'Contact Form Submissions',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sourceDomain',
      title: 'Source Domain',
      type: 'string',
      description: 'The domain/website where this contact form was submitted from',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sourceWebsite',
      title: 'Source Website',
      type: 'string',
      description: 'Friendly name of the website (e.g., "Dubai Tutors", "Abu Dhabi Tutors")',
    }),
    defineField({
      name: 'sourcePath',
      title: 'Source Path',
      type: 'string',
      description: 'The path/slug from which the form was submitted (e.g., /maths)',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Full URL of the page (e.g., https://tutorchase.com/maths)',
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      email: 'email',
      date: 'submittedAt',
      sourceDomain: 'sourceDomain',
      sourceWebsite: 'sourceWebsite',
    },
    prepare({ title, email, date, sourceDomain, sourceWebsite }) {
      const websiteDisplay = sourceWebsite || sourceDomain || 'Unknown Source';
      const dateDisplay = date ? new Date(date).toLocaleString() : '';
      
      return {
        title: title || 'No name',
        subtitle: `${email || 'No email'} • ${websiteDisplay} • ${dateDisplay}`,
      }
    },
  },
}) 