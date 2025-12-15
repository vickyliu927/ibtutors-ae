import type { Metadata } from 'next';
import React from 'react';
import BlogHero from './BlogHero';
import BlogListing from './BlogListing';
import { BlogPostItem } from './BlogGrid';
import { LazyContactForm } from '../components/LazyComponents';
import { getBlogPosts, getBlogCategories } from '../lib/getBlogData';
import { client } from '@/sanity/lib/client';
import { getCloneIdForCurrentDomain } from '../lib/sitemapUtils';
import { urlFor } from '@/sanity/lib/image';
import { navbarQueries } from '../lib/cloneQueries';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  // Fetch clone-aware blog page settings
  const cloneId = await getCloneIdForCurrentDomain();
  const query = `{
    "cloneSpecific": *[_type == "blogPageSettings" && defined($cloneId) && cloneReference->cloneId.current == $cloneId][0]{ seoTitle, seoDescription },
    "baseline": *[_type == "blogPageSettings" && cloneReference->baselineClone == true][0]{ seoTitle, seoDescription },
    "default": *[_type == "blogPageSettings" && !defined(cloneReference)][0]{ seoTitle, seoDescription }
  }`;
  const result = await client.fetch(query, { cloneId });
  const data = result?.cloneSpecific || result?.baseline || result?.default || null;

  return {
    title: data?.seoTitle || 'Blog | IB Tutors',
    description: data?.seoDescription || 'Insights, guides, tips and resources from our expert tutors.',
    alternates: { canonical: '/blog' },
  };
}

// Placeholder posts; replace with CMS integration later
async function getPostsFromSanity(): Promise<BlogPostItem[]> {
  const { items } = await getBlogPosts(60);
  return items.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.intro,
    imageUrl: p.mainImage ? (typeof p.mainImage === 'string' ? p.mainImage : urlFor(p.mainImage).width(800).height(450).url()) : undefined,
    date: p.publishedAt,
    href: `/blog/${p.slug?.current || ''}`,
    tags: (p.categories || []).map((c) => c.title),
  }));
}

export default async function BlogPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  // Gate by Navigation dropdown
  const cloneId = await getCloneIdForCurrentDomain();
  const navbar = await navbarQueries.fetch(cloneId || 'global');
  const items: any[] = (navbar?.data as any)?.navigation?.navOrder || [];
  if (!Array.isArray(items) || items.length === 0) {
    return notFound();
  }
  const allowBlog = items.some((i: any) => i?.itemType === 'blog');
  if (!allowBlog) {
    return notFound();
  }

  const posts = await getPostsFromSanity();
  const categories = await getBlogCategories();
  const initialCategory = typeof searchParams?.category === 'string' ? searchParams?.category : '';
  const initialQ = typeof searchParams?.q === 'string' ? searchParams?.q : '';

  return (
    <main className="min-h-screen">
      <div className="relative">
        <BlogHero title="Tutor Blog" description="Your resource for education advice" />
        {/* Pull grid up to overlap hero */}
        <div className="relative z-10 -mt-12 sm:-mt-16 lg:-mt-20">
          <BlogListing posts={posts} categories={categories} initialCategory={initialCategory} initialQ={initialQ} />
        </div>
      </div>
      <LazyContactForm />
    </main>
  );
}


