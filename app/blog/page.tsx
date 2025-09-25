import type { Metadata } from 'next';
import React from 'react';
import BlogHero from './BlogHero';
import BlogListing from './BlogListing';
import { BlogPostItem } from './BlogGrid';
import { LazyContactForm } from '../components/LazyComponents';
import { getBlogPosts, getBlogCategories } from '../lib/getBlogData';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | IB Tutors',
  description: 'Insights, guides, tips and resources from our expert tutors.',
  alternates: { canonical: '/blog' },
};

// Placeholder posts; replace with CMS integration later
async function getPostsFromSanity(): Promise<BlogPostItem[]> {
  const { items } = await getBlogPosts(60);
  return items.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.intro,
    imageUrl: p.mainImage ? (typeof p.mainImage === 'string' ? p.mainImage : undefined) : undefined,
    date: p.publishedAt,
    href: `/blog/${p.slug?.current || ''}`,
    tags: (p.categories || []).map((c) => c.title),
  }));
}

export default async function BlogPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
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


