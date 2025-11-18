import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

export interface PostTutorMidSectionData {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: any;
  image?: any;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
}

export default function PostTutorMidSection({
  data,
}: {
  data: PostTutorMidSectionData;
}) {
  if (!data || data.enabled === false) return null;

  const bg = data.backgroundColor || "#ffffff";

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(data.subtitle || data.title) && (
          <div className="mb-6 md:mb-8">
            {data.subtitle ? (
              <p className="text-sm md:text-base text-[#FF6B00] font-medium font-gilroy">
                {data.subtitle}
              </p>
            ) : null}
            {data.title ? (
              <h2 className="mt-2 text-2xl md:text-3xl font-medium leading-[130%] text-[#171D23] font-gilroy">
                {data.title}
              </h2>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="order-2 md:order-1">
            {data.description ? (
              <p className="text-[#171D23] font-gilroy font-light leading-[160%] text-base md:text-lg mb-4">
                {data.description}
              </p>
            ) : null}
            {data.content ? (
              <div className="prose prose-sm md:prose-base max-w-none text-[#171D23]">
                <PortableText value={data.content} />
              </div>
            ) : null}

            {data.ctaText && data.ctaLink ? (
              <div className="mt-6">
                <a
                  href={data.ctaLink}
                  className="inline-block rounded-md bg-[#001A96] text-white px-5 py-3 text-sm md:text-base font-medium"
                >
                  {data.ctaText}
                </a>
              </div>
            ) : null}
          </div>

          <div className="order-1 md:order-2">
            {data.image ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={urlFor(data.image).width(1200).height(900).url()}
                  alt={data.title || "Section image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}


