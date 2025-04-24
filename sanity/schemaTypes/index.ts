import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'
import subject from '../schemas/subject'
import platformBanner from '../schemas/platformBanner'
import testimonialSection from '../schemas/testimonialSection'
import testimonial from '../schemas/testimonial'
import faqSection from '../schemas/faqSection'
import faq from '../schemas/faq'

export const schemaTypes = [
  hero,
  tutor,
  subject,
  platformBanner,
  testimonialSection,
  testimonial,
  faqSection,
  faq,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
