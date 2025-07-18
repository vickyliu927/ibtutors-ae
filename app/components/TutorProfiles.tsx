"use client";
import React, { useState, useRef, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import ExternalLink from "./ui/ExternalLink";
import TutorCard, { TutorCardData } from "./TutorCard";

export interface TutorData {
  _id: string;
  name: string;
  professionalTitle?: string;
  priceTag?: {
    enabled: boolean;
    badgeText: string;
  };
  experience: string;
  profilePhoto: any;
  specialization: {
    mainSubject: string;
    additionalSubjects?: string[];
  };
  hireButtonLink: string;
  displayOrder?: number;
  profilePDF?: {
    asset: {
      url: string;
    };
  };
  price?: {
    amount: number;
    currency: string;
    displayText?: string;
  };
  rating?: number;
  reviewCount?: number;
  activeStudents?: number;
  totalLessons?: number;
  languagesSpoken?: {
    language: string;
    proficiency: string;
  }[];
}

interface TutorProfilesProps {
  tutors?: TutorData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  useNewCardDesign?: boolean;
}

// Maximum number of additional subjects to display before showing a "+X more" button
const MAX_VISIBLE_SUBJECTS = 3;

const TutorProfiles = ({
  tutors,
  sectionTitle = "",
  sectionSubtitle,
  ctaText,
  ctaLink,
  useNewCardDesign = false,
}: TutorProfilesProps) => {
  // State to track which tutors have expanded subject lists
  const [expandedSubjects, setExpandedSubjects] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle expanded state for a specific tutor
  const toggleExpandSubjects = (tutorId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [tutorId]: !prev[tutorId],
    }));
  };

  // Function to process subtitle text with bold formatting
  const processSubtitleText = (text: string) => {
    if (!text) return [];

    // Split by newlines first
    return text.split("\n").map((line) => {
      // Process bold formatting within each line
      const segments: { text: string; bold: boolean }[] = [];
      let currentText = "";
      let inBold = false;
      let i = 0;

      while (i < line.length) {
        // Check for bold marker (*)
        if (line[i] === "*") {
          // Add current text segment
          if (currentText) {
            segments.push({ text: currentText, bold: inBold });
            currentText = "";
          }
          // Toggle bold state
          inBold = !inBold;
          i++;
        } else {
          currentText += line[i];
          i++;
        }
      }

      // Add any remaining text
      if (currentText) {
        segments.push({ text: currentText, bold: inBold });
      }

      return segments;
    });
  };

  if (!tutors) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section matching Figma design */}
          <div className="flex flex-col items-start gap-6 mb-8">
            <div className="flex flex-col items-start gap-3">
              <div className="text-lg font-normal leading-[160%] uppercase text-[#F57C40] font-gilroy">
                Trusted by 15,000+ students across Dubai and globally.
              </div>
              <h2 className="text-[36px] font-medium leading-[140%] text-[#171D23] font-gilroy">
                Our Qualified Dubai Teachers and Examiners
              </h2>
            </div>
            <div className="text-lg leading-[150%] text-[#171D23] font-gilroy max-w-[820px]">
              <span className="font-light">
                We have a team of expert online tutors at prices ranging from
                AED 140-390/hour.
              </span>
              <br />
              <span className="font-semibold">
                Contact us with your requirements and budget and we'll find the
                perfect tutor for you!
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2].map((index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-64 bg-gray-200"></div>
                  <div className="flex-1 p-6">
                    <div className="h-8 bg-gray-200 w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 w-2/3 mb-4"></div>
                    <div className="h-20 bg-gray-200 w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section matching Figma design */}
        <div className="flex flex-col items-start gap-6 mb-8">
          <div className="flex flex-col items-start gap-3">
            <div className="text-lg font-normal leading-[160%] uppercase text-[#F57C40] font-gilroy">
              Trusted by 15,000+ students across Dubai and globally.
            </div>
            <h2 className="text-[36px] font-medium leading-[140%] text-[#171D23] font-gilroy">
              Our Qualified Dubai Teachers and Examiners
            </h2>
          </div>
          <div className="text-lg leading-[150%] text-[#171D23] font-gilroy max-w-[820px]">
            <span className="font-light">
              We have a team of expert online tutors at prices ranging from AED
              140-390/hour.
            </span>
            <br />
            <span className="font-semibold">
              Contact us with your requirements and budget and we'll find the
              perfect tutor for you!
            </span>
          </div>
        </div>

        <div
          className={
            useNewCardDesign
              ? "space-y-6 flex flex-col items-center"
              : "space-y-4"
          }
        >
          {tutors.map((tutor) => {
            // If using new card design, render the new TutorCard component
            if (useNewCardDesign) {
              // Transform TutorData to TutorCardData
              const tutorCardData: TutorCardData = {
                _id: tutor._id,
                name: tutor.name,
                professionalTitle: tutor.professionalTitle,
                experience: tutor.experience,
                profilePhoto: tutor.profilePhoto,
                specialization: tutor.specialization,
                hireButtonLink: tutor.hireButtonLink,
                rating: tutor.rating,
                activeStudents: tutor.activeStudents,
              };

              return <TutorCard key={tutor._id} tutor={tutorCardData} />;
            }

            // Otherwise render the original complex card design
            return (
              <div
                key={tutor._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col"
                style={{ clipPath: "inset(0)" }}
              >
                {/* Mobile view (stacked) */}
                <div className="md:hidden overflow-hidden">
                  <div className="flex">
                    {/* Profile Image - Square format */}
                    <div
                      className="relative flex-shrink-0 w-[130px] h-[130px] overflow-hidden z-10"
                      style={{ width: "40%" }}
                      ref={(el) => {
                        if (el) {
                          const setSquare = () => {
                            el.style.height = `${el.offsetWidth}px`;
                          };
                          setSquare();
                          window.addEventListener("resize", setSquare);
                          // Clean up
                          return () =>
                            window.removeEventListener("resize", setSquare);
                        }
                      }}
                    >
                      {tutor.profilePhoto ? (
                        <Image
                          src={urlFor(tutor.profilePhoto)
                            .width(260)
                            .height(260)
                            .url()}
                          alt={`${tutor.name}`}
                          fill
                          className="object-cover object-center"
                          sizes="128px"
                          priority={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Tutor Basic Info - Right of image */}
                    <div className="flex-1 p-4 pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{tutor.name}</h3>
                        {tutor.priceTag?.enabled && (
                          <span
                            className="flex items-center text-orange-500 text-xs"
                            style={{ fontSize: "0.9rem" }}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                            {tutor.priceTag.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Professional Title & Education with graduation hat icon */}
                      {tutor.professionalTitle && (
                        <div className="flex items-center mt-2 mb-2">
                          <span className="flex-shrink-0 w-5 h-5 min-w-[20px] min-h-[20px] mr-2">
                            <svg
                              className="w-5 h-5 text-orange-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                            </svg>
                          </span>
                          <p
                            className="text-black font-medium"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {tutor.professionalTitle}
                          </p>
                        </div>
                      )}

                      {/* Add teaches/subjects section for mobile */}
                      <div className="flex flex-nowrap items-start gap-1 mb-1 overflow-hidden">
                        <p
                          className="font-medium text-gray-600 mr-1 whitespace-nowrap flex-shrink-0 mt-0.5"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Teaches:
                        </p>
                        <div className="flex flex-wrap gap-1 overflow-hidden">
                          <span
                            className={`text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md inline-flex ${
                              [
                                "IGCSE Business Studies",
                                "GCSE Computer Science",
                                "AP US History & World History",
                                "IB Business Management",
                                "A Level Further Maths",
                                "A Level Computer Science",
                                "A Level English Literature",
                                "A Level Business Studies",
                                "IGCSE Computer Science",
                                "GCSE Business Studies",
                                "AP Calculus AB BC",
                                "AP Macroeconomics & Microeconomics",
                                "AP Computer Science",
                                "AP English Language",
                                "AP English Literature",
                                "AP Macroeconomics & Microeconomics",
                              ].includes(tutor.specialization.mainSubject)
                                ? ""
                                : "whitespace-nowrap"
                            }`}
                            style={{ fontSize: "0.9rem" }}
                          >
                            {tutor.specialization.mainSubject}
                          </span>
                          {tutor.specialization.additionalSubjects &&
                            tutor.specialization.additionalSubjects
                              .slice(0, 1)
                              .map((subject, index) => (
                                <span
                                  key={index}
                                  className={`text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md ${
                                    [
                                      "IGCSE Business Studies",
                                      "GCSE Computer Science",
                                      "AP US History & World History",
                                      "IB Business Management",
                                      "A Level Further Maths",
                                      "A Level Computer Science",
                                      "A Level English Literature",
                                      "A Level Business Studies",
                                      "IGCSE Computer Science",
                                      "GCSE Business Studies",
                                      "AP Calculus AB BC",
                                      "AP Macroeconomics & Microeconomics",
                                      "AP Computer Science",
                                      "AP English Language",
                                      "AP English Literature",
                                      "AP Macroeconomics & Microeconomics",
                                    ].includes(subject)
                                      ? ""
                                      : "whitespace-nowrap"
                                  }`}
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {subject}
                                </span>
                              ))}
                          {tutor.specialization.additionalSubjects &&
                            tutor.specialization.additionalSubjects.length >
                              1 && (
                              <span
                                className="text-blue-600 font-medium whitespace-nowrap"
                                style={{ fontSize: "0.9rem" }}
                              >
                                +
                                {tutor.specialization.additionalSubjects.length}{" "}
                                more
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Rate info for mobile */}
                      {tutor.price && (
                        <div className="flex items-center mt-0">
                          <p
                            className="font-medium text-gray-600 whitespace-nowrap mr-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            Rate:
                          </p>
                          <p
                            className="text-blue-800 font-medium"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {tutor.price.displayText ||
                              `Starting from ${tutor.price.currency} ${tutor.price.amount}/hour`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio - Full width below image and info */}
                  <div className="px-2 pt-0 pb-0 mt-1 border-t border-gray-200">
                    <p className="text-black text-sm mb-0 mt-0 pt-1 pb-0 text-justify">
                      {tutor.experience}
                    </p>
                  </div>

                  {/* Hire button for mobile - Check if stats exist to determine layout */}
                  {tutor.rating ||
                  tutor.activeStudents ||
                  tutor.totalLessons ||
                  (tutor.languagesSpoken &&
                    tutor.languagesSpoken.length > 0) ? (
                    <div className="mt-3 border-t border-gray-200 flex">
                      {/* Highlights and Languages - 50% width box */}
                      <div className="w-1/2 p-2">
                        {/* Tutor stats - Mobile */}
                        <div className="flex flex-wrap">
                          {/* First row */}
                          <div className="flex w-full mb-1.5">
                            {/* Rating */}
                            {tutor.rating && (
                              <div className="flex items-center mr-2 w-1/2">
                                <svg
                                  className="w-3.5 h-3.5 text-yellow-500 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span
                                  className="font-medium"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {tutor.rating}
                                </span>
                                {tutor.reviewCount && (
                                  <span
                                    className="text-gray-600 ml-1"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    ({tutor.reviewCount})
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Students */}
                            {tutor.activeStudents && (
                              <div className="flex items-center w-1/2">
                                <svg
                                  className="w-3.5 h-3.5 text-blue-500 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <span
                                  className="font-medium"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {tutor.activeStudents}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Second row */}
                          <div className="flex w-full">
                            {/* Lessons */}
                            {tutor.totalLessons && (
                              <div className="flex items-center mr-2 w-1/2">
                                <svg
                                  className="w-3.5 h-3.5 text-green-500 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span
                                  className="font-medium"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {tutor.totalLessons}
                                </span>
                              </div>
                            )}

                            {/* Languages */}
                            {tutor.languagesSpoken &&
                              tutor.languagesSpoken.length > 0 && (
                                <div className="flex items-center w-1/2">
                                  <svg
                                    className="w-3.5 h-3.5 text-purple-500 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span
                                    className="font-medium"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    {tutor.languagesSpoken.length}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Hire button - 50% width */}
                      <Link
                        href={tutor.hireButtonLink || "/#contact-form"}
                        className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all font-medium text-center flex items-center justify-center w-1/2"
                      >
                        Hire a tutor
                      </Link>
                    </div>
                  ) : (
                    /* Original full-width button layout when no stats */
                    <div className="mt-3 border-t border-gray-200">
                      <Link
                        href={tutor.hireButtonLink || "/#contact-form"}
                        className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all font-medium text-center block w-full"
                      >
                        Hire a tutor
                      </Link>
                    </div>
                  )}

                  {/* View Profile button only */}
                  {tutor.profilePDF?.asset?.url && (
                    <div className="p-4 pt-0">
                      <ExternalLink
                        href={tutor.profilePDF.asset.url}
                        target="_blank"
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all font-medium text-center block w-full"
                      >
                        View Profile
                      </ExternalLink>
                    </div>
                  )}
                </div>

                {/* Desktop view (side by side) */}
                <div className="hidden md:flex items-stretch overflow-hidden">
                  {/* Left side - Profile Image - with negative bottom margin to eliminate gap */}
                  <div className="w-[225px] h-[225px] relative flex-shrink-0 overflow-hidden z-10">
                    {tutor.profilePhoto ? (
                      <Image
                        src={urlFor(tutor.profilePhoto)
                          .width(450)
                          .height(450)
                          .url()}
                        alt={`${tutor.name}`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 225px"
                        priority={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="h-16 w-16 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Right side - Tutor Information - with negative top margin to close gap */}
                  <div className="flex-1 p-5 pt-0 mt-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold">{tutor.name}</h3>

                          {/* Rate info moved next to name */}
                          {tutor.price && (
                            <div className="flex items-center">
                              <p className="font-medium text-gray-600 whitespace-nowrap mr-1 text-sm">
                                Rate:
                              </p>
                              <p className="text-blue-800 font-medium text-sm">
                                {tutor.price.displayText ||
                                  `Starting from ${tutor.price.currency} ${tutor.price.amount}/hour`}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Tutor stats - Desktop */}
                        <div className="flex flex-wrap mb-1">
                          {tutor.rating && (
                            <div className="flex items-center mr-4">
                              <svg
                                className="w-5 h-5 text-yellow-500 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-medium text-sm">
                                {tutor.rating}
                              </span>
                              {tutor.reviewCount && (
                                <span className="text-gray-500 ml-1 text-sm">
                                  ({tutor.reviewCount} reviews)
                                </span>
                              )}
                            </div>
                          )}

                          {tutor.activeStudents && (
                            <div className="flex items-center mr-4">
                              <svg
                                className="w-5 h-5 text-blue-500 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                              <span className="font-medium text-sm">
                                {tutor.activeStudents} active students
                              </span>
                            </div>
                          )}

                          {tutor.totalLessons && (
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-green-500 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-sm">
                                {tutor.totalLessons} lessons
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Professional Title and Subject Taught - REORGANIZED LAYOUT */}
                        <div className="flex justify-between items-start">
                          {/* Left column: Professional Title */}
                          <div className="flex-1">
                            {tutor.professionalTitle && (
                              <div className="flex items-center">
                                <span className="flex-shrink-0 w-5 h-5 min-w-[20px] min-h-[20px] mr-2">
                                  <svg
                                    className="w-5 h-5 text-orange-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                                  </svg>
                                </span>
                                <p className="text-gray-700 font-medium text-sm">
                                  {tutor.professionalTitle}
                                </p>
                              </div>
                            )}

                            {/* Subjects taught */}
                            <div className="flex mt-1">
                              <div className="flex items-start gap-1">
                                <p className="font-medium text-gray-600 mt-0 text-sm">
                                  Teaches:
                                </p>
                                <div className="flex flex-wrap gap-1 max-w-md">
                                  {/* Main subject always shown */}
                                  <span className="text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm">
                                    {tutor.specialization.mainSubject}
                                  </span>

                                  {/* Additional subjects with "Show more" functionality */}
                                  {tutor.specialization.additionalSubjects &&
                                    (expandedSubjects[tutor._id]
                                      ? tutor.specialization.additionalSubjects.map(
                                          (subject, index) => (
                                            <span
                                              key={index}
                                              className="text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm"
                                            >
                                              {subject}
                                            </span>
                                          ),
                                        )
                                      : tutor.specialization.additionalSubjects
                                          .slice(0, MAX_VISIBLE_SUBJECTS)
                                          .map((subject, index) => (
                                            <span
                                              key={index}
                                              className="text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm"
                                            >
                                              {subject}
                                            </span>
                                          )))}

                                  {/* Show "more" button if there are more subjects than the maximum visible */}
                                  {tutor.specialization.additionalSubjects &&
                                    tutor.specialization.additionalSubjects
                                      .length > MAX_VISIBLE_SUBJECTS && (
                                      <button
                                        onClick={() =>
                                          toggleExpandSubjects(tutor._id)
                                        }
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-0.5 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
                                      >
                                        {expandedSubjects[tutor._id]
                                          ? "Show less"
                                          : `+${tutor.specialization.additionalSubjects.length - MAX_VISIBLE_SUBJECTS} more`}
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Hire button */}
                          <div className="flex-shrink-0 -mt-4 flex flex-col items-end">
                            <Link
                              href={tutor.hireButtonLink || "/#contact-form"}
                              className="bg-blue-800 text-white px-6 py-2 h-10 w-36 rounded-md hover:bg-blue-700 transition-all font-medium flex items-center justify-center text-center whitespace-nowrap"
                            >
                              Hire a tutor
                            </Link>

                            {/* Price tag container directly under button */}
                            {tutor.priceTag?.enabled && (
                              <div className="flex items-center text-orange-500 text-sm mt-1">
                                <svg
                                  className="w-5 h-5 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                {tutor.priceTag.badgeText}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages section */}
                        {tutor.languagesSpoken &&
                          tutor.languagesSpoken.length > 0 && (
                            <div className="flex items-start gap-1 mt-1">
                              <p className="font-medium text-gray-600 mt-0 text-sm">
                                Languages:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {tutor.languagesSpoken.map((lang, index) => (
                                  <span
                                    key={index}
                                    className="text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-sm"
                                  >
                                    {lang.language} ({lang.proficiency})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Bio text */}
                        <p
                          className="text-gray-600 mb-0 text-justify mt-2 pt-0 pb-0 px-0"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {tutor.experience}
                        </p>

                        {/* View Profile button only */}
                        {tutor.profilePDF?.asset?.url && (
                          <div>
                            <ExternalLink
                              href={tutor.profilePDF.asset.url}
                              target="_blank"
                              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-all font-medium"
                            >
                              View Profile
                            </ExternalLink>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TutorProfiles;
