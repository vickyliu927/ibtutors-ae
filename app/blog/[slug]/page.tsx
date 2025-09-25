import React from 'react';
import type { Metadata } from 'next';
import { getBlogPostBySlug } from '../../lib/getBlogData';
import { PortableText } from 'next-sanity';
import Link from 'next/link';

export const revalidate = 60;

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getBlogPostBySlug(params.slug);
  return {
    title: data?.title ? `${data.title} | IB Tutors` : 'Blog | IB Tutors',
    description: data?.intro || undefined,
    alternates: { canonical: `/blog/${params.slug}` },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const data = await getBlogPostBySlug(params.slug);
  if (!data) {
    return (
      <main className="min-h-screen">
        <section className="max-w-[960px] mx-auto px-4 py-16">
          <h1 className="text-2xl font-medium">Post not found</h1>
          <p className="mt-2 text-gray-600">The article you are looking for does not exist.</p>
          <Link href="/blog" className="mt-6 inline-block text-[#001A96] underline">Back to blog</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <article className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-medium text-[#171D23]">{data.title}</h1>
          <div className="mt-3 text-sm text-gray-500">
            <span>{data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : ''}</span>
            {data.readingTime ? <span> • {data.readingTime} min read</span> : null}
          </div>
          {data.intro ? <p className="mt-4 text-lg text-gray-700">{data.intro}</p> : null}
          <div className="prose max-w-none mt-8">
            {/* Body */}
            <PortableText value={data.body || []} />
          </div>

          {/* Related posts */}
          {data.relatedPosts && data.relatedPosts.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.relatedPosts.map((p) => (
                  <Link key={p._id} href={`/blog/${p.slug?.current}`} className="p-4 rounded-lg border border-gray-200 hover:shadow-sm">
                    <div className="text-[#001A96] font-medium underline">{p.title}</div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* FAQs */}
          {data.faqReferences && data.faqReferences.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">FAQs</h2>
              <div className="divide-y divide-gray-200">
                {data.faqReferences.map((faq) => (
                  <details key={faq._id} className="py-3">
                    <summary className="cursor-pointer font-medium text-[#171D23]">{faq.question}</summary>
                    <div className="prose mt-2">
                      <PortableText value={faq.answer || []} />
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="lg:pt-8">
          {data.tutorAdvertBlock ? (
            <div className="rounded-2xl border border-gray-200 p-5">
              {data.tutorAdvertBlock.title ? (
                <h3 className="text-lg font-medium">{data.tutorAdvertBlock.title}</h3>
              ) : null}
              {data.tutorAdvertBlock.description ? (
                <p className="mt-2 text-sm text-gray-700">{data.tutorAdvertBlock.description}</p>
              ) : null}
              {data.tutorAdvertBlock.buttonText && data.tutorAdvertBlock.buttonLink ? (
                <a href={data.tutorAdvertBlock.buttonLink} className="mt-4 inline-block px-4 h-10 rounded-lg bg-[#001A96] text-white text-sm font-medium">
                  {data.tutorAdvertBlock.buttonText}
                </a>
              ) : null}
            </div>
          ) : null}

          {data.resourceLinks && data.resourceLinks.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 p-5">
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {data.resourceLinks.map((l, idx) => (
                  <li key={idx}>
                    <a className="text-[#001A96] underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.sidebarLinks && data.sidebarLinks.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 p-5">
              <h3 className="text-lg font-medium">Links</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {data.sidebarLinks.map((l, idx) => (
                  <li key={idx}>
                    <a className="text-[#001A96] underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </main>
  );
}


