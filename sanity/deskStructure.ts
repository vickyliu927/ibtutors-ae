import { StructureBuilder } from 'sanity/desk'
import { BiHome } from 'react-icons/bi'
import { BsBook, BsGridFill } from 'react-icons/bs'
import { RiPagesLine } from 'react-icons/ri'
import { MdSettings, MdLink } from 'react-icons/md'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Pages Group
      S.listItem()
        .title('Pages')
        .icon(RiPagesLine)
        .child(
          S.list()
            .title('Pages')
            .items([
              // Homepage Group
              S.listItem()
                .title('Homepage')
                .icon(BiHome)
                .child(
                  S.list()
                    .title('Homepage Sections')
                    .items([
                      S.documentListItem()
                        .schemaType('hero')
                        .title('Hero Section')
                        .id('hero'),
                      S.documentListItem()
                        .schemaType('highlightsSection')
                        .title('Homepage Highlights Section')
                        .id('highlightsSection'),
                      S.documentTypeListItem('tutor')
                        .title('Tutors'),
                      S.documentListItem()
                        .schemaType('tutorProfilesSection')
                        .title('Tutor Profiles Section')
                        .id('tutorProfilesSection'),
                      S.documentListItem()
                        .schemaType('platformBanner')
                        .title('Platform Banner')
                        .id('platformBanner'),
                      S.documentTypeListItem('testimonial')
                        .title('Testimonials'),
                      S.documentListItem()
                        .schemaType('testimonialSection')
                        .title('Testimonial Section')
                        .id('testimonialSection'),
                      S.documentTypeListItem('faq')
                        .title('FAQs'),
                      S.documentListItem()
                        .schemaType('faq_section')
                        .title('FAQ Section')
                        .id('faq_section'),
                      S.documentTypeListItem('contactFormSubmission')
                        .title('Contact Form Submissions'),
                      S.documentListItem()
                        .schemaType('footerSection')
                        .title('Footer Section')
                        .id('footerSection'),
                      S.documentListItem()
                        .schemaType('seoSettings')
                        .title('SEO')
                        .id('seoSettings'),
                    ])
                ),
              // Subject Pages Group
              S.listItem()
                .title('Subject Pages')
                .icon(BsBook)
                .child(
                  S.list()
                    .title('Subject Pages')
                    .items([
                      S.documentTypeListItem('subjectPage')
                        .title('Subject Pages'),
                    ])
                ),
              // Curriculum Pages Group
              S.listItem()
                .title('Curriculum Pages')
                .icon(BsGridFill)
                .child(
                  S.list()
                    .title('Curriculum Pages')
                    .items([
                      S.documentTypeListItem('curriculumPage')
                        .title('Curriculum Pages'),
                    ])
                ),
            ])
        ),
      // Add a new SEO Settings section
      S.listItem()
        .title('SEO Settings')
        .icon(MdSettings)
        .child(
          S.list()
            .title('SEO Settings')
            .items([
              S.listItem()
                .title('General SEO Settings')
                .child(
                  S.document()
                    .schemaType('seoSettings')
                    .documentId('seoSettings')
                ),
              S.listItem()
                .title('Link Settings (Nofollow)')
                .icon(MdLink)
                .child(
                  S.documentList()
                    .title('Link Settings')
                    .filter('_type == "linkSettings"')
                ),
            ])
        ),
      // Show remaining document types that aren't organized
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'hero',
            'tutor',
            'tutorProfilesSection',
            'platformBanner',
            'testimonial',
            'testimonialSection',
            'faq',
            'faq_section',
            'contactFormSubmission',
            'footerSection',
            'subjectPage',
            'curriculumPage',
            'seoSettings',
            'highlightsSection',
            'linkSettings',
          ].includes(listItem.getId() || '')
      ),
    ]) 