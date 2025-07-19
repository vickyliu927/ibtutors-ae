import React from "react";

const InteractiveTutoringPlatform = () => {
  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FBFCFD" }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Main Platform Section */}
        <div className="relative mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Illustration */}
            <div className="relative w-full max-w-[672px]">
              {/* Main White Container Background */}
              <div className="relative w-[597px] h-[395px] bg-white rounded border shadow-sm">
                {/* Top Toolbar */}
                <div className="absolute top-0 left-0 w-full h-[43px] bg-white rounded-t flex items-center">
                  {/* Traffic Light Buttons */}
                  <div className="flex items-center ml-4 space-x-5">
                    <div
                      className="w-[10px] h-[10px] rounded-full opacity-70"
                      style={{ backgroundColor: "#F57C40" }}
                    ></div>
                    <div
                      className="w-[10px] h-[10px] rounded-full opacity-40"
                      style={{ backgroundColor: "#FCBD00" }}
                    ></div>
                    <div
                      className="w-[10px] h-[10px] rounded-full"
                      style={{ backgroundColor: "#4053B0" }}
                    ></div>
                  </div>

                  {/* Toolbar Content Area */}
                  <div className="ml-8 w-[132px] h-[34px] bg-gray-100 rounded"></div>

                  {/* Right Side Button */}
                  <div className="ml-auto mr-4 w-[58px] h-[21px] bg-gray-100 rounded"></div>
                </div>

                {/* Video Call People Interface */}
                <div className="absolute top-[65px] left-[32px] w-[193px] h-[279px]">
                  {/* Student Video - Top */}
                  <div
                    className="relative w-full h-[126px] rounded overflow-hidden mb-[21px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #A7B4F0 0%, rgba(167, 180, 240, 0.6) 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    {/* Student Avatar */}
                    <div className="absolute bottom-3 left-3 w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center opacity-80">
                      <svg
                        width="12"
                        height="15"
                        viewBox="0 0 12 15"
                        fill="none"
                      >
                        <path
                          d="M4.28 3.69V6.48C4.28 7.05 4.51 7.59 4.92 7.98C5.33 8.37 5.89 8.59 6.47 8.59C7.05 8.59 7.61 8.37 8.02 7.98C8.43 7.59 8.66 7.05 8.66 6.48V3.69C8.66 3.12 8.43 2.58 8.02 2.19C7.61 1.8 7.05 1.58 6.47 1.58C5.89 1.58 5.33 1.8 4.92 2.19C4.51 2.58 4.28 3.12 4.28 3.69ZM9.36 6.14C9.32 6.14 9.29 6.15 9.26 6.16C9.23 6.17 9.20 6.19 9.18 6.21C9.16 6.23 9.14 6.26 9.13 6.29C9.12 6.32 9.11 6.35 9.11 6.48C9.11 6.81 9.04 7.14 8.91 7.44C8.78 7.74 8.59 8.01 8.35 8.23C8.11 8.45 7.83 8.62 7.53 8.73C7.23 8.84 6.91 8.89 6.59 8.89C6.27 8.89 5.95 8.84 5.65 8.73C5.35 8.62 5.07 8.45 4.83 8.23C4.59 8.01 4.40 7.74 4.27 7.44C4.14 7.14 4.07 6.81 4.07 6.48C4.07 6.46 4.07 6.44 4.07 6.42C4.07 6.35 4.04 6.28 3.99 6.23C3.94 6.18 3.87 6.15 3.80 6.15C3.73 6.15 3.66 6.18 3.61 6.21C3.56 6.26 3.53 6.32 3.53 6.48C3.53 7.27 3.82 8.03 4.35 8.62C4.88 9.21 5.61 9.59 6.40 9.68V10.91H5.32C5.25 10.91 5.18 10.94 5.13 10.99C5.08 11.04 5.05 11.11 5.05 11.18C5.05 11.25 5.08 11.32 5.13 11.37C5.18 11.42 5.25 11.45 5.32 11.45H7.62C7.69 11.45 7.76 11.42 7.81 11.37C7.86 11.32 7.89 11.25 7.89 11.18C7.89 11.11 7.86 11.04 7.81 10.99C7.76 10.94 7.69 10.91 7.62 10.91H6.54V9.68C7.33 9.59 8.06 9.21 8.59 8.62C9.12 8.03 9.41 7.27 9.41 6.48C9.41 6.35 9.38 6.28 9.33 6.21C9.28 6.18 9.21 6.15 9.14 6.15H9.36Z"
                          fill="#F57C40"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Tutor Video - Bottom */}
                  <div
                    className="relative w-full h-[126px] rounded overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #F9FAFB 0%, rgba(249, 250, 251, 0.12) 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                    {/* Tutor Avatar */}
                    <div className="absolute bottom-3 left-3 w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center opacity-80">
                      <svg
                        width="12"
                        height="15"
                        viewBox="0 0 12 15"
                        fill="none"
                      >
                        <path
                          d="M4.28 3.69V6.48C4.28 7.05 4.51 7.59 4.92 7.98C5.33 8.37 5.89 8.59 6.47 8.59C7.05 8.59 7.61 8.37 8.02 7.98C8.43 7.59 8.66 7.05 8.66 6.48V3.69C8.66 3.12 8.43 2.58 8.02 2.19C7.61 1.8 7.05 1.58 6.47 1.58C5.89 1.58 5.33 1.8 4.92 2.19C4.51 2.58 4.28 3.12 4.28 3.69ZM9.36 6.14C9.32 6.14 9.29 6.15 9.26 6.16C9.23 6.17 9.20 6.19 9.18 6.21C9.16 6.23 9.14 6.26 9.13 6.29C9.12 6.32 9.11 6.35 9.11 6.48C9.11 6.81 9.04 7.14 8.91 7.44C8.78 7.74 8.59 8.01 8.35 8.23C8.11 8.45 7.83 8.62 7.53 8.73C7.23 8.84 6.91 8.89 6.59 8.89C6.27 8.89 5.95 8.84 5.65 8.73C5.35 8.62 5.07 8.45 4.83 8.23C4.59 8.01 4.40 7.74 4.27 7.44C4.14 7.14 4.07 6.81 4.07 6.48C4.07 6.46 4.07 6.44 4.07 6.42C4.07 6.35 4.04 6.28 3.99 6.23C3.94 6.18 3.87 6.15 3.80 6.15C3.73 6.15 3.66 6.18 3.61 6.21C3.56 6.26 3.53 6.32 3.53 6.48C3.53 7.27 3.82 8.03 4.35 8.62C4.88 9.21 5.61 9.59 6.40 9.68V10.91H5.32C5.25 10.91 5.18 10.94 5.13 10.99C5.08 11.04 5.05 11.11 5.05 11.18C5.05 11.25 5.08 11.32 5.13 11.37C5.18 11.42 5.25 11.45 5.32 11.45H7.62C7.69 11.45 7.76 11.42 7.81 11.37C7.86 11.32 7.89 11.25 7.89 11.18C7.89 11.11 7.86 11.04 7.81 10.99C7.76 10.94 7.69 10.91 7.62 10.91H6.54V9.68C7.33 9.59 8.06 9.21 8.59 8.62C9.12 8.03 9.41 7.27 9.41 6.48C9.41 6.35 9.38 6.28 9.33 6.21C9.28 6.18 9.21 6.15 9.14 6.15H9.36Z"
                          fill="#F57C40"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="absolute bottom-[47px] left-[223px] w-[195px] h-[48px]">
                  <div className="w-full h-full bg-white rounded-full shadow-xl flex items-center justify-center space-x-4">
                    {/* Video Call Button */}
                    <div className="w-10 h-10 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                      >
                        <path
                          d="M12.32 9.33V7.48C12.32 7.14 12.06 6.87 11.72 6.87H4.61C4.27 6.87 4 7.14 4 7.48V13.18C4 13.52 4.27 13.79 4.61 13.79H11.72C12.06 13.79 12.32 13.52 12.32 13.18V11.33L14.83 13.84V6.82L12.32 9.33Z"
                          fill="#171D23"
                        />
                      </svg>
                    </div>

                    {/* Microphone Button */}
                    <div className="w-10 h-10 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                      >
                        <path
                          d="M8.33 5.19V8.29C8.33 8.81 8.54 9.31 8.92 9.69C9.30 10.07 9.80 10.28 10.32 10.28C10.84 10.28 11.34 10.07 11.72 9.69C12.10 9.31 12.31 8.81 12.31 8.29V5.19C12.31 4.67 12.10 4.17 11.72 3.79C11.34 3.41 10.84 3.20 10.32 3.20C9.80 3.20 9.30 3.41 8.92 3.79C8.54 4.17 8.33 4.67 8.33 5.19ZM13.07 7.85C13.03 7.85 13.00 7.86 12.97 7.87C12.94 7.88 12.91 7.90 12.89 7.92C12.87 7.94 12.85 7.97 12.84 8.00C12.83 8.03 12.82 8.06 12.82 8.19C12.82 8.68 12.72 9.16 12.53 9.61C12.34 10.06 12.06 10.46 11.71 10.79C11.36 11.12 10.95 11.38 10.50 11.55C10.05 11.72 9.57 11.80 9.09 11.80C8.61 11.80 8.13 11.72 7.68 11.55C7.23 11.38 6.82 11.12 6.47 10.79C6.12 10.46 5.84 10.06 5.65 9.61C5.46 9.16 5.36 8.68 5.36 8.19C5.36 8.17 5.36 8.15 5.36 8.13C5.36 8.06 5.33 7.99 5.28 7.94C5.23 7.89 5.16 7.86 5.09 7.86C5.02 7.86 4.95 7.89 4.90 7.92C4.85 7.97 4.82 8.03 4.82 8.19C4.82 9.22 5.18 10.21 5.83 11.01C6.48 11.81 7.39 12.36 8.41 12.57V14.66H6.84C6.77 14.66 6.70 14.69 6.65 14.74C6.60 14.79 6.57 14.86 6.57 14.93C6.57 15.00 6.60 15.07 6.65 15.12C6.70 15.17 6.77 15.20 6.84 15.20H13.81C13.88 15.20 13.95 15.17 14.00 15.12C14.05 15.07 14.08 15.00 14.08 14.93C14.08 14.86 14.05 14.79 14.00 14.74C13.95 14.69 13.88 14.66 13.81 14.66H12.24V12.57C13.26 12.36 14.17 11.81 14.82 11.01C15.47 10.21 15.83 9.22 15.83 8.19C15.83 8.06 15.80 7.99 15.75 7.92C15.70 7.89 15.63 7.86 15.56 7.86H13.07Z"
                          fill="#171D23"
                        />
                      </svg>
                    </div>

                    {/* Screen Share Button */}
                    <div className="w-10 h-10 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9.32 10.58C9.32 9.77 9.97 9.12 10.78 9.12H11.28V6.52C11.28 6.26 11.06 6.04 10.78 6.04H8.64C7.83 6.04 7.18 6.69 7.18 7.50V14.66C7.18 15.47 7.83 16.12 8.64 16.12H10.78C11.06 16.12 11.28 15.90 11.28 15.64V13.04H10.78C9.97 13.04 9.32 12.39 9.32 11.58V10.58Z"
                          fill="#F57C40"
                        />
                        <path
                          d="M17.41 11.42C17.38 11.36 17.34 11.31 17.29 11.26L14.67 8.64C14.48 8.45 14.16 8.45 13.97 8.64C13.78 8.83 13.78 9.15 13.97 9.34L15.63 11H10.78C10.52 11 10.30 11.22 10.30 11.48C10.30 11.74 10.52 11.96 10.78 11.96H15.63L13.97 13.62C13.78 13.81 13.78 14.13 13.97 14.32C14.07 14.42 14.20 14.47 14.32 14.47C14.44 14.47 14.57 14.42 14.67 14.32L17.29 11.70C17.34 11.65 17.38 11.60 17.41 11.53C17.47 11.42 17.47 11.29 17.41 11.42Z"
                          fill="#F57C40"
                        />
                      </svg>
                    </div>

                    {/* More Options */}
                    <div className="w-10 h-10 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-black bg-opacity-60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black bg-opacity-60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black bg-opacity-60 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Card */}
              <div className="absolute top-[47px] right-0 w-[258px] h-[200px] bg-white rounded shadow-sm">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-gilroy font-bold text-lg text-textDark">
                      Lesson 1
                    </h3>
                    <div
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: "#F57C40" }}
                    >
                      LIVE
                    </div>
                  </div>
                  <p className="font-gilroy text-sm text-textDark opacity-30 mb-8">
                    Trigonometry and graphs
                  </p>

                  <div className="flex-1 flex flex-col justify-end">
                    <h4 className="font-gilroy font-bold text-lg text-textDark mb-2">
                      Lesson 2
                    </h4>
                    <p className="font-gilroy text-sm text-textDark opacity-30">
                      Trigonometry
                    </p>
                  </div>
                </div>
              </div>

              {/* Graph/Chart */}
              <div className="absolute bottom-0 right-[20px] w-[266px] h-[289px]">
                <svg width="266" height="289" viewBox="0 0 266 289" fill="none">
                  {/* X-axis */}
                  <line
                    x1="0"
                    y1="252"
                    x2="252"
                    y2="252"
                    stroke="#4053B0"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="3,3"
                  />
                  {/* Y-axis */}
                  <line
                    x1="97"
                    y1="0"
                    x2="97"
                    y2="283"
                    stroke="#4053B0"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="3,3"
                  />

                  {/* Main curve */}
                  <path
                    d="M28 74L22.3521 84.0715L33.8982 83.927L28 74ZM163 229C163.552 229 164 228.552 164 228C164 227.448 163.552 227 163 227V229ZM28.1127 83.0077L27.113 83.0331C28.4252 134.637 41.145 171.174 64.2653 194.805C87.395 218.446 120.766 229 163 229V228V227C121.08 227 88.316 216.527 65.6949 193.407C43.0646 170.276 30.4178 134.318 29.1124 82.9823L28.1127 83.0077Z"
                    fill="#001A96"
                  />

                  {/* Axis labels */}
                  <text
                    x="82"
                    y="15"
                    className="text-sm font-gilroy font-medium"
                    fill="#4053B0"
                  >
                    y
                  </text>
                  <text
                    x="258"
                    y="260"
                    className="text-sm font-gilroy font-medium"
                    fill="#4053B0"
                  >
                    x
                  </text>
                  <text
                    x="82"
                    y="275"
                    className="text-sm font-gilroy font-medium"
                    fill="#4053B0"
                  >
                    0
                  </text>
                </svg>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="lg:pl-8">
              <div className="max-w-[512px]">
                <div className="mb-6">
                  <p
                    className="font-gilroy text-lg font-normal leading-[150%] uppercase mb-3"
                    style={{ color: "#F57C40" }}
                  >
                    Interactive Tutoring Platform
                  </p>
                  <h2 className="font-gilroy text-5xl font-bold leading-[120%] text-textDark">
                    Engaging Lessons with our Platform
                  </h2>
                </div>
                <p className="font-gilroy text-lg font-normal leading-[160%] text-textDark">
                  Lessons are brought to life and students can interact with
                  tutors by drawing diagrams, solving equations, editing essays,
                  and annotating work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="relative w-full max-w-[928px] mx-auto h-[294px] rounded-[20px] overflow-hidden"
          style={{ backgroundColor: "#F57C40" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute -left-[356px] -top-[253px] w-[1789px] h-[747px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
                transform: "rotate(-5deg)",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
            <h3 className="font-gilroy text-4xl font-bold leading-[140%] text-white mb-4 max-w-[334px]">
              Voted #1 for IB by 10,000+ students
            </h3>

            <div className="max-w-[690px]">
              <p className="font-gilroy text-lg font-normal leading-[160%] text-white mb-4">
                We're trusted by hundreds of IB schools globally. All tutoring
                includesFREE access to our IB Resources Platform – normally
                £29/month!
              </p>

              {/* Decorative line */}
              <div className="w-[175px] h-[1px] bg-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveTutoringPlatform;
