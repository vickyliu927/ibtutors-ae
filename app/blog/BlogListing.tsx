'use client';

import React from 'react';
import BlogSearch from './BlogSearch';
import BlogGrid, { BlogPostItem } from './BlogGrid';

export default function BlogListing({ posts }: { posts: BlogPostItem[] }) {
  const [search, setSearch] = React.useState('');

  return (
    <div>
      <BlogSearch value={search} onChange={setSearch} />
      <BlogGrid posts={posts} searchQuery={search} pageSize={15} />
    </div>
  );
}


