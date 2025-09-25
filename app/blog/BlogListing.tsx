'use client';

import React from 'react';
import BlogSearch from './BlogSearch';
import BlogGrid, { BlogPostItem } from './BlogGrid';

export default function BlogListing({ posts, categories = [], initialCategory = '', initialQ = '' }: { posts: BlogPostItem[]; categories?: { title: string; slug?: { current: string } }[]; initialCategory?: string; initialQ?: string; }) {
  const [search, setSearch] = React.useState(initialQ || '');
  const [category, setCategory] = React.useState(initialCategory || '');

  return (
    <div>
      <BlogSearch value={search} onChange={setSearch} categories={categories} selectedCategory={category} onCategoryChange={setCategory} />
      <BlogGrid posts={category ? posts.filter(p => (p.tags || []).includes(category)) : posts} searchQuery={search} pageSize={15} />
    </div>
  );
}


