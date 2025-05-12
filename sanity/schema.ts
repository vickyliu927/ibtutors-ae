import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './schemaTypes/blockContent'
import tutor from './schemaTypes/tutor'
import tutorProfilesSection from './schemaTypes/tutorProfilesSection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, tutor, tutorProfilesSection],
} 