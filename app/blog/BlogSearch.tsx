'use client';

import React from 'react';

interface BlogSearchProps {
  value: string;
  onChange: (v: string) => void;
  categories?: { title: string; slug?: { current: string } }[];
  selectedCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

export default function BlogSearch({ value, onChange, categories = [], selectedCategory, onCategoryChange }: BlogSearchProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-6">
      <div className="flex gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search blog posts"
          className="flex-1 h-12 px-4 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#001A96]"
        />
        {categories && categories.length > 0 ? (
          <select
            className="h-12 px-3 rounded-[12px] border border-gray-200 bg-white"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.title} value={c.slug?.current || c.title}>{c.title}</option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          className="h-12 px-6 rounded-[12px] bg-[#001A96] text-white text-sm font-medium"
          onClick={() => { /* no-op submit as search is reactive */ }}
        >
          Search
        </button>
      </div>
    </div>
  );
}


