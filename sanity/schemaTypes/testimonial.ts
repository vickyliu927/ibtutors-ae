import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'reviewerName',
      title: 'Reviewer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Name of the person giving the testimonial (e.g., "Aamina")',
    }),
    defineField({
      name: 'reviewerType',
      title: 'Reviewer Type',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Role of the reviewer (e.g., "Parent of an IB History Student")',
    }),
    defineField({
      name: 'testimonialText',
      title: 'Testimonial Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        }
      ],
      validation: (Rule: any) => Rule.required(),
      description: 'The actual review text - you can bold important words',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
      description: 'Rating given by the reviewer (1-5)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().min(1),
      description: 'The order in which this testimonial should appear (1 being first)',
    }),
  ],
  preview: {
    select: {
      title: 'reviewerName',
      subtitle: 'reviewerType',
      rating: 'rating',
    },
    prepare({ title, subtitle, rating }) {
      return {
        title: `${title} (${rating}⭐)`,
        subtitle,
      }
    },
  },
})

export default addCloneSupport(testimonialSchema) 