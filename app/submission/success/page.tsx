import React from 'react';
import { getContactFormData } from '@/app/lib/getContactFormData';

export const revalidate = 0;

export default async function SubmissionSuccessPage() {
  const contentData = await getContactFormData();

  const titleLines = (contentData?.successModal.title || 'Thank you for your Enquiry\nWe will be in contact shortly')
    .replace(/\n/g, '\n')
    .split('\n');

  return (
    <main>
      <section className="py-16 flex justify-center items-center bg-gray-50 min-h-[70vh]">
        <div className="bg-white shadow-[0px_40px_60px_0px_rgba(0,14,81,0.05)] max-w-[800px] w-full mx-4">
          <div className="flex flex-col items-center gap-10 py-10 px-8 md:px-20">
            {/* Success Icon (orange tick) */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FFF1E8] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12l4 4 10-10" stroke="#F59A5B" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Headlines */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-gilroy text-2xl md:text-4xl font-normal leading-[140%] text-textDark text-center">
                {titleLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < titleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-[680px] text-textDark text-center font-gilroy text-lg md:text-xl font-light leading-[150%]">
              {contentData?.successModal.description ||
                'You can additionally message on WhatsApp now with one of our academic consultants to discuss your tutoring requirements in more detail'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={contentData?.successModal.primaryButtonLink || '/'}
                className="flex h-12 px-[52px] justify-center items-center rounded-[28px] bg-primary text-white font-gilroy text-base font-normal leading-[140%] hover:bg-blue-800 transition-colors"
              >
                {contentData?.successModal.primaryButtonText || 'View Study Resources'}
              </a>
              <a
                href={contentData?.successModal.secondaryButtonLink || '/'}
                className="flex h-12 px-[52px] justify-center items-center rounded-[28px] bg-greyBorder text-textDark font-gilroy text-base font-normal leading-[140%] hover:bg-gray-300 transition-colors"
              >
                {contentData?.successModal.secondaryButtonText || 'Return Home'}
              </a>
            </div>

            {/* Footer Text */}
            <p className="self-stretch text-textDark text-center font-gilroy text-lg md:text-xl font-light leading-[150%]">
              {contentData?.successModal.footerText ||
                'Please also check your junk email folder if you have not heard from us'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


