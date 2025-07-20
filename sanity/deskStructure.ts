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
            ])
        ),

      // Homepage Content Group
      S.listItem()
        .title('Homepage Content')
        .icon(BiHome)
        .child(
          S.list()
            .title('Homepage Sections')
            .items([
              S.documentTypeListItem('hero')
                .title('Hero Sections')
                .icon(BiHome),
              S.documentTypeListItem('highlightsSection')
                .title('Highlights Sections'),
              S.documentTypeListItem('tutorProfilesSection')
                .title('Tutor Profile Sections'),
              S.documentTypeListItem('subjectGridSection')
                .title('Subject Grid Sections')
                .icon(BsGridFill),
              S.documentTypeListItem('advertBlockSection')
                .title('Advert Block Sections'),
              S.documentTypeListItem('platformBanner')
                .title('Platform Banners'),
              S.documentTypeListItem('trustedInstitutionsBanner')
                .title('Trusted Institutions Banners'),
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
              S.documentTypeListItem('subjectPage')
                .title('Subject Page Settings')
                .icon(BsBook),
              // Subject Pages FAQ Sections
              S.listItem()
                .title('FAQ Sections (Subject Pages)')
                .icon(BsQuestionCircle)
                .child(
                  S.documentList()
                    .title('Subject Pages FAQ Sections')
                    .filter('_type == "faq_section" && pageType == "subject"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              // Add other subject page specific content here as needed
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
              // Add other curriculum page specific content here as needed
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

      // Settings Group
      S.listItem()
        .title('Settings')
        .icon(MdSettings)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('seoSettings')
                .title('SEO Settings'),
              S.documentTypeListItem('navbarSettings')
                .title('Navbar Settings'),
              S.documentTypeListItem('linkSettings')
                .title('Link Settings (Nofollow)')
                .icon(MdLink),
            ])
        ),

      // Forms & Submissions
      S.listItem()
        .title('Forms & Communication')
        .icon(AiOutlineMessage)
        .child(
          S.list()
            .title('Forms & Messages')
            .items([
              S.documentTypeListItem('contactFormSubmission')
                .title('Contact Form Submissions'),
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
            'platformBanner',
            'trustedInstitutionsBanner',
            'testimonialSection',
            'faq_section',
            'footerSection',
            'tutor',
            'testimonial',
            'faq',
            'subjectPage',
            'curriculumPage',
            'seoSettings',
            'navbarSettings',
            'linkSettings',
            'contactFormSubmission',
          ].includes(listItem.getId() || '')
      ),
    ]) 