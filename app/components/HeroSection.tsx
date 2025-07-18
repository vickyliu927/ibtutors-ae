'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

export interface HeroData {
  titleFirstRow: string;
  titleSecondRow: string;
  subtitle: string;
  mainImage: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  primaryButton: {
    text: string;
    link: string;
  };
  features?: string[];
  rating: {
    score: string;
    basedOnText: string;
    reviewCount: string;
  };
}

const StarIcon = () => (
  <svg
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
      fill="#FCBD00"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.2025 18.9998C11.1476 18.9998 11.0932 18.9885 11.0429 18.9664C10.9926 18.9444 10.9473 18.9122 10.91 18.8719L3.02379 10.3412C2.97122 10.2843 2.93637 10.2134 2.9235 10.137C2.91064 10.0606 2.92031 9.98216 2.95135 9.9112C2.98239 9.84025 3.03344 9.77988 3.09825 9.73748C3.16307 9.69509 3.23883 9.67251 3.31628 9.6725H7.11229C7.16928 9.67251 7.22561 9.68474 7.27747 9.70837C7.32934 9.73201 7.37553 9.76648 7.41294 9.80949L10.0486 12.8417C10.3334 12.2328 10.8848 11.219 11.8524 9.98363C13.2828 8.15733 15.9436 5.47141 20.4957 3.04674C20.5837 2.99989 20.6861 2.98773 20.7826 3.01266C20.8791 3.0376 20.9628 3.09781 21.017 3.18142C21.0713 3.26503 21.0923 3.36595 21.0758 3.46426C21.0593 3.56257 21.0065 3.65112 20.9279 3.71242C20.9105 3.726 19.1554 5.10818 17.1354 7.63987C15.2764 9.96965 12.8051 13.7792 11.5891 18.6973C11.5677 18.7837 11.518 18.8604 11.4479 18.9153C11.3779 18.9702 11.2914 19 11.2024 19L11.2025 18.9998Z"
      fill="#F57C40"
    />
  </svg>
);



const LoadingHero = () => (
  <div className="relative w-full h-[580px] animate-pulse" style={{
    background: "linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)",
  }}>
    <div className="max-w-[1440px] mx-auto px-4 h-full">
      <div className="absolute left-24 top-[120px] w-[560px] space-y-6">
        <div className="h-20 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded w-40"></div>
          <div className="h-6 bg-gray-200 rounded w-56"></div>
        </div>
      </div>
      <div className="absolute right-[133px] top-[30px] w-[538px] h-[550px] bg-gray-200 rounded hidden lg:block"></div>
    </div>
  </div>
);

const HeroSection = ({ heroData }: { heroData?: HeroData }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!heroData) {
    return <LoadingHero />;
  }

  return (
    <div
      className="relative w-full h-[640px] overflow-hidden"
      style={{
        background:
          "linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)",
      }}
    >
      {/* Background SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 0H1441V640H0V0Z" fill="url(#paint0_linear_13831_80828)" />
        <defs>
          <linearGradient
            id="paint0_linear_13831_80828"
            x1="0"
            y1="0"
            x2="1395.32"
            y2="727.609"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF6F3" />
            <stop offset="0.680707" stopColor="#F2F4FA" />
            <stop offset="1" stopColor="#F6F5FE" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 h-full">
        {/* Text Content - Moved upwards */}
        <div className="absolute left-24 top-[120px] w-[560px] h-[418px] flex flex-col items-start gap-12">
          {/* Heading Section */}
          <div className="flex w-[560px] flex-col items-start gap-4">
            {/* Title */}
            <h1 className="self-stretch text-[60px] font-medium leading-[120%] font-gilroy">
              <span className="text-[#171D23]">{heroData.titleFirstRow}</span>
              <br />
              <span className="text-[#001A96]">{heroData.titleSecondRow}</span>
            </h1>

            {/* Subtitle */}
            <p className="self-stretch text-[#171D23] text-lg font-light leading-[160%] font-gilroy">
              {heroData.subtitle}
            </p>
          </div>

          {/* Button and Rating Section */}
          <div className="flex items-center gap-6">
            {/* Button */}
            <Link
              href={heroData.primaryButton?.link || "#contact-form"}
              className="flex h-12 px-7 justify-center items-center rounded-[28px] bg-[#001A96] text-white text-center text-base font-medium leading-[140%] hover:bg-[#001A96]/90 transition-colors font-gilroy"
            >
              {heroData.primaryButton?.text || 'Hire a tutor'}
            </Link>

            {/* Rating */}
            <div className="flex flex-col items-start gap-1">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>

              {/* Rating Text */}
              <div className="flex items-center gap-2">
                <span className="text-[#0D2854] text-base font-light font-gilroy">
                  {heroData.rating?.score} {heroData.rating?.basedOnText}
                </span>
                <span className="text-[#171D23] text-base font-bold font-gilroy underline">
                  {heroData.rating?.reviewCount}
                </span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="flex w-[352px] flex-col items-start gap-2">
            {heroData.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                <CheckIcon />
                <span className="text-[#171D23] text-base font-light leading-[140%] font-gilroy">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image - Moved downwards */}
        <div className="absolute right-[133px] top-[90px] w-[538px] h-[550px] hidden lg:block">
          {heroData.mainImage && !imageError ? (
            <Image
              src={urlFor(heroData.mainImage).width(1076).height(1100).quality(95).url()}
              alt="Expert tutor helping student"
              width={538}
              height={550}
              className="w-full h-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImageError(true)}
              loading="eager"
              quality={95}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-center">
                {imageError ? "Failed to load image" : "Loading image..."}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Hero Image */}
        <div className="absolute right-4 top-[320px] w-full max-w-[300px] h-[250px] lg:hidden">
          {heroData.mainImage && !imageError ? (
            <Image
              src={urlFor(heroData.mainImage).width(600).height(500).quality(95).url()}
              alt="Expert tutor helping student"
              width={300}
              height={250}
              className="w-full h-full object-cover rounded-lg"
              priority
              sizes="(max-width: 768px) 100vw, 300px"
              onError={() => setImageError(true)}
              loading="eager"
              quality={95}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
              <span className="text-center text-sm">
                {imageError ? "Failed to load image" : "Loading image..."}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Text Content Adjustment */}
      <div className="lg:hidden">
        <div className="absolute left-4 top-[40px] w-[calc(100%-2rem)] max-w-[400px] flex flex-col items-start gap-6">
          {/* Mobile Title */}
          <h1 className="text-[36px] font-medium leading-[120%] font-gilroy">
            <span className="text-[#171D23]">{heroData.titleFirstRow}</span>
            <br />
            <span className="text-[#001A96]">{heroData.titleSecondRow}</span>
          </h1>

          {/* Mobile Subtitle */}
          <p className="text-[#171D23] text-base font-light leading-[160%] font-gilroy">
            {heroData.subtitle}
          </p>

          {/* Mobile Button and Rating */}
          <div className="flex flex-col gap-4">
            <Link
              href={heroData.primaryButton?.link || "#contact-form"}
              className="flex h-12 px-6 justify-center items-center rounded-[28px] bg-[#001A96] text-white text-center text-base font-medium leading-[140%] hover:bg-[#001A96]/90 transition-colors font-gilroy w-fit"
            >
              {heroData.primaryButton?.text || 'Hire a tutor'}
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
              <span className="text-[#0D2854] text-sm font-light font-gilroy">
                {heroData.rating?.score} (<span className="font-bold underline">{heroData.rating?.reviewCount}</span>)
              </span>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="flex flex-col gap-2">
            {heroData.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckIcon />
                <span className="text-[#171D23] text-sm font-light leading-[140%] font-gilroy">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 