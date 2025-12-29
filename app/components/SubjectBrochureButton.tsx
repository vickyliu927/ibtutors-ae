import Link from "next/link";
import React from "react";

interface SubjectBrochureButtonProps {
  href?: string;
  className?: string;
  text?: string;
}

/**
 * SubjectBrochureButton
 *
 * A button styled to match the Figma design exactly.
 * Features a light background with orange border and text.
 */
const SubjectBrochureButton: React.FC<SubjectBrochureButtonProps> = ({
  href = "/#contact-form",
  className = "",
  text = "Download Subject Brochure",
}) => {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2",
        "h-[42px] px-6",
        "rounded-[28px]",
        "border border-[#FB510F]",
        "bg-[#F9F9FD]",
        "transition-transform active:scale-[0.98] hover:opacity-90",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB510F]",
        className,
      ].join(" ")}
    >
      {/* Document Icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M17.7861 3.5H5.79703C5.08058 3.5 4.5 4.08058 4.5 4.79703V19.2023C4.4993 19.9194 5.08058 20.5 5.79703 20.5H17.7861C18.5026 20.5 19.0831 19.9194 19.0831 19.203V4.79773C19.0838 4.08128 18.5026 3.5 17.7861 3.5ZM11.2919 17.6181H7.99609C7.64802 17.6181 7.36578 17.3359 7.36578 16.9878C7.36578 16.6397 7.64802 16.3575 7.99609 16.3575H11.2919C11.6399 16.3575 11.9222 16.6397 11.9222 16.9878C11.9222 17.3359 11.6399 17.6181 11.2919 17.6181ZM15.587 14.2929H7.99609C7.64802 14.2929 7.36578 14.0107 7.36578 13.6626C7.36578 13.3145 7.64802 13.0323 7.99609 13.0323H15.5863C15.9344 13.0323 16.2167 13.3145 16.2167 13.6626C16.2167 14.0107 15.9351 14.2929 15.587 14.2929ZM15.587 10.9677H7.99609C7.64802 10.9677 7.36578 10.6855 7.36578 10.3374C7.36578 9.98933 7.64802 9.70709 7.99609 9.70709H15.5863C15.9344 9.70709 16.2167 9.98933 16.2167 10.3374C16.2167 10.6855 15.9351 10.9677 15.587 10.9677ZM15.587 7.6425H7.99609C7.64802 7.6425 7.36578 7.36026 7.36578 7.01219C7.36578 6.66413 7.64802 6.38189 7.99609 6.38189H15.5863C15.9344 6.38189 16.2167 6.66413 16.2167 7.01219C16.2167 7.36026 15.9351 7.6425 15.587 7.6425Z"
          fill="#FB510F"
        />
      </svg>

      {/* Button Text */}
      <span className="text-[#FB510F] text-center font-gilroy text-[14px] font-medium leading-[140%]">
        {text}
      </span>
    </Link>
  );
};

export default SubjectBrochureButton;
