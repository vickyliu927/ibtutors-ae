import { defineField, defineType } from 'sanity'
import { addCloneSupport } from '../lib/cloneSchemaHelpers'

const subjectGridSectionSchema = defineType({
  name: 'subjectGridSection',
  title: 'Subject Grid Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the subject grid section',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'Popular IB Subjects',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      description: 'Description text for the subject grid section',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'Our team of specialist tutors are here to help you excel all areas. Take a closer look at our expert tutors for each A-Level subject.',
    }),
    defineField({
      name: 'splitDescription',
      title: 'Split Description into Two Rows',
      type: 'boolean',
      description: 'When enabled, description will be displayed in two rows instead of one continuous line',
      initialValue: false,
    }),
    defineField({
      name: 'subjects',
      title: 'Subjects List',
      type: 'array',
      description: 'List of subjects to display in the grid',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Subject Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'slug',
              title: 'Subject Slug',
              type: 'string',
              description: 'URL slug for the subject page (e.g., "maths", "biology")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Controls the order of subjects in the grid (lower numbers appear first)',
              validation: (Rule: any) => Rule.precision(0).positive(),
              initialValue: 100,
            },
            {
              name: 'enabled',
              title: 'Enable Subject',
              type: 'boolean',
              description: 'Whether this subject should be displayed in the grid',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'slug',
              order: 'displayOrder',
            },
            prepare(selection: any) {
              const { title, subtitle, order } = selection;
              return {
                title: title,
                subtitle: `/${subtitle} (Order: ${order})`,
              };
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Background color of the section container',
      initialValue: '#F4F6F9',
    }),
    defineField({
      name: 'enabled',
      title: 'Enable Section',
      type: 'boolean',
      description: 'Enable or disable the entire subject grid section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subjectCount: 'subjects',
    },
    prepare(selection: any) {
      const { title, subjectCount } = selection;
      const count = Array.isArray(subjectCount) ? subjectCount.length : 0;
      return {
        title: title || 'Subject Grid Section',
        subtitle: `${count} subjects`,
      };
    },
  },
})

export default addCloneSupport(subjectGridSectionSchema) 