import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'
import subject from '../schemas/subject'

export const schemaTypes = [hero, tutor, subject]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
