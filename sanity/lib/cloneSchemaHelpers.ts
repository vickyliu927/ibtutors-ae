import { defineField } from 'sanity'

/**
 * Custom slug validation that allows the same slug across different clones
 * but ensures uniqueness within each clone
 */
export async function isUniqueAcrossClones(slug: string, context: any) {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2024-03-20' })
  
  if (!slug) return true
  
  // Get the current document's clone reference
  const currentCloneRef = document?.cloneReference?._ref
  
  // Get current document ID (handle both draft and published)
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    cloneRef: currentCloneRef || null,
  }
  
  // Build query to check for slug uniqueness within the same clone
  let query
  if (currentCloneRef) {
    // If document has a clone reference, check for uniqueness within that clone
    query = `!defined(*[
      !(_id in [$draft, $published]) && 
      slug.current == $slug && 
      cloneReference._ref == $cloneRef
    ][0]._id)`
  } else {
    // If document has no clone reference (global content), check for uniqueness among global content
    query = `!defined(*[
      !(_id in [$draft, $published]) && 
      slug.current == $slug && 
      !defined(cloneReference)
    ][0]._id)`
  }
  
  const result = await client.fetch(query, params)
  return result
}

/**
 * Enhanced slug field definition with clone-aware validation
 */
export function createCloneAwareSlugField(options: any = {}) {
  const { validation, hidden, readOnly, ...slugOptions } = options || {};
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    // Preserve custom validation if provided; otherwise default to required
    validation: validation || ((Rule: any) => Rule.required()),
    hidden,
    readOnly,
    options: {
      source: slugOptions.source || 'title',
      maxLength: slugOptions.maxLength || 96,
      isUnique: isUniqueAcrossClones,
      ...slugOptions,
    },
  })
}

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
      // Avoid '->' in select to prevent Studio structure path crash
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
 * Add clone support to existing schema and automatically replace slug fields with clone-aware versions
 */
export function addCloneSupport(schema: any) {
  // Replace any existing slug fields with clone-aware versions
  const updatedFields = schema.fields.map((field: any) => {
    if (field.type === 'slug') {
      return createCloneAwareSlugField({
        ...field.options,
        // Preserve top-level properties like validation/hidden/readOnly
        validation: field.validation,
        hidden: field.hidden,
        readOnly: field.readOnly,
        source: (field.options?.source) || (field.name === 'slug' ? 'title' : field.name),
      })
    }
    return field
  })

  return {
    ...schema,
    fields: [
      ...cloneSupportFields,
      ...updatedFields,
    ],
    preview: createCloneAwarePreview(schema.preview || {}),
  };
} 