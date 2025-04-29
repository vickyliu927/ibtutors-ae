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
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, date }) {
      return {
        title: title || 'No name',
        subtitle: `${subtitle || 'No email'} — ${date ? new Date(date).toLocaleString() : ''}`,
      }
    },
  },
}) 