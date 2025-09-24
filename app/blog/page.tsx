import type { Metadata } from 'next';
import React from 'react';
import BlogHero from './BlogHero';
import BlogListing from './BlogListing';
import { BlogPostItem } from './BlogGrid';
import { LazyContactForm } from '../components/LazyComponents';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Blog | IB Tutors',
  description: 'Insights, guides, tips and resources from our expert tutors.',
  alternates: { canonical: '/blog' },
};

// Placeholder posts; replace with CMS integration later
function getSamplePosts(): BlogPostItem[] {
  const baseImg = '/images/tutoring-platform.jpg';
  const posts: BlogPostItem[] = Array.from({ length: 45 }).map((_, i) => ({
    id: `post-${i + 1}`,
    title: `How to excel in IB Subject ${i + 1}`,
    description:
      'Practical strategies to improve understanding, revision techniques, and exam performance for IB students.',
    imageUrl: baseImg,
    date: '2025-09-01',
    href: '#',
    tags: ['IB', 'Study Tips', 'Exams'],
  }));
  return posts;
}

export default function BlogPage() {
  const posts = getSamplePosts();

  return (
    <main className="min-h-screen">
      <BlogHero title="Tutor Blog" description="Your resource for education advice" />
      <BlogListing posts={posts} />
      <LazyContactForm />
    </main>
  );
}


