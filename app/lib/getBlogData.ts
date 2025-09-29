import { client } from '@/sanity/lib/client'
import { getCloneIdForCurrentDomain } from './sitemapUtils'

export interface BlogListItem {
  _id: string;
  title: string;
  slug: { current: string };
  intro: string;
  mainImage?: any;
  imageAlt?: string;
  imageCaption?: string;
  publishedAt?: string;
  readingTime?: number;
  categories?: Array<{ _id: string; title: string }>;
}

export interface BlogListResponse {
  items: BlogListItem[];
  sourceInfo: string;
}

/**
 * Fetch blog posts with 3-tier clone-aware fallback (cloneSpecific → baseline → default)
 */
export async function getBlogPosts(limit: number = 45): Promise<BlogListResponse> {
  const cloneId = await getCloneIdForCurrentDomain();

  const fields = `{
    _id,
    title,
    slug,
    intro,
    mainImage,
    imageAlt,
    imageCaption,
    publishedAt,
    readingTime,
    categories[]->{ _id, title },
  }`;

  const query = `{
    "cloneSpecific": *[_type == "blogPost" && defined($cloneId) && cloneReference->cloneId.current == $cloneId && isActive == true] | order(publishedAt desc)[0...$limit] ${fields},
    "baseline": *[_type == "blogPost" && cloneReference->baselineClone == true && isActive == true] | order(publishedAt desc)[0...$limit] ${fields},
    "default": *[_type == "blogPost" && !defined(cloneReference) && isActive == true] | order(publishedAt desc)[0...$limit] ${fields}
  }`;

  const result = await client.fetch(query, { cloneId, limit });

  const items: BlogListItem[] =
    (result?.cloneSpecific && result.cloneSpecific.length > 0)
      ? result.cloneSpecific
      : (result?.baseline && result.baseline.length > 0)
        ? result.baseline
        : (result?.default || []);

  const sourceInfo = (result?.cloneSpecific && result.cloneSpecific.length > 0)
    ? 'cloneSpecific'
    : (result?.baseline && result.baseline.length > 0)
      ? 'baseline'
      : 'default';

  return { items, sourceInfo };
}

export async function getBlogCategories(): Promise<{ title: string; slug?: { current: string } }[]> {
  const cloneId = await getCloneIdForCurrentDomain();
  const query = `{
    "cloneSpecific": *[_type == "blogCategory" && defined($cloneId) && cloneReference->cloneId.current == $cloneId && isActive == true] | order(title asc) { title, slug },
    "baseline": *[_type == "blogCategory" && cloneReference->baselineClone == true && isActive == true] | order(title asc) { title, slug },
    "default": *[_type == "blogCategory" && !defined(cloneReference) && isActive == true] | order(title asc) { title, slug }
  }`;
  const result = await client.fetch(query, { cloneId });
  return (result?.cloneSpecific?.length ? result.cloneSpecific : (result?.baseline?.length ? result.baseline : (result?.default || [])));
}

export interface BlogPostDetail {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  imageAlt?: string;
  imageCaption?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: { _id: string; name: string; avatar?: any };
  categories?: Array<{ _id: string; title: string; slug?: { current: string } }>;
  intro: string;
  body: any[];
  additionalDescriptionTitle?: string;
  additionalDescription?: string;
  tutorCard?: { tutor?: { _id: string }, subheading?: string };
  relatedPosts?: Array<{ _id: string; title: string; slug: { current: string }; mainImage?: any; imageAlt?: string }>;
  tutorAdvertBlock?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    tutors?: Array<{ _id: string; name?: string; professionalTitle?: string; profilePhoto?: any }>;
  };
  resourceLinks?: Array<{ title: string; url: string }>;
  sidebarLinks?: Array<{ title: string; url: string }>;
  faqReferences?: Array<{ _id: string; question: string; answer: any[] }>;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const cloneId = await getCloneIdForCurrentDomain();
  const fields = `{
    _id,
    title,
    slug,
    mainImage,
    imageAlt,
    imageCaption,
    publishedAt,
    readingTime,
    author->{ _id, name, avatar },
    categories[]->{ _id, title, slug },
    intro,
    body,
    additionalDescriptionTitle,
    additionalDescription,
    tutorCard{ tutor->{ _id }, subheading },
    relatedPosts[]->{ _id, title, slug, mainImage, imageAlt },
    tutorAdvertBlock{
      title,
      description,
      buttonText,
      buttonLink,
      tutors[]->{ _id, name, professionalTitle, profilePhoto }
    },
    resourceLinks[]{ title, url },
    sidebarLinks[]{ title, url },
    faqReferences[]->{ _id, question, answer }
  }`;

  const query = `{
    "cloneSpecific": *[_type == "blogPost" && defined($cloneId) && cloneReference->cloneId.current == $cloneId && slug.current == $slug][0] ${fields},
    "baseline": *[_type == "blogPost" && cloneReference->baselineClone == true && slug.current == $slug][0] ${fields},
    "default": *[_type == "blogPost" && !defined(cloneReference) && slug.current == $slug][0] ${fields}
  }`;

  const result = await client.fetch(query, { cloneId, slug });
  return result?.cloneSpecific || result?.baseline || result?.default || null;
}


