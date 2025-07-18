"use client";
import React from "react";
import TutorCard, { TutorCardData } from "./TutorCard";

// Example data that matches the Figma design
const exampleTutorData: TutorCardData = {
  _id: "example-1",
  name: "Megan",
  professionalTitle: "IB Maths Tutor | University of Amsterdam",
  experience:
    "I'm Megan, an IB Mathematics tutor with 5 years of experience helping students succeed in both HL and SL courses. My focus is on building a deep understanding of key topics like calculus, functions, and statistics.",
  profilePhoto: {
    // This would be a Sanity image object in real usage
    asset: {
      _ref: "image-abc123",
      _type: "reference",
    },
  },
  specialization: {
    mainSubject: "IB Maths",
    additionalSubjects: ["Statistics", "Calculus"],
  },
  hireButtonLink: "/#contact-form",
  rating: 4.9,
  activeStudents: 100,
};

const TutorCardExample = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Tutor Card Design
          </h1>
          <p className="text-gray-600">
            Updated component matching the Figma design exactly
          </p>
        </div>

        <TutorCard tutor={exampleTutorData} />

        <div className="text-center text-sm text-gray-500 max-w-2xl">
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Fixed dimensions: 1120px × 280px</li>
            <li>Left: 280×280px tutor image</li>
            <li>
              Right: Information panel with rating, university, description
            </li>
            <li>Bottom: Subject tags and hire button</li>
            <li>Exact color scheme from Figma design</li>
            <li>Uses Gilroy font family as specified</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TutorCardExample;
