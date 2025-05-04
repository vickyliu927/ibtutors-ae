import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './schemaTypes/blockContent'
import tutor from './schemaTypes/tutor'
import subjectHeader from './schemaTypes/subjectHeader'
import mathsPage from './schemaTypes/mathsPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, tutor, subjectHeader, mathsPage],
} 