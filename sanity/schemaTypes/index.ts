import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'
import subject from '../schemas/subject'
import platformBanner from '../schemas/platformBanner'
import testimonialSection from '../schemas/testimonialSection'
import testimonial from '../schemas/testimonial'

export const schemaTypes = [
  hero,
  tutor,
  subject,
  platformBanner,
  testimonialSection,
  testimonial,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
