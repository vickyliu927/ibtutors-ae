'use client';

const TutoringPlatformBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-600 uppercase tracking-wide mb-3">ONLINE TUTORING PLATFORM</p>
          <h2 className="text-3xl font-bold">Engaging Lessons with our Online Platform</h2>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="relative">
              {/* Decorative dots */}
              <div className="absolute -top-4 -left-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                </div>
                
              {/* Platform interface mockups */}
              <div className="flex gap-4">
                <div className="w-1/2 space-y-4">
                  <div className="bg-blue-50 rounded-lg h-32"></div>
                  <div className="bg-blue-50 rounded-lg h-32"></div>
                  </div>
                  <div className="w-1/2">
                  <div className="bg-blue-50 rounded-lg h-[17rem]"></div>
                    </div>
                  </div>

              {/* Control icons */}
              <div className="flex justify-center mt-4 space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">⌘</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">⌥</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-12">
            <p className="text-gray-700 mb-8">
              Our online platform brings lessons to life, allowing students to draw diagrams,
              solve equations, edit essays, and annotate work. We deliver elite tutoring worldwide, 
              matching students with the best tutors available.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Interactive whiteboard for real-time collaboration</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>HD video and crystal-clear audio</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Document sharing and annotation tools</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutoringPlatformBanner; 