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
  const cloneId = clone.cloneReference // This is the clone document ID for filtering
  const isGlobalClone = !cloneId // Global content (Dubai Tutors baseline)
  
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
                    : `_type == "navbarSettings" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('hero')
                                .title('Hero Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Hero Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "hero" && !defined(cloneReference)'
                    : `_type == "hero" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('highlightsSection')
                                .title('Highlights Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Highlights Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "highlightsSection" && !defined(cloneReference)'
                    : `_type == "highlightsSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('tutorProfilesSection')
                                .title('Tutor Profile Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Tutor Profile Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "tutorProfilesSection" && !defined(cloneReference)'
                    : `_type == "tutorProfilesSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('trustedInstitutionsBanner')
                                .title('Trusted Institutions Banners')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Trusted Institutions Banners`)
                  .filter(isGlobalClone 
                    ? '_type == "trustedInstitutionsBanner" && !defined(cloneReference)'
                    : `_type == "trustedInstitutionsBanner" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('subjectGridSection')
                                .title('Subject Grid Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Subject Grid Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "subjectGridSection" && !defined(cloneReference)'
                    : `_type == "subjectGridSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('advertBlockSection')
                                .title('Advert Block Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Advert Block Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "advertBlockSection" && !defined(cloneReference)'
                    : `_type == "advertBlockSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('platformBanner')
                                .title('Platform Banners')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Platform Banners`)
                  .filter(isGlobalClone 
                    ? '_type == "platformBanner" && !defined(cloneReference)'
                    : `_type == "platformBanner" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('testimonialSection')
                                .title('Testimonial Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Testimonial Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "testimonialSection" && !defined(cloneReference)'
                    : `_type == "testimonialSection" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "faq_section" && cloneReference._ref == "${cloneId}" && (pageType == "homepage" || !defined(pageType))`
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
                    : `_type == "footerSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                            ])
                        ),

                      // Blog Content Group
                      S.listItem()
                        .title('Blog')
                        .icon(BsBook)
                        .child(
                          S.list()
                            .title(`${cloneName} - Blog`)
                            .items([
                              S.documentTypeListItem('blogPost')
                                .title('Posts')
                                .child(
                                  S.documentList()
                                    .title(`${cloneName} - Posts`)
                                    .filter(isGlobalClone 
                                      ? '_type == "blogPost" && !defined(cloneReference)'
                                      : `_type == "blogPost" && cloneReference._ref == "${cloneId}"`
                                    )
                                ),
                              S.documentTypeListItem('blogCategory')
                                .title('Categories')
                                .child(
                                  S.documentList()
                                    .title(`${cloneName} - Categories`)
                                    .filter(isGlobalClone 
                                      ? '_type == "blogCategory" && !defined(cloneReference)'
                                      : `_type == "blogCategory" && cloneReference._ref == "${cloneId}"`
                                    )
                                ),
                              S.documentTypeListItem('blogAuthor')
                                .title('Authors')
                                .child(
                                  S.documentList()
                                    .title(`${cloneName} - Authors`)
                                    .filter(isGlobalClone 
                                      ? '_type == "blogAuthor" && !defined(cloneReference)'
                                      : `_type == "blogAuthor" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "subjectHeroSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('subjectPage')
                                .title('Subject Page Settings')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Subject Page Settings`)
                  .filter(isGlobalClone 
                    ? '_type == "subjectPage" && !defined(cloneReference)'
                    : `_type == "subjectPage" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "faq_section" && cloneReference._ref == "${cloneId}" && pageType == "subject"`
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
                              S.documentTypeListItem('curriculumHeroSection')
                                .title('Curriculum Hero Sections')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Curriculum Hero Sections`)
                  .filter(isGlobalClone 
                    ? '_type == "curriculumHeroSection" && !defined(cloneReference)'
                    : `_type == "curriculumHeroSection" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('curriculumPage')
                                .title('Curriculum Page Settings')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Curriculum Page Settings`)
                  .filter(isGlobalClone 
                    ? '_type == "curriculumPage" && !defined(cloneReference)'
                    : `_type == "curriculumPage" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "faq_section" && cloneReference._ref == "${cloneId}" && pageType == "curriculum"`
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
                    : `_type == "contactFormContent" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "tutor" && cloneReference._ref == "${clone._id}"`
                  )
                                ),
                              S.documentTypeListItem('testimonial')
                                .title('Testimonials')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - Testimonials`)
                  .filter(isGlobalClone 
                    ? '_type == "testimonial" && !defined(cloneReference)'
                    : `_type == "testimonial" && cloneReference._ref == "${cloneId}"`
                  )
                                ),
                              S.documentTypeListItem('faq')
                                .title('FAQ Items')
                                .child(
                                  S.documentList()
                  .title(`${cloneName} - FAQ Items`)
                  .filter(isGlobalClone 
                    ? '_type == "faq" && !defined(cloneReference)'
                    : `_type == "faq" && cloneReference._ref == "${cloneId}"`
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
                    : `_type == "faq_section" && cloneReference._ref == "${cloneId}"`
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
            // All Content by Website - Fully Dynamic Clone Folders!
      S.listItem()
        .title('All Content by Website')
        .icon(FiGlobe)
        .child(
          S.list()
            .title('Content by Website Clone')
            .items([
              // Dubai Tutors (Global/Baseline Content)
              S.listItem()
                .title('Dubai Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Dubai Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Dubai Tutors',
                      cloneReference: null // Global content
                    }))
                ),
              
              // Abu Dhabi Tutors  
              S.listItem()
                .title('Abu Dhabi Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Abu Dhabi Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Abu Dhabi Tutors',
                      cloneReference: '9aab910c-dd46-48e9-a44f-594906d32ca7' // Actual Abu Dhabi Tutors document ID
                    }))
                ),

              // Singapore Tutors
              S.listItem()
                .title('Singapore Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Singapore Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Singapore Tutors',
                      cloneReference: '4c395ebb-26a8-48a5-a83c-4f5d4e078587' // Actual Singapore Tutors document ID
                    }))
                ),

              // Germany Tutors
              S.listItem()
                .title('Germany Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Germany Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Germany Tutors',
                      cloneReference: 'c6952c71-7f8e-43b5-9a73-03686371e8cc'
                    }))
                ),

              // Italy Tutors
              S.listItem()
                .title('Italy Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Italy Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Italy Tutors',
                      cloneReference: '86b1da5e-639b-43c5-8b64-063a71f0d575'
                    }))
                ),

              // Qatar Tutors
              S.listItem()
                .title('Qatar Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Qatar Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Qatar Tutors',
                      cloneReference: 'c04bc280-7316-4ebb-b992-91166ea5c826'
                    }))
                ),

              // Spain Tutors
              S.listItem()
                .title('Spain Tutors')
                .icon(FiGlobe)
                .child(
                  S.list()
                    .title('Spain Tutors Content')
                    .items(createCloneContentCategories(S, {
                      cloneName: 'Spain Tutors',
                      cloneReference: 'db2574dd-3841-41a3-976e-c6df0fe6cfda'
                    }))
                ),

              // Add more clones here as needed...
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
                      S.documentTypeListItem('curriculumHeroSection')
                        .title('Curriculum Hero Sections')
                        .icon(BiHome),
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
                        .title('All Submissions')
                        .child(
                          S.documentList()
                            .title('All Contact Form Submissions')
                            .filter('_type == "contactFormSubmission"')
                            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
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
            'curriculumHeroSection',
            'seoSettings',
            'navbarSettings',
            'linkSettings',
            'contactFormContent',
            'contactFormSubmission',
          ].includes(listItem.getId() || '')
      ),
    ]) 