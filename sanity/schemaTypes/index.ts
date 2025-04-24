import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import tutor from '../schemas/tutor'
import subject from '../schemas/subject'
import platformBanner from '../schemas/platformBanner'
import testimonialSection from '../schemas/testimonialSection'
import testimonial from '../schemas/testimonial'
import faqSection from '../schemas/faqSection'
import faq from './faq'
import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import testimonial_section from './testimonial_section'
import platform_banner from './platform_banner'
import faq_section from './faq_section'

export const schemaTypes = [
  hero,
  tutor,
  subject,
  platformBanner,
  testimonialSection,
  testimonial,
  faqSection,
  faq,
  post,
  author,
  category,
  blockContent,
  testimonial_section,
  platform_banner,
  faq_section,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
