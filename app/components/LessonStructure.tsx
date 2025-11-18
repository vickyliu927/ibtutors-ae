import React from "react";

export interface SessionCard {
  sessionNumber: string;
  title: string;
  bulletPoints: string[];
}

export interface LessonStructureProps {
  overline?: string;
  title?: string;
  description?: string;
  sessions?: SessionCard[];
}

const defaultSessions: SessionCard[] = [
  {
    sessionNumber: "Session 1",
    title: "Algebraic Foundations",
    bulletPoints: [
      "Simplifying expressions, indices, and surds",
      "Solving linear and quadratic equations",
      "Understanding sequences and series",
    ],
  },
  {
    sessionNumber: "Session 2",
    title: "Functions & Graphs",
    bulletPoints: [
      "Function notation, domain, and range",
      "Transformations and inverses",
      "Modelling with polynomial and rational functions",
    ],
  },
  {
    sessionNumber: "Session 3",
    title: "Trigonometry",
    bulletPoints: [
      "Unit circle and radians",
      "Trig identities and equations",
      "Graphing sine, cosine, and tangent functions",
    ],
  },
  {
    sessionNumber: "Session 4",
    title: "Calculus: Differentiation",
    bulletPoints: [
      "Gradient functions and tangents",
      "Chain, product, and quotient rules",
      "Optimisation and related-rate problems",
    ],
  },
  {
    sessionNumber: "Session 5",
    title: "Calculus: Integration",
    bulletPoints: [
      "Definite and indefinite integrals",
      "Area under curves and kinematic applications",
      "Differential equations (HL)",
    ],
  },
  {
    sessionNumber: "Session 6",
    title: "Vectors",
    bulletPoints: [
      "Vector equations, scalar product, and angle between vectors",
      "Lines, planes, and intersections (HL)",
      "Geometric interpretations and IB-style applications",
    ],
  },
];

const LessonStructure: React.FC<LessonStructureProps> = ({
  overline = "Lesson Structure",
  title = "A Structured Path to IB Maths Success",
  description = "Our tutors follow a clear, effective approach tailored to each student - strengthening understanding, mastering complex topics, and building exam confidence. Here's an example of how an IB Maths program might be organised around your syllabus and goals.",
  sessions = defaultSessions,
}) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1252px] mx-auto">
        {/* Title Section */}
        <div className="flex flex-col items-center gap-6 mb-16 max-w-[841px] mx-auto">
          <h3 className="font-gilroy text-lg font-semibold leading-[100%] uppercase text-center text-[#8B8E91]">
            {overline}
          </h3>
          <h2 className="font-gilroy text-3xl sm:text-4xl lg:text-[48px] font-semibold leading-[110%] text-center text-textDark">
            {title}
          </h2>
          <p className="font-gilroy text-xl leading-[140%] text-center text-textDark">
            {description}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex flex-col gap-8 p-8 sm:px-8 sm:py-10 rounded-3xl bg-[#FEF2EC]"
            >
              {/* Headline */}
              <div className="flex flex-col gap-3">
                <div className="font-gilroy text-base font-medium leading-[140%] uppercase text-[#8B8E91]">
                  {session.sessionNumber}
                </div>
                <h3 className="font-gilroy text-2xl font-semibold leading-[120%] text-textDark">
                  {session.title}
                </h3>
              </div>

              {/* Bullet Points */}
              <div className="flex flex-col gap-3">
                {session.bulletPoints.map((point, bulletIndex) => (
                  <div key={bulletIndex} className="flex items-start gap-2">
                    <div className="flex items-center h-[22px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 font-gilroy text-base leading-[140%] text-textDark">
                      {point}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LessonStructure;
