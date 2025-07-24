import { StructureBuilder } from 'sanity/desk'
import { BiHome, BiCopy } from 'react-icons/bi'
import { BsBook, BsGridFill, BsQuestionCircle } from 'react-icons/bs'
import { RiPagesLine } from 'react-icons/ri'
import { MdSettings, MdLink } from 'react-icons/md'
import { FiGlobe, FiUsers } from 'react-icons/fi'
import { AiOutlineMessage } from 'react-icons/ai'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // All Content by Website
      S.listItem()
        .title('All Content by Website')
        .icon(FiGlobe)
        .child(
          S.list()
            .title('Content by Website Clone')
            .items([
              // Dubai Tutors = Global Content (baseline)
              S.listItem()
                .title('Dubai Tutors')
                .child(
                  S.list()
                    .title('Dubai Tutors Content')
                    .items([
                      S.documentTypeListItem('hero')
                        .title('Hero Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Hero Sections')
                            .filter('_type == "hero" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('highlightsSection')
                        .title('Highlights Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Highlights Sections')
                            .filter('_type == "highlightsSection" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('tutorProfilesSection')
                        .title('Tutor Profile Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Tutor Profile Sections')
                            .filter('_type == "tutorProfilesSection" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('subjectGridSection')
                        .title('Subject Grid Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Subject Grid Sections')
                            .filter('_type == "subjectGridSection" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('advertBlockSection')
                        .title('Advert Block Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Advert Block Sections')
                            .filter('_type == "advertBlockSection" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('platformBanner')
                        .title('Platform Banners')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Platform Banners')
                            .filter('_type == "platformBanner" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('trustedInstitutionsBanner')
                        .title('Trusted Institutions Banners')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Trusted Institutions Banners')
                            .filter('_type == "trustedInstitutionsBanner" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('testimonialSection')
                        .title('Testimonial Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Testimonial Sections')
                            .filter('_type == "testimonialSection" && !defined(cloneReference)')
                        ),
                      S.listItem()
                        .title('FAQ Sections')
                        .icon(BsQuestionCircle)
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - FAQ Sections')
                            .filter('_type == "faq_section" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('footerSection')
                        .title('Footer Sections')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Footer Sections')
                            .filter('_type == "footerSection" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('tutor')
                        .title('Tutors')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Tutors')
                            .filter('_type == "tutor" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('testimonial')
                        .title('Testimonials')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - Testimonials')
                            .filter('_type == "testimonial" && !defined(cloneReference)')
                        ),
                      S.documentTypeListItem('faq')
                        .title('FAQ Items')
                        .child(
                          S.documentList()
                            .title('Dubai Tutors - FAQ Items')
                            .filter('_type == "faq" && !defined(cloneReference)')
                        ),
                    ])
                ),
              
              S.listItem()
                .title('Abu Dhabi Tutors')
                .child(
                  S.list()
                    .title('Abu Dhabi Tutors Content')
                    .items([
                      S.documentTypeListItem('hero')
                        .title('Hero Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Hero Sections')
                            .filter('_type == "hero" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('highlightsSection')
                        .title('Highlights Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Highlights Sections')
                            .filter('_type == "highlightsSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('tutorProfilesSection')
                        .title('Tutor Profile Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Tutor Profile Sections')
                            .filter('_type == "tutorProfilesSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('subjectGridSection')
                        .title('Subject Grid Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Subject Grid Sections')
                            .filter('_type == "subjectGridSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('advertBlockSection')
                        .title('Advert Block Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Advert Block Sections')
                            .filter('_type == "advertBlockSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('platformBanner')
                        .title('Platform Banners')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Platform Banners')
                            .filter('_type == "platformBanner" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('trustedInstitutionsBanner')
                        .title('Trusted Institutions Banners')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Trusted Institutions Banners')
                            .filter('_type == "trustedInstitutionsBanner" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('testimonialSection')
                        .title('Testimonial Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Testimonial Sections')
                            .filter('_type == "testimonialSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.listItem()
                        .title('FAQ Sections')
                        .icon(BsQuestionCircle)
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - FAQ Sections')
                            .filter('_type == "faq_section" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('footerSection')
                        .title('Footer Sections')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Footer Sections')
                            .filter('_type == "footerSection" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('tutor')
                        .title('Tutors')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Tutors')
                            .filter('_type == "tutor" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('testimonial')
                        .title('Testimonials')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - Testimonials')
                            .filter('_type == "testimonial" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                      S.documentTypeListItem('faq')
                        .title('FAQ Items')
                        .child(
                          S.documentList()
                            .title('Abu Dhabi Tutors - FAQ Items')
                            .filter('_type == "faq" && cloneReference->cloneName match "Abu Dhabi*"')
                        ),
                    ])
                ),


            ])
        ),

      // All Content by Section
      S.listItem()
        .title('All Content by Section')
        .icon(RiPagesLine)
        .child(
          S.list()
            .title('Content by Section Type')
            .items([
              // Homepage Content Group
              S.listItem()
                .title('Homepage Content')
                .icon(BiHome)
                .child(
                  S.list()
                    .title('Homepage Sections')
                    .items([
                      S.documentTypeListItem('navbarSettings')
                        .title('Navbar Settings')
                        .icon(MdSettings),
                      S.documentTypeListItem('hero')
                        .title('Hero Sections')
                        .icon(BiHome),
                      S.documentTypeListItem('highlightsSection')
                        .title('Highlights Sections'),
                      S.documentTypeListItem('tutorProfilesSection')
                        .title('Tutor Profile Sections'),
                      S.documentTypeListItem('trustedInstitutionsBanner')
                        .title('Trusted Institutions Banners'),
                      S.documentTypeListItem('subjectGridSection')
                        .title('Subject Grid Sections')
                        .icon(BsGridFill),
                      S.documentTypeListItem('advertBlockSection')
                        .title('Advert Block Sections'),
                      S.documentTypeListItem('platformBanner')
                        .title('Platform Banners'),
                      S.documentTypeListItem('testimonialSection')
                        .title('Testimonial Sections'),
                      // Homepage FAQ Sections
                      S.listItem()
                        .title('FAQ Sections (Homepage)')
                        .icon(BsQuestionCircle)
                        .child(
                          S.documentList()
                            .title('Homepage FAQ Sections')
                            .filter('_type == "faq_section" && (pageType == "homepage" || !defined(pageType))')
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),
                      S.documentTypeListItem('footerSection')
                        .title('Footer Sections'),
                    ])
                ),

              // Subject Pages Content Group
              S.listItem()
                .title('Subject Pages Content')
                .icon(BsBook)
                .child(
                  S.list()
                    .title('Subject Page Sections')
                    .items([
                      S.documentTypeListItem('subjectHeroSection')
                        .title('Subject Hero Sections')
                        .icon(BiHome),
                      S.documentTypeListItem('subjectPage')
                        .title('Subject Page Settings')
                        .icon(BsBook),
                      // Subject Pages FAQ Sections
                      S.listItem()
                        .title('FAQ Sections (Subject Pages)')
                        .icon(BsQuestionCircle)
                        .child(
                          S.list()
                            .title('Subject Pages FAQ Sections')
                            .items([
                              S.listItem()
                                .title('All Subject FAQ Sections')
                                .child(
                                  S.documentList()
                                    .title('All Subject FAQ Sections')
                                    .filter('_type == "faq_section" && pageType == "subject"')
                                    .defaultOrdering([
                                      {field: 'subjectPage.subject', direction: 'asc'},
                                      {field: '_createdAt', direction: 'desc'}
                                    ])
                                ),
                              S.listItem()
                                .title('Subject-Specific FAQs')
                                .child(
                                  S.documentList()
                                    .title('Subject-Specific FAQs')
                                    .filter('_type == "faq_section" && pageType == "subject" && defined(subjectPage)')
                                    .defaultOrdering([
                                      {field: 'subjectPage.subject', direction: 'asc'},
                                      {field: '_createdAt', direction: 'desc'}
                                    ])
                                ),
                              S.listItem()
                                .title('General Subject FAQs')
                                .child(
                                  S.documentList()
                                    .title('General Subject FAQs')
                                    .filter('_type == "faq_section" && pageType == "subject" && !defined(subjectPage)')
                                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                                ),
                            ])
                        ),
                    ])
                ),

              // Curriculum Pages Content Group
              S.listItem()
                .title('Curriculum Pages Content')
                .icon(BsGridFill)
                .child(
                  S.list()
                    .title('Curriculum Page Sections')
                    .items([
                      S.documentTypeListItem('curriculumPage')
                        .title('Curriculum Page Settings')
                        .icon(BsGridFill),
                      // Curriculum Pages FAQ Sections
                      S.listItem()
                        .title('FAQ Sections (Curriculum Pages)')
                        .icon(BsQuestionCircle)
                        .child(
                          S.documentList()
                            .title('Curriculum Pages FAQ Sections')
                            .filter('_type == "faq_section" && pageType == "curriculum"')
                            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                        ),
                    ])
                ),

              // Forms & Communication
              S.listItem()
                .title('Forms & Communication')
                .icon(AiOutlineMessage)
                .child(
                  S.list()
                    .title('Forms & Messages')
                    .items([
                      S.documentTypeListItem('contactFormContent')
                        .title('Contact Form Content'),
                      S.listItem()
                        .title('Contact Form Submissions')
                        .child(
                          S.list()
                            .title('Contact Form Submissions')
                            .items([
                              S.listItem()
                                .title('All Submissions')
                                .child(
                                  S.documentList()
                                    .title('All Contact Form Submissions')
                                    .filter('_type == "contactFormSubmission"')
                                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                                ),
                              S.listItem()
                                .title('Dubai Tutors Submissions')
                                .child(
                                  S.documentList()
                                    .title('Dubai Tutors - Contact Form Submissions')
                                    .filter('_type == "contactFormSubmission" && sourceWebsite == "Dubai Tutors"')
                                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                                ),
                              S.listItem()
                                .title('Abu Dhabi Tutors Submissions')
                                .child(
                                  S.documentList()
                                    .title('Abu Dhabi Tutors - Contact Form Submissions')
                                    .filter('_type == "contactFormSubmission" && sourceWebsite == "Abu Dhabi Tutors"')
                                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                                ),
                              S.listItem()
                                .title('Development/Staging Submissions')
                                .child(
                                  S.documentList()
                                    .title('Development/Staging - Contact Form Submissions')
                                    .filter('_type == "contactFormSubmission" && sourceWebsite == "Development/Staging"')
                                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                                ),
                            ])
                        ),
                    ])
                ),

              // Content Library Group (Reusable Content)
              S.listItem()
                .title('Content Library')
                .icon(FiUsers)
                .child(
                  S.list()
                    .title('Reusable Content')
                    .items([
                      S.documentTypeListItem('tutor')
                        .title('Tutors'),
                      S.documentTypeListItem('testimonial')
                        .title('Testimonials'),
                      // Individual FAQ Items
                      S.documentTypeListItem('faq')
                        .title('FAQ Items')
                        .icon(BsQuestionCircle),
                      // All FAQ Sections (for overview)
                      S.listItem()
                        .title('All FAQ Sections (Overview)')
                        .icon(BsQuestionCircle)
                        .child(
                          S.documentList()
                            .title('All FAQ Sections')
                            .filter('_type == "faq_section"')
                            .defaultOrdering([{field: 'pageType', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}])
                        ),
                    ])
                ),
            ])
        ),

      // Website Clones Group
      S.listItem()
        .title('Website Clones')
        .icon(FiGlobe)
        .child(
          S.list()
            .title('Clone Management')
            .items([
              S.documentTypeListItem('clone')
                .title('All Clones')
                .icon(BiCopy),
              S.documentTypeListItem('seoSettings')
                .title('SEO Settings')
                .icon(MdSettings),
              S.documentTypeListItem('linkSettings')
                .title('Link Settings (Nofollow)')
                .icon(MdLink),
            ])
        ),

      // Show any remaining document types that aren't organized above
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'clone',
            'hero',
            'highlightsSection',
            'tutorProfilesSection',
            'advertBlockSection',
            'subjectGridSection',
            'platformBanner',
            'trustedInstitutionsBanner',
            'testimonialSection',
            'faq_section',
            'footerSection',
            'tutor',
            'testimonial',
            'faq',
            'subjectPage',
            'subjectHeroSection',
            'curriculumPage',
            'seoSettings',
            'navbarSettings',
            'linkSettings',
            'contactFormContent',
            'contactFormSubmission',
          ].includes(listItem.getId() || '')
      ),
    ]) 