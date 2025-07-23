import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const contactFormContentSchema = defineType({
  name: 'contactFormContent',
  title: 'Contact Form Content',
  type: 'document',
  fields: [
    // Main Form Section
    defineField({
      name: 'formHeader',
      title: 'Form Header',
      type: 'string',
      description: 'Main headline above the contact form',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'formSubtitle',
      title: 'Form Subtitle',
      type: 'text',
      description: 'Subtitle text below the main headline',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'Company name mentioned in the subtitle (e.g., TutorChase)',
      validation: (Rule: any) => Rule.required(),
    }),

    // Form Fields
    defineField({
      name: 'formFields',
      title: 'Form Fields',
      type: 'object',
      fields: [
        {
          name: 'fullNameLabel',
          title: 'Full Name Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'fullNamePlaceholder',
          title: 'Full Name Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'countryLabel',
          title: 'Country Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'countryPlaceholder',
          title: 'Country Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'phoneLabel',
          title: 'Phone Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'phonePlaceholder',
          title: 'Phone Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'emailLabel',
          title: 'Email Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'emailPlaceholder',
          title: 'Email Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'detailsLabel',
          title: 'Details Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'detailsPlaceholder',
          title: 'Details Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'budgetLabel',
          title: 'Budget Label',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'budgetPlaceholder',
          title: 'Budget Placeholder',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),

    // Form Buttons
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'submittingText',
      title: 'Submitting Text',
      type: 'string',
      description: 'Text shown while form is being submitted',
      validation: (Rule: any) => Rule.required(),
    }),

    // Success Modal Section
    defineField({
      name: 'successModal',
      title: 'Success Modal',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Success Title',
          type: 'text',
          description: 'Main success message (use \n for line breaks)',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Success Description',
          type: 'text',
          description: 'Description text in the success modal',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'primaryButtonLink',
          title: 'Primary Button Link',
          type: 'string',
          description: 'URL for the primary button',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button Link',
          type: 'string',
          description: 'URL for the secondary button',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'footerText',
          title: 'Footer Text',
          type: 'text',
          description: 'Additional instructions at the bottom of the modal',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),

    // Error Messages
    defineField({
      name: 'errorMessages',
      title: 'Error Messages',
      type: 'object',
      fields: [
        {
          name: 'genericError',
          title: 'Generic Error Message',
          type: 'string',
          description: 'Default error message for submission failures',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'validationError',
          title: 'Validation Error Message',
          type: 'string',
          description: 'Message shown when form has validation errors',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'formHeader',
      subtitle: 'formSubtitle',
    },
    prepare(selection: any) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Contact Form Content',
        subtitle: subtitle || 'No subtitle set',
      };
    },
  },
})

export default addCloneSupport(contactFormContentSchema) 