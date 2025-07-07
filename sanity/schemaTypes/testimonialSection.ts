import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const testimonialSectionSchema = defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'document',
  fields: [
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(5),
      description: 'The overall rating (e.g., 4.92)',
    }),
    defineField({
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().min(0),
      description: 'The total number of reviews (e.g., 480)',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'The text below the rating (e.g., "We\'re part of TutorChase, the world\'s #1 IB tutoring provider")',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'tutorChaseLink',
      title: 'TutorChase Link',
      type: 'url',
      description: 'The URL that "TutorChase" text links to',
    }),
    defineField({
      name: 'selectedTestimonials',
      title: 'Selected Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      description: 'Choose specific testimonials to display on the homepage (max 6)',
    }),
    defineField({
      name: 'maxDisplayCount',
      title: 'Maximum Testimonials to Display',
      type: 'number',
      validation: (Rule: any) => Rule.required().integer().min(1).max(6),
      initialValue: 3,
      description: 'Maximum number of testimonials to display (between 1-6)',
    }),
  ],
  preview: {
    select: {
      rating: 'rating',
      reviews: 'totalReviews',
    },
    prepare({ rating, reviews }) {
      return {
        title: `Testimonial Section (${rating}/5 - ${reviews} reviews)`,
      }
    },
  },
})

export default addCloneSupport(testimonialSectionSchema) 