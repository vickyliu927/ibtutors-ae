import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clone',
  title: 'Website Clone',
  type: 'document',
  description: 'Different variants of the website for various domains, regions, or target audiences',
  fields: [
    defineField({
      name: 'cloneName',
      title: 'Clone Name',
      type: 'string',
      description: 'Human-readable name for this website variant (e.g., "Dubai Tutors", "Abu Dhabi IB Academy")',
      validation: Rule => Rule
        .required()
        .min(2)
        .max(100)
        .error('Clone name must be between 2 and 100 characters'),
    }),
    defineField({
      name: 'cloneId',
      title: 'Clone ID',
      type: 'slug',
      description: 'Unique identifier for this clone, auto-generated from clone name',
      options: {
        source: 'cloneName',
        maxLength: 50,
        slugify: (input: string) => 
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, ''),
      },
      validation: Rule => Rule
        .required()
        .custom((slug) => {
          if (!slug?.current) {
            return 'Clone ID is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'cloneDescription',
      title: 'Description',
      type: 'text',
      description: 'Optional description of this website variant and its purpose',
      rows: 3,
      validation: Rule => Rule.max(500).error('Description must be 500 characters or less'),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this clone is currently active and should be served to users',
      initialValue: true,
    }),
    defineField({
      name: 'homepageOnly',
      title: 'Homepage Only (disable subject/curriculum pages)',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, this clone will not generate or fallback to subject/curriculum pages. Only the homepage will be available.'
    }),
    defineField({
      name: 'enableSubjectPagesOnly',
      title: 'Enable Subject Pages Only',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, only subject pages will be available; curriculum pages are disabled.',
      validation: Rule => Rule.custom((value, context) => {
        const doc = context.document as any
        if (value && doc?.homepageOnly) {
          return 'Cannot enable this when Homepage Only is enabled.'
        }
        if (value && doc?.enableCurriculumPagesOnly) {
          return 'Cannot enable both Subject Pages Only and Curriculum Pages Only.'
        }
        return true
      }),
    }),
    defineField({
      name: 'enableCurriculumPagesOnly',
      title: 'Enable Curriculum Pages Only',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, only curriculum pages will be available; subject pages are disabled.',
      validation: Rule => Rule.custom((value, context) => {
        const doc = context.document as any
        if (value && doc?.homepageOnly) {
          return 'Cannot enable this when Homepage Only is enabled.'
        }
        if (value && doc?.enableSubjectPagesOnly) {
          return 'Cannot enable both Curriculum Pages Only and Subject Pages Only.'
        }
        return true
      }),
    }),
    defineField({
      name: 'baselineClone',
      title: 'Baseline Clone',
      type: 'boolean',
      description: 'Mark as the baseline/template clone. Only one clone should be marked as baseline.',
      initialValue: false,
      validation: Rule => Rule.custom(async (value, context) => {
        if (!value) return true
        
        // Check if another document already has baselineClone: true
        const { getClient } = context
        const client = getClient({ apiVersion: '2024-03-20' })
        
        const existingBaseline = await client.fetch(
          `*[_type == "clone" && baselineClone == true && _id != $currentId][0]`,
          { currentId: context.document?._id }
        )
        
        if (existingBaseline) {
          return 'Only one clone can be marked as baseline. Please uncheck the current baseline clone first.'
        }
        
        return true
      }),
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      description: 'Additional information about this website variant',
      fields: [
        defineField({
          name: 'targetAudience',
          title: 'Target Audience',
          type: 'string',
          description: 'Primary target audience for this clone (e.g., "IB Students in Dubai", "GCSE Students in London")',
          validation: Rule => Rule
            .required()
            .min(3)
            .max(200)
            .error('Target audience must be between 3 and 200 characters'),
        }),
        defineField({
          name: 'region',
          title: 'Region',
          type: 'string',
          description: 'Geographic region this clone serves (e.g., "Dubai, UAE", "London, UK", "Singapore")',
          validation: Rule => Rule
            .required()
            .min(2)
            .max(100)
            .error('Region must be between 2 and 100 characters'),
        }),
        defineField({
          name: 'domains',
          title: 'Custom Domains',
          type: 'array',
          description: 'List of domains that should serve this clone (e.g., "dubaitutors.ae", "www.dubaitutors.ae")',
          of: [
            {
              type: 'string',
              validation: Rule => Rule
                .custom((domain: string) => {
                  if (!domain) return 'Domain cannot be empty'
                  
                  // Basic domain validation
                  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
                  
                  if (!domainRegex.test(domain)) {
                    return 'Please enter a valid domain (e.g., "example.com")'
                  }
                  
                  return true
                })
                .error('Invalid domain format'),
            }
          ],
          validation: Rule => Rule
            .min(1)
            .error('At least one domain is required')
            .unique()
            .error('Domains must be unique'),
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When this clone was created',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      hidden: false,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'When this clone was last updated',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      hidden: false,
    }),
  ],
  preview: {
    select: {
      title: 'cloneName',
      subtitle: 'metadata.region',
      isActive: 'isActive',
      isBaseline: 'baselineClone',
      domains: 'metadata.domains',
    },
    prepare({ title, subtitle, isActive, isBaseline, domains }) {
      const status = [];
      if (isBaseline) status.push('📋 BASELINE');
      if (!isActive) status.push('⏸️ INACTIVE');
      if (isActive && !isBaseline) status.push('✅ ACTIVE');
      
      const domainCount = domains?.length || 0;
      const domainText = domainCount === 1 ? '1 domain' : `${domainCount} domains`;
      
      return {
        title: title || 'Untitled Clone',
        subtitle: `${subtitle || 'No region'} • ${domainText} • ${status.join(' • ')}`,
      }
    },
  },
  orderings: [
    {
      title: 'Created Date (Newest)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Created Date (Oldest)',
      name: 'createdAtAsc', 
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Clone Name A-Z',
      name: 'cloneNameAsc',
      by: [{ field: 'cloneName', direction: 'asc' }],
    },
    {
      title: 'Active Status',
      name: 'activeFirst',
      by: [
        { field: 'baselineClone', direction: 'desc' },
        { field: 'isActive', direction: 'desc' },
        { field: 'cloneName', direction: 'asc' },
      ],
    },
  ],
  // Add hooks to automatically update updatedAt timestamp
  // Note: This would require additional setup in Sanity hooks/plugins
}) 