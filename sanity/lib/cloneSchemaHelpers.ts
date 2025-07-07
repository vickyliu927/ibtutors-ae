import { defineField } from 'sanity'

/**
 * Standard clone support fields to be added to all content schemas
 * These fields enable content to be clone-specific, baseline, or global
 */
export const cloneSupportFields = [
  defineField({
    name: 'cloneReference',
    title: 'Clone Reference',
    type: 'reference',
    to: [{ type: 'clone' }],
    description: 'Link this content to a specific website clone. Leave empty for global content.',
    options: {
      filter: 'isActive == true',
    },

  }),
  defineField({
    name: 'isActive',
    title: 'Active',
    type: 'boolean',
    description: 'Whether this content is currently active and should be displayed',
    initialValue: true,
  }),
  defineField({
    name: 'cloneSpecificData',
    title: 'Clone-Specific Customizations',
    type: 'object',
    description: 'Optional customizations specific to this clone (overrides base content)',
    fields: [
      defineField({
        name: 'customTitle',
        title: 'Custom Title',
        type: 'string',
        description: 'Override the main title for this clone',
      }),
      defineField({
        name: 'customDescription',
        title: 'Custom Description',
        type: 'text',
        description: 'Override the main description for this clone',
      }),
      defineField({
        name: 'customMetadata',
        title: 'Custom Metadata',
        type: 'object',
        description: 'Clone-specific metadata and settings',
        fields: [
          defineField({
            name: 'priority',
            title: 'Priority',
            type: 'number',
            description: 'Display priority for this clone (higher numbers appear first)',
            initialValue: 0,
          }),
          defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Mark as featured content for this clone',
            initialValue: false,
          }),
          defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Tags specific to this clone',
          }),
        ],
        options: {
          collapsible: true,
          collapsed: true,
        },
      }),
    ],
    options: {
      collapsible: true,
      collapsed: true,
    },
  }),
]

/**
 * Enhanced preview function that shows clone information
 */
export function createCloneAwarePreview(originalPreview: any) {
  return {
    ...originalPreview,
    select: {
      ...originalPreview.select,
      isActive: 'isActive',
      cloneReference: 'cloneReference.cloneName',
      cloneId: 'cloneReference.cloneId.current',
      isBaseline: 'cloneReference.baselineClone',
    },
    prepare(selection: any) {
      const originalResult = originalPreview.prepare ? originalPreview.prepare(selection) : selection;
      const { isActive, cloneReference, cloneId, isBaseline } = selection;
      
      // Build status indicators
      const status = [];
      if (!isActive) status.push('⏸️ INACTIVE');
      if (isBaseline) status.push('📋 BASELINE');
      if (cloneReference && !isBaseline) status.push(`🔗 ${cloneReference}`);
      if (!cloneReference) status.push('🌍 GLOBAL');
      
      const statusText = status.length > 0 ? ` • ${status.join(' • ')}` : '';
      
      return {
        ...originalResult,
        subtitle: `${originalResult.subtitle || ''}${statusText}`,
      };
    },
  };
}

/**
 * Add clone support to existing schema
 */
export function addCloneSupport(schema: any) {
  return {
    ...schema,
    fields: [
      ...cloneSupportFields,
      ...schema.fields,
    ],
    preview: createCloneAwarePreview(schema.preview || {}),
  };
} 