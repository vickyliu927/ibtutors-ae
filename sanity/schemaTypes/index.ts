import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'
import subject from '../schemas/subject'
import platformBanner from '../schemas/platformBanner'

export const schemaTypes = [hero, tutor, subject, platformBanner]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
