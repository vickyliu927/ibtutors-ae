import { defineField, defineType } from 'sanity'

export default defineType({
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