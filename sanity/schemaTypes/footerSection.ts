import { defineType, defineField } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const footerSectionSchema = defineType({
  name: 'footerSection',
  title: 'Footer Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'phoneLink',
      title: 'Phone Link',
      type: 'url',
      description: 'Link to call the phone number (e.g. tel:+441865306636)',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'whatsappLink',
      title: 'WhatsApp Link',
      type: 'url',
      description: 'Link to WhatsApp chat (e.g. https://wa.me/441865306636)',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'addressLink',
      title: 'Address Link',
      type: 'url',
      description: 'Link to map or location (e.g. Google Maps URL)',
    }),
    defineField({
      name: 'tutorchaseLink',
      title: 'TutorChase Link',
      type: 'url',
      description: 'Optional link for the title (e.g. https://tutorchase.com)',
    }),
  ],
})

export default addCloneSupport(footerSectionSchema) 