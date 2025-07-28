import { StructureBuilder } from 'sanity/desk'
import { BiHome, BiCopy } from 'react-icons/bi'
import { BsBook, BsGridFill, BsQuestionCircle } from 'react-icons/bs'
import { RiPagesLine } from 'react-icons/ri'
import { MdSettings, MdLink } from 'react-icons/md'
import { FiGlobe, FiUsers } from 'react-icons/fi'
import { AiOutlineMessage } from 'react-icons/ai'

// Helper function to create the five standard content categories for a clone
const createCloneContentCategories = (S: StructureBuilder, clone: any) => {
  const cloneName = clone.cloneName
  const isGlobalClone = !clone.cloneReference // Global content (Dubai Tutors baseline)
  
  return [
    // Homepage Content Group
    S.listItem()
      .title('Homepage Content')
      .icon(BiHome)
      .child(
        S.list()
          .title(`${cloneName} - Homepage Sections`)
          .items([
            S.documentTypeListItem('navbarSettings')
              .title('NavBar Settings')
              .child(
                S.documentList()
                  .title(`${cloneName} - NavBar Settings`)
                  .filter(isGlobalClone 
                    ? '_type == "navbarSettings" && !defined(cloneReference)'
                    : `_type == "navbarSettings" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('hero')
              .title('Hero Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Hero Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "hero" && !defined(cloneReference)'
                    : `_type == "hero" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('highlightsSection')
              .title('Highlights Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Highlights Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "highlightsSection" && !defined(cloneReference)'
                    : `_type == "highlightsSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('tutorProfilesSection')
              .title('Tutor Profile Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Tutor Profile Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "tutorProfilesSection" && !defined(cloneReference)'
                    : `_type == "tutorProfilesSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('trustedInstitutionsBanner')
              .title('Trusted Institutions Banners')
              .child(
                S.documentList()
                  .title(`${cloneName} - Trusted Institutions Banners`)
                  .filter(isGlobalClone 
                    ? '_type == "trustedInstitutionsBanner" && !defined(cloneReference)'
                    : `_type == "trustedInstitutionsBanner" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('subjectGridSection')
              .title('Subject Grid Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Subject Grid Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "subjectGridSection" && !defined(cloneReference)'
                    : `_type == "subjectGridSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('advertBlockSection')
              .title('Advert Block Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Advert Block Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "advertBlockSection" && !defined(cloneReference)'
                    : `_type == "advertBlockSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('platformBanner')
              .title('Platform Banners')
              .child(
                S.documentList()
                  .title(`${cloneName} - Platform Banners`)
                  .filter(isGlobalClone 
                    ? '_type == "platformBanner" && !defined(cloneReference)'
                    : `_type == "platformBanner" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('testimonialSection')
              .title('Testimonial Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Testimonial Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "testimonialSection" && !defined(cloneReference)'
                    : `_type == "testimonialSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.listItem()
              .title('FAQ Sections (Homepage)')
              .icon(BsQuestionCircle)
              .child(
                S.documentList()
                  .title(`${cloneName} - Homepage FAQ Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "faq_section" && !defined(cloneReference) && (pageType == "homepage" || !defined(pageType))'
                    : `_type == "faq_section" && cloneReference->cloneName == "${cloneName}" && (pageType == "homepage" || !defined(pageType))`
                  )
                  .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
              ),
            S.documentTypeListItem('footerSection')
              .title('Footer Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Footer Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "footerSection" && !defined(cloneReference)'
                    : `_type == "footerSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
          ])
      ),

    // Subject Pages Content Group
    S.listItem()
      .title('Subject Pages Content')
      .icon(BsBook)
      .child(
        S.list()
          .title(`${cloneName} - Subject Page Sections`)
          .items([
            S.documentTypeListItem('subjectHeroSection')
              .title('Subject Hero Sections')
              .child(
                S.documentList()
                  .title(`${cloneName} - Subject Hero Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "subjectHeroSection" && !defined(cloneReference)'
                    : `_type == "subjectHeroSection" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('subjectPage')
              .title('Subject Page Settings')
              .child(
                S.documentList()
                  .title(`${cloneName} - Subject Page Settings`)
                  .filter(isGlobalClone 
                    ? '_type == "subjectPage" && !defined(cloneReference)'
                    : `_type == "subjectPage" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.listItem()
              .title('FAQ Sections (Subject Pages)')
              .icon(BsQuestionCircle)
              .child(
                S.documentList()
                  .title(`${cloneName} - Subject FAQ Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "faq_section" && !defined(cloneReference) && pageType == "subject"'
                    : `_type == "faq_section" && cloneReference->cloneName == "${cloneName}" && pageType == "subject"`
                  )
                  .defaultOrdering([
                    {field: 'subjectPage.subject', direction: 'asc'},
                    {field: '_createdAt', direction: 'desc'}
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
          .title(`${cloneName} - Curriculum Page Sections`)
          .items([
            S.documentTypeListItem('curriculumPage')
              .title('Curriculum Page Settings')
              .child(
                S.documentList()
                  .title(`${cloneName} - Curriculum Page Settings`)
                  .filter(isGlobalClone 
                    ? '_type == "curriculumPage" && !defined(cloneReference)'
                    : `_type == "curriculumPage" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.listItem()
              .title('FAQ Sections (Curriculum Pages)')
              .icon(BsQuestionCircle)
              .child(
                S.documentList()
                  .title(`${cloneName} - Curriculum FAQ Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "faq_section" && !defined(cloneReference) && pageType == "curriculum"'
                    : `_type == "faq_section" && cloneReference->cloneName == "${cloneName}" && pageType == "curriculum"`
                  )
                  .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
              ),
          ])
      ),

    // Forms & Communication Group
    S.listItem()
      .title('Forms & Communication')
      .icon(AiOutlineMessage)
      .child(
        S.list()
          .title(`${cloneName} - Forms & Messages`)
          .items([
            S.documentTypeListItem('contactFormContent')
              .title('Contact Form Content')
              .child(
                S.documentList()
                  .title(`${cloneName} - Contact Form Content`)
                  .filter(isGlobalClone 
                    ? '_type == "contactFormContent" && !defined(cloneReference)'
                    : `_type == "contactFormContent" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.listItem()
              .title('Contact Form Submissions')
              .child(
                S.documentList()
                  .title(`${cloneName} - Contact Form Submissions`)
                  .filter(`_type == "contactFormSubmission" && sourceWebsite == "${cloneName}"`)
                  .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
              ),
          ])
      ),

    // Content Library Group
    S.listItem()
      .title('Content Library')
      .icon(FiUsers)
      .child(
        S.list()
          .title(`${cloneName} - Reusable Content`)
          .items([
            S.documentTypeListItem('tutor')
              .title('Tutors')
              .child(
                S.documentList()
                  .title(`${cloneName} - Tutors`)
                  .filter(isGlobalClone 
                    ? '_type == "tutor" && !defined(cloneReference)'
                    : `_type == "tutor" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('testimonial')
              .title('Testimonials')
              .child(
                S.documentList()
                  .title(`${cloneName} - Testimonials`)
                  .filter(isGlobalClone 
                    ? '_type == "testimonial" && !defined(cloneReference)'
                    : `_type == "testimonial" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.documentTypeListItem('faq')
              .title('FAQ Items')
              .child(
                S.documentList()
                  .title(`${cloneName} - FAQ Items`)
                  .filter(isGlobalClone 
                    ? '_type == "faq" && !defined(cloneReference)'
                    : `_type == "faq" && cloneReference->cloneName == "${cloneName}"`
                  )
              ),
            S.listItem()
              .title('All FAQ Sections (Overview)')
              .icon(BsQuestionCircle)
              .child(
                S.documentList()
                  .title(`${cloneName} - All FAQ Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "faq_section" && !defined(cloneReference)'
                    : `_type == "faq_section" && cloneReference->cloneName == "${cloneName}"`
                  )
                  .defaultOrdering([{field: 'pageType', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}])
              ),
          ])
      ),
  ]
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // All Content by Website - Now Dynamic!
      S.listItem()
        .title('All Content by Website')
        .icon(FiGlobe)
        .child(
          S.documentTypeList('clone')
            .title('Content by Website Clone')
            .filter('isActive == true')
            .child((cloneId: string) => {
              return S.document()
                .schemaType('clone')
                .documentId(cloneId)
                .child((context: any) => {
                  const clone = context.document?.displayed
                  
                  if (!clone) {
                    return S.list().title('Loading...').items([])
                  }

                  // Create special handling for Dubai Tutors (baseline/global content)
                  const isDubaiTutors = clone.cloneName === 'Dubai Tutors'

                  return S.list()
                    .title(`${clone.cloneName} Content`)
                    .items(createCloneContentCategories(S, {
                      cloneName: clone.cloneName,
                      cloneReference: isDubaiTutors ? null : clone._id // Dubai Tutors is treated as global
                    }))
                })
            })
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