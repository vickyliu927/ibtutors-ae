import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'advertBlockSection',
  title: 'Advert Block Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      description: 'The main headline of the advert block',
      initialValue: 'Voted #1 for IB',
      validation: (Rule) => Rule.required().max(60).warning('Keep title under 60 characters for best display'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'The subtitle that appears below the main title',
      initialValue: 'by 10,000+ students',
      validation: (Rule) => Rule.required().max(80).warning('Keep subtitle under 80 characters for best display'),
    }),
    defineField({
      name: 'description',
      title: 'Description Text',
      type: 'text',
      description: 'The main description text before the highlighted platform name',
      initialValue: 'We\'re trusted by hundreds of IB schools globally. All tutoring includes FREE access to our',
      validation: (Rule) => Rule.required().max(200).warning('Keep description under 200 characters for readability'),
    }),
    defineField({
      name: 'highlightText',
      title: 'Highlighted Platform Name',
      type: 'string',
      description: 'The text that will be underlined (usually the platform name)',
      initialValue: 'IB Resources Platform',
      validation: (Rule) => Rule.required().max(50).warning('Keep platform name under 50 characters'),
    }),
    defineField({
      name: 'highlightLink',
      title: 'Highlighted Platform URL',
      type: 'url',
      description: 'Optional link to open when the highlighted platform name is clicked',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'pricingText',
      title: 'Pricing Text',
      type: 'string',
      description: 'The pricing information that appears after the highlighted text',
      initialValue: '- normally £29/month!',
      validation: (Rule) => Rule.required().max(50).warning('Keep pricing text under 50 characters'),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Background color of the advert block (hex code)',
      initialValue: '#001A96',
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false
      }).error('Must be a valid hex color code (e.g., #001A96)'),
    }),
    defineField({
      name: 'enabled',
      title: 'Show Advert Block',
      type: 'boolean',
      description: 'Toggle to show or hide the advert block section',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this section appears (lower numbers appear first)',
      initialValue: 5,
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Reference',
      type: 'reference',
      description: 'Reference to a specific clone (leave empty for global/baseline content)',
      to: [{ type: 'clone' }],
      validation: (Rule) => Rule.custom((value, context) => {
        // Allow empty for baseline content
        return true;
      }),
    }),
    defineField({
      name: 'customizations',
      title: 'Clone-Specific Customizations',
      type: 'object',
      description: 'Override specific fields for this clone',
      fields: [
        defineField({
          name: 'title',
          title: 'Custom Title',
          type: 'string',
          description: 'Override the main title for this clone',
        }),
        defineField({
          name: 'subtitle',
          title: 'Custom Subtitle',
          type: 'string',
          description: 'Override the subtitle for this clone',
        }),
        defineField({
          name: 'description',
          title: 'Custom Description',
          type: 'text',
          description: 'Override the description for this clone',
        }),
        defineField({
          name: 'highlightText',
          title: 'Custom Highlight Text',
          type: 'string',
          description: 'Override the highlighted text for this clone',
        }),
        defineField({
          name: 'pricingText',
          title: 'Custom Pricing Text',
          type: 'string',
          description: 'Override the pricing text for this clone',
        }),
        defineField({
          name: 'backgroundColor',
          title: 'Custom Background Color',
          type: 'string',
          description: 'Override the background color for this clone',
          validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
            name: 'hex color',
            invert: false
          }).error('Must be a valid hex color code (e.g., #001A96)'),
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this advert block configuration is currently active',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      enabled: 'enabled',
      clone: 'cloneReference.cloneName',
      displayOrder: 'displayOrder',
    },
    prepare(selection) {
      const { title, subtitle, enabled, clone, displayOrder } = selection;
      const cloneText = clone ? ` (${clone})` : ' (Global)';
      const statusText = enabled ? '✅' : '❌';
      
      return {
        title: `${statusText} ${title}${cloneText}`,
        subtitle: `${subtitle} | Order: ${displayOrder}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Clone Reference',
      name: 'cloneReference',
      by: [{ field: 'cloneReference.cloneName', direction: 'asc' }],
    },
  ],
}); 