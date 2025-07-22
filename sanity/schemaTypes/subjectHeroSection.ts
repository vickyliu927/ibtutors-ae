import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const subjectHeroSectionSchema = defineType({
  name: 'subjectHeroSection',
  title: 'Subject Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'subjectPage',
      title: 'Subject Page',
      type: 'reference',
      to: [{ type: 'subjectPage' }],
      description: 'Select which subject page this hero section is for. Leave empty for global/default hero content.',
      validation: Rule => Rule.custom((subjectPage, context) => {
        // Allow empty for global/default hero sections
        return true;
      }),
    }),
    defineField({
      name: 'isDefault',
      title: 'Use as Default/Fallback',
      type: 'boolean',
      description: 'If enabled, this hero section will be used as fallback when no subject-specific hero is found',
      initialValue: false,
    }),
    defineField({
      name: 'rating',
      title: 'Rating Section',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Rating Score',
          type: 'string',
          description: 'Rating score (e.g., "4.92/5")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'basedOnText',
          title: 'Based On Text',
          type: 'string',
          description: 'Text that appears after rating (e.g., "based on")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'reviewCount',
          title: 'Review Count',
          type: 'string',
          description: 'Number of reviews (e.g., "546 reviews")',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'object',
      fields: [
        {
          name: 'firstPart',
          title: 'First Part (Dark Text)',
          type: 'string',
          description: 'First part of title in dark color (e.g., "#1 Rated ")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'secondPart',
          title: 'Second Part (Blue Text)',
          type: 'string',
          description: 'Second part of title in blue color (e.g., "Online IB Tutors")',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle/Description',
      type: 'text',
      description: 'The descriptive text below the main title',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      titleFirstPart: 'title.firstPart',
      titleSecondPart: 'title.secondPart',
      subjectPage: 'subjectPage.subject',
      isDefault: 'isDefault',
    },
    prepare(selection) {
      const { titleFirstPart, titleSecondPart, subjectPage, isDefault } = selection;
      const titleText = `${titleFirstPart || ''}${titleSecondPart || ''}`;
      
      let subtitleText = 'Subject Hero Section';
      if (isDefault) {
        subtitleText = '🌐 Default/Fallback Hero';
      } else if (subjectPage) {
        subtitleText = `📚 ${subjectPage}`;
      } else {
        subtitleText = '❓ Unassigned Hero';
      }
      
      return {
        title: titleText || 'Subject Hero Section',
        subtitle: subtitleText,
      };
    },
  },
})

export default addCloneSupport(subjectHeroSectionSchema) 