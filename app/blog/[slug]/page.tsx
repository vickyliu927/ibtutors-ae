import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import { getBlogPostBySlug } from '../../lib/getBlogData';

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

  // Build table of contents from PortableText blocks (h2/h3 only)
  const headings: { id: string; text: string; level: number }[] = [];
  const slugify = (input: string) =>
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  // Derive ids while preserving order
  let autoIdCounter = 0;
  (data.body || []).forEach((block: any) => {
    if (block?._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
      const text = (block.children || []).map((c: any) => c.text).join('');
      if (!text) return;
      const base = slugify(text);
      const id = base || `section-${++autoIdCounter}`;
      headings.push({ id, text, level: block.style === 'h2' ? 2 : 3 });
    }
  });

  const portableComponents = {
    block: {
      h2: ({ children }: { children: React.ReactNode }) => {
        const text = String(children as any);
        const id = slugify(text) || `section-${++autoIdCounter}`;
        return (
          <h2 id={id} className="scroll-mt-24 text-[24px] sm:text-[28px] font-semibold text-[#171D23] mt-10">{children}</h2>
        );
      },
      h3: ({ children }: { children: React.ReactNode }) => {
        const text = String(children as any);
        const id = slugify(text) || `section-${++autoIdCounter}`;
        return (
          <h3 id={id} className="scroll-mt-24 text-[20px] sm:text-[22px] font-semibold text-[#171D23] mt-8">{children}</h3>
        );
      },
    },
    marks: {
      link: ({ value, children }: { value: { href?: string }; children: React.ReactNode }) => {
        const href = value?.href || '#';
        return (
          <a href={href} className="text-[#001A96] underline hover:opacity-80" target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {children}
          </a>
        );
      },
    },
  } as const;

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section
        className="w-full relative"
        style={{
          background:
            'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
          <div className="mb-6 text-sm">
            <Link href="/blog" className="text-[#001A96] hover:underline">Blog</Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Article</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
            <div className="aspect-[16/10] w-full bg-gray-100 rounded-2xl overflow-hidden relative">
              {data.mainImage ? (
                <Image
                  src={urlFor(data.mainImage).width(1200).height(750).url()}
                  alt={data.imageAlt || data.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={true}
                />
              ) : null}
            </div>
            <div>
              <h1 className="text-[36px] sm:text-[44px] leading-[120%] font-medium text-[#171D23]">{data.title}</h1>
              {data.intro ? (
                <p className="mt-4 text-lg sm:text-xl text-[#171D23] font-light leading-[160%]">{data.intro}</p>
              ) : null}
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
                {data.author?.avatar ? (
                  <span className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={urlFor(data.author.avatar).width(80).height(80).url()}
                      alt={data.author?.name || 'Author'}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                ) : null}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {data.readingTime ? (
                    <span className="text-[#171D23]">{data.readingTime} min Read</span>
                  ) : null}
                  {data.author?.name ? (
                    <span className="text-[#171D23]">Written by: <span className="font-medium">{data.author.name}</span></span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY WITH SIDEBARS */}
      <article className="max-w-[1320px] mx-auto px-4 pt-24 sm:pt-28 pb-44 lg:pb-52 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px] gap-8 lg:gap-10 bg-white">
        {/* Contents sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <h3 className="text-base font-semibold text-[#171D23] mb-3">Contents</h3>
            <nav className="space-y-2 text-sm">
              {headings.length === 0 ? (
                <div className="text-gray-500">No sections</div>
              ) : (
                headings.map((h) => (
                  <div key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a href={`#${h.id}`} className="text-[#001A96] hover:underline">
                      {h.text}
                    </a>
                  </div>
                ))
              )}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div>
          <div className="prose max-w-none mt-0 lg:pr-8">
            <PortableText value={data.body || []} components={portableComponents as any} />
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

        {/* Right Sidebar */}
        <aside className="lg:pt-8">
          {data.tutorAdvertBlock ? (
            <div className="rounded-2xl border border-gray-200 p-6 sticky top-28 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-[22px] font-semibold text-[#171D23]">{data.tutorAdvertBlock.title || 'Need help from an expert?'}</h3>
              {/* Ratings line */}
              <div className="mt-2 flex items-center gap-2 text-[14px] text-[#171D23]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M12 2l2.95 6.06L22 9.27l-5 4.87L18.9 22 12 18.56 5.1 22 7 14.14 2 9.27l7.05-1.21L12 2z"/>
                </svg>
                <span><span className="font-medium">4.93/5</span> based on <span className="font-medium">733 reviews</span> in</span>
                <span className="text-[16px] leading-none">🇬🇧</span>
              </div>
              <div className="mt-2 text-[14px] text-[#565C62]">{data.tutorAdvertBlock.description || 'The world’s top online tutoring provider trusted by students, parents, and schools globally.'}</div>

              {/* Tutors list */}
              {data.tutorAdvertBlock.tutors && data.tutorAdvertBlock.tutors.length > 0 ? (
                <div className="mt-6 space-y-6">
                  {data.tutorAdvertBlock.tutors.map((t, idx) => (
                    <div key={t._id || idx} className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {t.profilePhoto ? (
                          <Image
                            src={urlFor(t.profilePhoto).width(180).height(180).url()}
                            alt={t.name || 'Tutor'}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : null}
                      </div>
                    <div className="min-w-0">
                      <div className="text-[22px] font-semibold text-[#171D23] leading-tight truncate">{t.name || 'Expert Tutor'}</div>
                      {t.professionalTitle ? (
                        <div className="text-[14px] text-[#565C62] leading-tight line-clamp-2">{t.professionalTitle}</div>
                      ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {data.tutorAdvertBlock.buttonText && data.tutorAdvertBlock.buttonLink ? (
                <a href={data.tutorAdvertBlock.buttonLink} className="mt-8 inline-flex w-full items-center justify-center h-12 rounded-full bg-[#001A96] text-white text-sm font-medium">
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

      {/* Additional Information Block - full-width section under sidebars */}
      {data.additionalDescription || data.additionalDescriptionTitle ? (
        <section className="max-w-[1200px] mx-auto px-4 pb-44 lg:pb-52">
          <div className="rounded-3xl border border-gray-200 bg-[#F7F8FD]/60 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              {data.additionalDescriptionTitle ? (
                <h3 className="text-[22px] font-semibold text-[#171D23]">{data.additionalDescriptionTitle}</h3>
              ) : null}
              {data.additionalDescription ? (
                <p className="mt-4 text-[14px] leading-[170%] text-[#171D23] font-light">{data.additionalDescription}</p>
              ) : null}
            </div>
            {/* Static tutor card (hardcoded image and bio) */}
            <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src="/images/blog-static-tutor.jpg"
                    alt="Featured Tutor"
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority={false}
                  />
                  <a href="/hire-a-tutor" className="absolute bottom-0 right-0 w-9 h-9 bg-[#001A96] text-white flex items-center justify-center rounded-tl-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
                <div className="min-w-0">
                  <div className="text-[22px] font-semibold text-[#171D23] leading-tight">Charlie</div>
                  <div className="text-[14px] text-[#565C62] leading-snug">Professional tutor and Cambridge University researcher</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}


