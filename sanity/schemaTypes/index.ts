import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'

export const schemaTypes = [hero, tutor]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
