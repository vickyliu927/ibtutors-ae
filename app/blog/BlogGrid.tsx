'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';

export interface BlogPostItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date?: string;
  href?: string;
  tags?: string[];
}

interface BlogGridProps {
  posts: BlogPostItem[];
  searchQuery: string;
  pageSize?: number; // total posts per page
}

export default function BlogGrid({ posts, searchQuery, pageSize = 15 }: BlogGridProps) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.description, ...(p.tags || [])].join(' ').toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((post) => (
          <a
            key={post.id}
            href={post.href || '#'}
            className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={false}
                />
              ) : null}
            </div>
            <div className="p-4">
              {/* Removed timestamp per design request */}
              <h3 className="text-lg font-medium text-[#171D23] leading-snug line-clamp-2 group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.description}</p>
              {post.tags && post.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <button
          className="px-4 h-10 rounded-lg border border-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className="px-4 h-10 rounded-lg border border-gray-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}


