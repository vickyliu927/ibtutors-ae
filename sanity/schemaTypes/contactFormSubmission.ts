import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactFormSubmission',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The name of the person submitting the form',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
      description: 'The email address of the person submitting the form',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required(),
      description: 'The message submitted by the user',
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
      description: 'The date and time the form was submitted',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      date: 'createdAt',
    },
    prepare({ title, subtitle, date }) {
      return {
        title: title || 'No name',
        subtitle: `${subtitle || 'No email'} — ${date ? new Date(date).toLocaleString() : ''}`,
      }
    },
  },
}) 