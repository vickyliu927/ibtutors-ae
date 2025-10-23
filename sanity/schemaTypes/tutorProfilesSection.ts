import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const tutorProfilesSectionSchema = defineType({
  name: 'tutorProfilesSection',
  title: 'Tutor Profiles Section',
  type: 'document',
  fields: [
    defineField({
      name: 'trustedByText',
      title: 'Trusted By Text',
      type: 'string',
      description: 'Orange text shown above the main title (e.g., "Trusted by 15,000+ students across Dubai and globally.")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Main Section Title',
      type: 'string',
      description: 'Main title of the section (e.g., "Our Qualified Dubai Teachers and Examiners")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description text (e.g., "We have a team of expert online tutors at prices ranging from AED 140-390/hour.")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactText',
      title: 'Contact Text',
      type: 'text',
      description: 'Bold contact text (e.g., "Contact us with your requirements and budget and we\'ll find the perfect tutor for you!")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle (Legacy)',
      type: 'text',
      description: 'Legacy field for subtitle - consider using description and contactText instead',
    }),
    defineField({
      name: 'ctaRichText',
      title: 'Call-to-Action Rich Text',
      type: 'blockContent',
      description: 'Optional rich text CTA supporting inline links for multiple phrases. If set, it will be used instead of CTA Text/URL.',
    }),
    defineField({
      name: 'ctaText',
      title: 'Call-to-Action Text',
      type: 'string',
      description: 'Text that will be displayed as a link (e.g., "View all our Maths tutors on TutorChase, the world\'s top tutoring provider")',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call-to-Action Link URL',
      type: 'url',
      description: 'URL where the link text will direct to',
    }),
    defineField({
      name: 'tutorProfileSectionPriceDescription',
      title: 'Tutor Profile Section Price Description',
      type: 'string',
      description: 'Description text for the price section (e.g., "Rates Vary By Tutor Experience And Qualifications")',
    }),
    defineField({
      name: 'tutorProfileSectionPriceTag',
      title: 'Tutor Profile Section Price Tag',
      type: 'string',
      description: 'Price tag text (e.g., "From £59/hour")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
  },
})

export default addCloneSupport(tutorProfilesSectionSchema) 