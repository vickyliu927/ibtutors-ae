"use client";
import React, { useState, useEffect, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export interface TutorCardData {
  _id: string;
  name: string;
  professionalTitle?: string;
  experience: string;
  profilePhoto: any;
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  hireButtonLink: string;
  rating?: number;
  activeStudents?: number;
  price?: {
    amount: number;
    currency: string;
    displayText?: string;
  };
}

interface TutorCardProps {
  tutor: TutorCardData;
}

// Star Icon Component
const StarIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
      fill="#FCBD00"
    />
  </svg>
);

// People Icon Component
const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 7.125C4 6.03098 4.4346 4.98177 5.20818 4.20818C5.98177 3.4346 7.03098 3 8.125 3C9.21902 3 10.2682 3.4346 11.0418 4.20818C11.8154 4.98177 12.25 6.03098 12.25 7.125C12.25 8.21902 11.8154 9.26823 11.0418 10.0418C10.2682 10.8154 9.21902 11.25 8.125 11.25C7.03098 11.25 5.98177 10.8154 5.20818 10.0418C4.4346 9.26823 4 8.21902 4 7.125ZM13.75 9.375C13.75 8.93179 13.8373 8.49292 14.0069 8.08344C14.1765 7.67397 14.4251 7.30191 14.7385 6.98851C15.0519 6.67512 15.424 6.42652 15.8334 6.25691C16.2429 6.0873 16.6818 6 17.125 6C17.5682 6 18.0071 6.0873 18.4166 6.25691C18.826 6.42652 19.1981 6.67512 19.5115 6.98851C19.8249 7.30191 20.0735 7.67397 20.2431 8.08344C20.4127 8.49292 20.5 8.93179 20.5 9.375C20.5 10.2701 20.1444 11.1285 19.5115 11.7615C18.8786 12.3944 18.0201 12.75 17.125 12.75C16.2299 12.75 15.3715 12.3944 14.7385 11.7615C14.1056 11.1285 13.75 10.2701 13.75 9.375ZM1 19.875C1 17.9853 1.75067 16.1731 3.08686 14.8369C4.42306 13.5007 6.23533 12.75 8.125 12.75C10.0147 12.75 11.8269 13.5007 13.1631 14.8369C14.4993 16.1731 15.25 17.9853 15.25 19.875V19.878L15.249 19.997C15.2469 20.1242 15.2125 20.2487 15.1489 20.3589C15.0854 20.4691 14.995 20.5614 14.886 20.627C12.8452 21.856 10.5073 22.5036 8.125 22.5C5.653 22.5 3.339 21.816 1.365 20.627C1.25585 20.5615 1.16517 20.4693 1.10149 20.3591C1.03781 20.2489 1.00323 20.1243 1.001 19.997L1 19.875ZM16.75 19.878L16.749 20.022C16.7434 20.3553 16.6638 20.6832 16.516 20.982C18.2617 21.0897 20.0054 20.7416 21.576 19.972C21.6975 19.9126 21.8006 19.8215 21.8745 19.7083C21.9485 19.5951 21.9904 19.4641 21.996 19.329C22.0313 18.4902 21.8494 17.6566 21.4679 16.9088C21.0864 16.1609 20.5183 15.5243 19.8185 15.0605C19.1188 14.5967 18.3111 14.3215 17.4738 14.2615C16.6364 14.2015 15.7977 14.3587 15.039 14.718C16.1522 16.2066 16.7522 18.0162 16.749 19.875L16.75 19.878Z"
      fill="#4053B0"
    />
  </svg>
);

const TutorCard = ({ tutor }: TutorCardProps) => {
  const [nameFontSize, setNameFontSize] = useState(22);
  const [titleFontSize, setTitleFontSize] = useState(15);
  const [iconSize, setIconSize] = useState(24);
  const [headerPadding, setHeaderPadding] = useState(16);
  const [currentScreenWidth, setCurrentScreenWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  ); // Initialize with actual screen width

  // Ratings row font sizes
  const [ratingFontSize, setRatingFontSize] = useState(18);
  const [studentsFontSize, setStudentsFontSize] = useState(14);
  const [priceFontSize, setPriceFontSize] = useState(18);
  const [priceSmallFontSize, setPriceSmallFontSize] = useState(12);

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const ratingsRowRef = useRef<HTMLDivElement>(null);

  const rating = tutor.rating || 4.9;
  const studentCount = tutor.activeStudents || 100;
  const price = tutor.price || { amount: 200, currency: "AED" };

  useEffect(() => {
    // Get current screen width
    const screenWidth = window.innerWidth;

    // Reset to defaults when screen width changes significantly (more than 20px difference)
    if (Math.abs(screenWidth - currentScreenWidth) > 20) {
      console.log(`${tutor.name}: Screen width changed from ${currentScreenWidth} to ${screenWidth}, resetting fonts`);
      setNameFontSize(22);
      setTitleFontSize(15);
      setIconSize(24);
      setHeaderPadding(16);
      // Reset ratings row font sizes
      setRatingFontSize(18);
      setStudentsFontSize(14);
      setPriceFontSize(18);
      setPriceSmallFontSize(12);
      setCurrentScreenWidth(screenWidth);
    }

    let isActive = true;
    let adjustmentInProgress = false;

    const ensureSquareAndNoGaps = () => {
      if (!isActive || !cardRef.current || !headerRef.current) return;

      // Calculate required square image size (40% of card width)
      const cardWidth = cardRef.current.offsetWidth;
      const imageSize = cardWidth * 0.4;

      // Set header height to EXACTLY match the square image size
      headerRef.current.style.height = `${imageSize}px`;
      headerRef.current.style.minHeight = `${imageSize}px`;

      console.log(`${tutor.name} square setup (${screenWidth}px screen):`, {
        cardWidth: cardWidth.toFixed(1),
        imageSize: imageSize.toFixed(1),
        headerHeight: `${imageSize}px (exact match)`
      });
    };

    const checkRatingsRowFit = () => {
      if (!isActive || !ratingsRowRef.current) return;

      const ratingsRow = ratingsRowRef.current;
      const isOverflowing = ratingsRow.scrollWidth > ratingsRow.clientWidth;

      if (isOverflowing) {
        console.log(`${tutor.name}: Ratings row overflowing, reducing font sizes`);
        
        // Reduce font sizes by 1px
        setRatingFontSize(prev => Math.max(prev - 1, 12));
        setStudentsFontSize(prev => Math.max(prev - 1, 10));
        setPriceFontSize(prev => Math.max(prev - 1, 12));
        setPriceSmallFontSize(prev => Math.max(prev - 1, 8));

        // Check again after state update
        setTimeout(() => {
          if (isActive) checkRatingsRowFit();
        }, 100);
      }
    };

    const checkAndAdjust = () => {
      if (!isActive || adjustmentInProgress) {
        return;
      }

      if (!cardRef.current || !headerRef.current || !imageContainerRef.current) {
        return;
      }

      try {
        // First ensure square setup
        ensureSquareAndNoGaps();

        // Get current state values directly (avoid stale closures)
        const currentNameSize = nameFontSize;
        const currentTitleSize = titleFontSize;
        const currentIconSize = iconSize;
        const currentPadding = headerPadding;
        const screenWidth = window.innerWidth; // Get screen width inside checkAndAdjust

        const cardRect = cardRef.current.getBoundingClientRect();
        const headerRect = headerRef.current.getBoundingClientRect();
        const imageContainerRect = imageContainerRef.current.getBoundingClientRect();

        const cardWidth = cardRef.current.offsetWidth;
        const expectedImageSize = cardWidth * 0.4;

        // Calculate gaps
        const topGap = imageContainerRect.top - cardRect.top;
        const bottomGap = Math.abs(imageContainerRect.bottom - headerRect.bottom);

        // Check for title text crossing divider line
        let titleCrossesLine = false;
        if (titleRef.current) {
          const titleRect = titleRef.current.getBoundingClientRect();
          const dividerLineY = headerRect.bottom;
          titleCrossesLine = titleRect.bottom > dividerLineY + 2; // 2px tolerance
        }

        // AGGRESSIVE gap detection - any visible gap triggers reduction
        const hasTopGap = topGap > 1; // Very sensitive - any gap > 1px
        const imageTooTall = expectedImageSize > headerRect.height;

        console.log(`${tutor.name} gap check (${screenWidth}px screen):`, {
          topGap: topGap.toFixed(1),
          bottomGap: bottomGap.toFixed(1),
          hasTopGap,
          imageTooTall,
          titleCrossesLine,
          imageHeight: imageContainerRect.height.toFixed(1),
          headerHeight: headerRect.height.toFixed(1),
          currentSizes: { currentNameSize, currentTitleSize, currentIconSize, currentPadding }
        });

        // Trigger reduction for ANY issue
        if (hasTopGap || imageTooTall || titleCrossesLine) {
          adjustmentInProgress = true;

          // PRIORITY 1: Fix title crossing divider line (most critical for narrow screens)
          if (titleCrossesLine && currentTitleSize > 11) {
            console.log(`${tutor.name} (${screenWidth}px): Title crossing divider! Reducing title from ${currentTitleSize} to ${currentTitleSize - 2}`);
            setTitleFontSize(currentTitleSize - 2);
          }
          // PRIORITY 2: Standard gap reduction (after title is fixed)
          else if (currentNameSize > 18) {
            console.log(`${tutor.name} (${screenWidth}px): Reducing name font from ${currentNameSize} to 18`);
            setNameFontSize(18);
          } else if (currentPadding > 12) {
            console.log(`${tutor.name} (${screenWidth}px): Reducing padding from ${currentPadding} to 12`);
            setHeaderPadding(12);
          } else if (currentNameSize > 15) {
            console.log(`${tutor.name} (${screenWidth}px): Further reducing name font from ${currentNameSize} to 15`);
            setNameFontSize(15);
          } else if (currentIconSize > 18) {
            console.log(`${tutor.name} (${screenWidth}px): Reducing icon from ${currentIconSize} to 18`);
            setIconSize(18);
          } else if (currentTitleSize > 13) {
            console.log(`${tutor.name} (${screenWidth}px): Reducing title from ${currentTitleSize} to 13`);
            setTitleFontSize(13);
          } else {
            console.log(`${tutor.name} (${screenWidth}px): No more reductions possible, issues may persist`);
          }

          // Wait for state update and layout, then check once more
          setTimeout(() => {
            adjustmentInProgress = false;
            if (isActive) {
              setTimeout(checkAndAdjust, 300); // Single recheck after adjustment
            }
          }, 200);
        } else {
          console.log(`${tutor.name} (${screenWidth}px): Perfect square alignment achieved`);
        }
      } catch (error) {
        console.error(`TutorCard error (${tutor.name}):`, error);
        adjustmentInProgress = false;
      }
    };

    // Ensure square setup happens immediately
    ensureSquareAndNoGaps();

    // Check for gaps after layout stabilizes
    const timeoutId = setTimeout(checkAndAdjust, 1000);

    // Earlier check to catch obvious gaps sooner
    const earlyTimeoutId = setTimeout(checkAndAdjust, 300);

    // Check ratings row fit after layout stabilizes
    const ratingsTimeoutId = setTimeout(checkRatingsRowFit, 1200);

    // Handle window resize to maintain square ratio AND re-optimize for new screen width
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;

      // If screen width changed significantly, reset and re-optimize
      if (Math.abs(newScreenWidth - currentScreenWidth) > 20) {
        console.log(`${tutor.name}: Resize detected - ${currentScreenWidth} to ${newScreenWidth}, will re-optimize`);
        setCurrentScreenWidth(newScreenWidth);

        // Reset to defaults for new screen width
        setNameFontSize(22);
        setTitleFontSize(15);
        setIconSize(24);
        setHeaderPadding(16);
        // Reset ratings row font sizes
        setRatingFontSize(18);
        setStudentsFontSize(14);
        setPriceFontSize(18);
        setPriceSmallFontSize(12);

        // Re-optimize after reset
        setTimeout(() => {
          ensureSquareAndNoGaps();
          setTimeout(checkAndAdjust, 200);
          setTimeout(checkRatingsRowFit, 400);
        }, 100);
      } else {
        // Minor resize - just maintain square ratio
        ensureSquareAndNoGaps();
        setTimeout(checkAndAdjust, 100);
        setTimeout(checkRatingsRowFit, 200);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      clearTimeout(earlyTimeoutId);
      clearTimeout(ratingsTimeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [tutor.name, tutor.professionalTitle, currentScreenWidth, ratingFontSize, studentsFontSize, priceFontSize, priceSmallFontSize]); // Include screen width and font sizes in dependencies

  // Dynamic Graduation Cap Icon Component
  const DynamicGraduationCapIcon = () => (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
        fill="#001A96"
      />
    </svg>
  );

  return (
    <>
      {/* Mobile Layout - Dynamic Responsive Design */}
      <div ref={cardRef} className="lg:hidden w-full max-w-[400px] mx-auto bg-white rounded-[20px] border border-[#E6E7ED] overflow-hidden shadow-sm">
        {/* Header Section - Photo and Name - Height controlled by JavaScript */}
        <div
          ref={headerRef}
          className="flex items-start relative"
        >
          {/* Profile Photo - Left Side - Perfect Square (40% width) */}
          <div
            ref={imageContainerRef}
            className="relative flex-shrink-0"
            style={{
              width: '40%',
              paddingBottom: '40%', // Creates perfect square based on card width
            }}
          >
            <div className="absolute inset-0 rounded-tl-[20px] overflow-hidden">
              {tutor.profilePhoto ? (
                <Image
                  src={urlFor(tutor.profilePhoto).width(280).height(280).url()}
                  alt={tutor.name}
                  fill
                  className="object-cover object-center"
                  sizes="40vw"
                  priority={true}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs sm:text-sm">No Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Title - Right Side - Takes remaining 60% */}
          <div
            className="flex-1 min-w-0 flex flex-col justify-center"
            style={{
              padding: headerPadding + 'px',
              paddingBottom: Math.max(headerPadding - 1, 12) + 'px'
            }}
          >
            <h3
              className="font-medium leading-[120%] font-gilroy text-[#171D23] mb-3 sm:mb-4 break-words"
              style={{ fontSize: nameFontSize + 'px', fontWeight: 500 }}
            >
              {tutor.name}
            </h3>

            <div className="flex items-start gap-2 mb-2">
              <div className="flex-shrink-0 mt-1">
                <DynamicGraduationCapIcon />
              </div>
              <span
                ref={titleRef}
                className="font-normal leading-[140%] font-gilroy text-[#171D23] break-words"
                style={{ fontSize: titleFontSize + 'px', fontWeight: 200 }}
              >
                {tutor.professionalTitle || "IB Maths Tutor | University of Amsterdam"}
              </span>
            </div>

          </div>
        </div>

        {/* Divider Line - Full width to intersect with borders */}
        <div className="w-full h-[1px] bg-[#E6E7ED]"></div>

        {/* Rating and Students Section - Same row, even spacing */}
        <div ref={ratingsRowRef} className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <StarIcon />
            <span className="font-medium leading-[140%] font-gilroy text-[#171D23]" style={{ fontSize: `${ratingFontSize}px` }}>
              {rating}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <PeopleIcon />
            <span className="font-light leading-[140%] font-gilroy text-[#171D23]" style={{ fontSize: `${studentsFontSize}px` }}>
              {studentCount}+ students
            </span>
          </div>

          {/* Price Tag for mobile */}
          <div className="text-[#171D23] font-gilroy leading-[120%] flex-shrink-0" style={{ fontSize: `${priceFontSize}px`, fontWeight: 500 }}>
            <span style={{ fontSize: `${priceSmallFontSize}px`, fontWeight: 500, color: "#8B8E91" }}>from</span>
            <span style={{ fontSize: `${priceFontSize}px`, fontWeight: 500, color: "#171D23" }}> {price.currency} {price.amount}</span>
            <span style={{ fontSize: `${priceSmallFontSize}px`, fontWeight: 500, color: "#8B8E91" }}>/h</span>
          </div>
        </div>

        {/* Divider Line - Full width to intersect with borders */}
        <div className="w-full h-[1px] bg-[#E6E7ED]"></div>

        {/* Bio Section - Increased spacing and 16px font size */}
        <div className="px-4 sm:px-6 py-5 sm:py-7">
          <p className="text-[16px] leading-[150%] font-gilroy text-[#171D23]" style={{ fontWeight: 200 }}>
            {tutor.experience}
          </p>
        </div>

        {/* Divider Line - Full width to intersect with borders */}
        <div className="w-full h-[1px] bg-[#E6E7ED]"></div>

        {/* Teaches Section - Increased spacing */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <span className="text-[16px] font-medium leading-[140%] font-gilroy text-[#171D23]">
            Teaches: <span className="text-[#001A96] font-medium">{tutor.specialization.mainSubject}</span>
          </span>
        </div>

        {/* Full-Width Button */}
        <Link
          href={tutor.hireButtonLink || "/#contact-form"}
          className="block w-full bg-[#001A96] text-white text-center text-[16px] sm:text-[18px] font-medium leading-[140%] font-gilroy py-3 sm:py-4 hover:bg-[#001A96]/90 transition-colors rounded-b-[20px]"
        >
          Hire a Tutor
        </Link>
      </div>

      {/* Desktop Layout - Original Design Completely Unchanged */}
      <div className="hidden lg:flex items-center border border-[#E6E7ED] bg-white relative w-full" style={{ maxWidth: "1320px", width: "100%", height: "280px", borderRadius: "20px" }}>
        {/* Left side - Tutor Image */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "280px", height: "280px", borderRadius: "20px 0px 0px 20px" }}>
        {tutor.profilePhoto ? (
          <Image
            src={urlFor(tutor.profilePhoto).width(560).height(560).url()}
            alt={tutor.name}
            fill
            className="object-cover object-center"
            sizes="280px"
            priority={true}
          />
        ) : (
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/84ed7e54bec2d65e3b797735f59c65b58fa4d025?width=560"
            alt={tutor.name}
            fill
            className="object-cover object-center"
            sizes="280px"
            priority={true}
          />
        )}
      </div>

      {/* Right side - Info Panel */}
      <div className="flex flex-col justify-between items-start flex-1 h-full">
        {/* Top section - Name, Rating, Students */}
          <div className="flex flex-col items-start gap-3 self-stretch" style={{ padding: "24px 32px 0px 32px" }}>
          {/* Name Row */}
          <div className="flex justify-between items-center self-stretch">
            <div className="flex items-center gap-8">
              {/* Name */}
                <div className="text-[#171D23] font-gilroy font-medium leading-[120%]" style={{ width: "160px", fontSize: "24px", fontWeight: 500 }}>
                {tutor.name}
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                  <svg width="131" height="23" viewBox="0 0 131 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex items-center gap-2">
                    {[...Array(5)].map((_, index) => (
                      <path
                        key={index}
                        d="M9 2.125L11.0206 8.34385H17.5595L12.2694 12.1873L14.2901 18.4062L9 14.5627L3.70993 18.4062L5.73056 12.1873L0.440492 8.34385H6.97937L9 2.125Z"
                        fill="#FCBD00"
                        transform={"translate(" + (index * 21) + ", 0.75)"}
                      />
                    ))}
                    <text fill="#171D23" style={{ fontSize: "16px", fontWeight: 500, fontFamily: "Gilroy, -apple-system, Roboto, Helvetica, sans-serif" }} x="110" y="16.964">
                    {rating}
                  </text>
                </svg>
              </div>

              {/* Students Count */}
              <div className="flex items-center gap-1.5">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M4 7.125C4 6.03098 4.4346 4.98177 5.20818 4.20818C5.98177 3.4346 7.03098 3 8.125 3C9.21902 3 10.2682 3.4346 11.0418 4.20818C11.8154 4.98177 12.25 6.03098 12.25 7.125C12.25 8.21902 11.8154 9.26823 11.0418 10.0418C10.2682 10.8154 9.21902 11.25 8.125 11.25C7.03098 11.25 5.98177 10.8154 5.20818 10.0418C4.4346 9.26823 4 8.21902 4 7.125ZM13.75 9.375C13.75 8.93179 13.8373 8.49292 14.0069 8.08344C14.1765 7.67397 14.4251 7.30191 14.7385 6.98851C15.0519 6.67512 15.424 6.42652 15.8334 6.25691C16.2429 6.0873 16.6818 6 17.125 6C17.5682 6 18.0071 6.0873 18.4166 6.25691C18.826 6.42652 19.1981 6.67512 19.5115 6.98851C19.8249 7.30191 20.0735 7.67397 20.2431 8.08344C20.4127 8.49292 20.5 8.93179 20.5 9.375C20.5 10.2701 20.1444 11.1285 19.5115 11.7615C18.8786 12.3944 18.0201 12.75 17.125 12.75C16.2299 12.75 15.3715 12.3944 14.7385 11.7615C14.1056 11.1285 13.75 10.2701 13.75 9.375ZM1 19.875C1 17.9853 1.75067 16.1731 3.08686 14.8369C4.42306 13.5007 6.23533 12.75 8.125 12.75C10.0147 12.75 11.8269 13.5007 13.1631 14.8369C14.4993 16.1731 15.25 17.9853 15.25 19.875V19.878L15.249 19.997C15.2469 20.1242 15.2125 20.2487 15.1489 20.3589C15.0854 20.4691 14.995 20.5614 14.886 20.627C12.8452 21.856 10.5073 22.5036 8.125 22.5C5.653 22.5 3.339 21.816 1.365 20.627C1.25585 20.5615 1.16517 20.4693 1.10149 20.3591C1.03781 20.2489 1.00323 20.1243 1.001 19.997L1 19.875ZM16.75 19.878L16.749 20.022C16.7434 20.3553 16.6638 20.6832 16.516 20.982C18.2617 21.0897 20.0054 20.7416 21.576 19.972C21.6975 19.9126 21.8006 19.8215 21.8745 19.7083C21.9485 19.5951 21.9904 19.4641 21.996 19.329C22.0313 18.4902 21.8494 17.6566 21.4679 16.9088C21.0864 16.1609 20.5183 15.5243 19.8185 15.0605C19.1188 14.5967 18.3111 14.3215 17.4738 14.2615C16.6364 14.2015 15.7977 14.3587 15.039 14.718C16.1522 16.2066 16.7522 18.0162 16.749 19.875L16.75 19.878Z" fill="#4053B0" />
                </svg>
                  <div className="text-[#171D23] font-gilroy font-light leading-[140%]" style={{ fontSize: "16px", fontWeight: 400 }}>
                  {studentCount}+ students
                  </div>
              </div>
            </div>

            {/* Price Tag */}
            <div className="text-[#171D23] font-gilroy leading-[120%]" style={{ fontSize: "22px", fontWeight: 500 }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#8B8E91" }}>from</span>
              <span style={{ fontSize: "22px", fontWeight: 500, color: "#171D23" }}> {price.currency} {price.amount}</span>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#8B8E91" }}>/h</span>
            </div>
          </div>

          {/* University Info */}
          <div className="flex items-center gap-3 self-stretch">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g clipPath="url(#clip0_14183_13882)">
                  <path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#F57C40" />
              </g>
              <defs>
                <clipPath id="clip0_14183_13882">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
              <div className="flex-1 text-[#171D23] font-gilroy font-medium leading-[120%]" style={{ fontSize: "16px", fontWeight: 400 }}>
                {tutor.professionalTitle || "IB Maths Tutor | University of Amsterdam"}
              </div>
          </div>

          {/* Description */}
            <div className="self-stretch text-[#171D23] font-gilroy font-light leading-[140%]" style={{ fontSize: "16px", fontWeight: 300 }}>
            {tutor.experience}
          </div>
        </div>

        {/* Bottom section - Tags and Button */}
          <div className="flex justify-between items-end gap-4 self-stretch">
          {/* Tags section */}
            <div className="flex items-start content-start gap-2 flex-1 self-stretch flex-wrap" style={{ padding: "8px 0px 24px 32px" }}>
              <div className="flex flex-col justify-center text-[#171D23] text-center font-gilroy font-semibold leading-[140%]" style={{ width: "57px", height: "28px", fontSize: "14px", fontWeight: 600 }}>
              Teaches:
            </div>
              <div className="flex justify-center items-center gap-2.5 bg-[#FBFCFD] px-2 py-1.5" style={{ height: "28px", borderRadius: "8px" }}>
                <div className="text-center font-gilroy font-medium leading-[140%]" style={{ color: "#001A96", fontSize: "14px", fontWeight: 500 }}>
                {tutor.specialization.mainSubject}
                </div>
            </div>
          </div>

          {/* Hire Button */}
          <Link
            href={tutor.hireButtonLink || "/#contact-form"}
              className="flex justify-center items-center bg-[#001A96] text-white text-center font-gilroy font-normal leading-[140%] transition-all hover:bg-blue-800"
              style={{ padding: "16px 36px", borderRadius: "16px 0px 20px 0px", fontSize: "16px", fontWeight: 400, marginBottom: "0px" }}
          >
            Hire a Tutor
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default TutorCard;
