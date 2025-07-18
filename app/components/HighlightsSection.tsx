import React from "react";

export interface HighlightItem {
  title: string;
  description: string;
  iconType: "star" | "language" | "education";
  isFeatured: boolean;
}

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

// Icon components matching the Figma design exactly
const StarIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_13920_15435)">
      <path
        d="M32.09 12.7145C31.8783 12.0595 31.2973 11.5943 30.61 11.5323L21.2734 10.6846L17.5815 2.04324C17.3092 1.40994 16.6893 1 16.0004 1C15.3116 1 14.6916 1.40994 14.4194 2.04472L10.7275 10.6846L1.38942 11.5323C0.703307 11.5958 0.123813 12.0595 -0.0891786 12.7145C-0.30217 13.3695 -0.105468 14.088 0.41356 14.5409L7.47091 20.7302L5.38986 29.8972C5.23758 30.5713 5.49919 31.268 6.05845 31.6722C6.35906 31.8894 6.71075 32 7.06541 32C7.3712 32 7.67452 31.9176 7.94674 31.7547L16.0004 26.9413L24.0512 31.7547C24.6403 32.1091 25.3829 32.0768 25.9409 31.6722C26.5004 31.2667 26.7618 30.5698 26.6095 29.8972L24.5285 20.7302L31.5858 14.5421C32.1049 14.088 32.303 13.3708 32.09 12.7145Z"
        fill="#F57C40"
      />
    </g>
    <defs>
      <clipPath id="clip0_13920_15435">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const LanguageIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.33301 9C7.12381 9 5.33301 10.7904 5.33301 13C5.33301 15.2096 7.12381 17 9.33301 17C11.5426 17 13.333 15.2096 13.333 13C13.333 10.7904 11.5426 9 9.33301 9Z"
      fill="#001A96"
    />
    <path
      d="M0 17.0001V3.66681C0 2.20041 1.2004 1 2.6668 1H29.3332C30.7996 1 32 2.20041 32 3.66681V19.6669C32 21.1329 30.7996 22.3337 29.3332 22.3337H21.3332H20.0088C20.0324 21.6565 20.2996 21.0237 20.7812 20.5421L27.7708 13.5525L22.1144 7.89564L16 14.0133V13.0001C16 9.32445 13.0088 6.33323 9.3332 6.33323C5.6576 6.33323 2.6668 9.32445 2.6668 13.0001V17.0001H0Z"
      fill="#001A96"
    />
    <path
      d="M0 30.3337V25C0 22.0548 2.388 19.6668 5.3332 19.6668H12.7812C13.5144 19.6668 14.5392 19.242 15.0572 18.7244L22.1144 11.6667L24 13.5524L18.8956 18.6564C17.9308 19.6212 17.3332 20.9548 17.3332 22.4276V30.3341L0 30.3337Z"
      fill="#001A96"
    />
  </svg>
);

const EducationIcon = ({ isFeatured }: { isFeatured: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.7329 20.8627C29.9693 20.6889 30.1557 20.4557 30.2733 20.1868C30.3908 19.9179 30.4353 19.6228 30.4023 19.3311C30.3694 19.0395 30.2601 18.7618 30.0854 18.5259C29.9108 18.29 29.6771 18.1044 29.4078 17.9877V15.6946L28.0672 16.2643V17.9877C27.7978 18.1044 27.5639 18.29 27.3892 18.5259C27.2144 18.7619 27.1051 19.0397 27.0721 19.3314C27.0391 19.6232 27.0837 19.9184 27.2013 20.1874C27.319 20.4564 27.5055 20.6896 27.7421 20.8634C27.5316 21.018 27.3604 21.2198 27.2423 21.4527C27.1241 21.6856 27.0622 21.9429 27.0617 22.204V23.8791C27.0617 24.0569 27.1323 24.2274 27.258 24.3531C27.3837 24.4788 27.5542 24.5495 27.732 24.5495H29.743C29.9208 24.5495 30.0913 24.4788 30.217 24.3531C30.3427 24.2274 30.4133 24.0569 30.4133 23.8791V22.2034C30.4128 21.9422 30.3509 21.6849 30.2327 21.452C30.1146 21.2192 29.9434 21.0173 29.7329 20.8627Z"
      fill="#F57C40"
    />
    <path
      d="M26.0559 17.1157V22.0761C26.0595 22.6527 25.9131 23.2204 25.631 23.7234C25.349 24.2264 24.941 24.6473 24.4471 24.945C21.8841 26.4419 18.9692 27.2308 16.0011 27.2308C13.033 27.2308 10.1181 26.4419 7.55511 24.945C7.06123 24.6473 6.65323 24.2264 6.37119 23.7234C6.08914 23.2204 5.94274 22.6527 5.94635 22.0761V17.1157L14.1711 20.5947C14.7505 20.838 15.3727 20.9634 16.0011 20.9634C16.6295 20.9634 17.2517 20.838 17.8311 20.5947L26.0559 17.1157Z"
      fill="#F57C40"
    />
    <path
      d="M30.7724 9.96143L17.3071 4.26374C16.8933 4.08967 16.4489 4 16 4C15.5511 4 15.1067 4.08967 14.6929 4.26374L1.22756 9.96143C0.863604 10.1154 0.553072 10.3731 0.334752 10.7025C0.116432 11.0319 0 11.4183 0 11.8135C0 12.2087 0.116432 12.5951 0.334752 12.9245C0.553072 13.2539 0.863604 13.5117 1.22756 13.6656L14.6929 19.3633C15.1066 19.5375 15.5511 19.6273 16 19.6273C16.4489 19.6273 16.8934 19.5375 17.3071 19.3633L30.7724 13.6656C31.1364 13.5117 31.4469 13.2539 31.6652 12.9245C31.8836 12.5951 32 12.2087 32 11.8135C32 11.4183 31.8836 11.0319 31.6652 10.7025C31.4469 10.3731 31.1364 10.1154 30.7724 9.96143Z"
      fill="#F57C40"
    />
  </svg>
);

const iconMap = {
  star: StarIcon,
  language: LanguageIcon,
  education: EducationIcon,
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  highlights,
}) => {
  return (
    <section className="py-16 bg-white relative">
      {/* Desktop layout - exact match to Figma design */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-8 w-[1248px] h-[320px] mx-auto">
          {highlights.map((item, index) => {
            const IconComponent = iconMap[item.iconType] || iconMap.star;

            return (
              <div
                key={index}
                className={`flex p-8 flex-col items-start gap-6 flex-shrink-0 rounded-[20px] h-[320px] ${
                  index === 0 ? "w-[480px]" : "w-[352px]"
                } ${
                  item.isFeatured
                    ? "bg-primary text-white"
                    : index === 1
                      ? "bg-greyBlueLight text-primary"
                      : "bg-white border border-greyBorder text-primary"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <h3
                    className={`font-gilroy text-2xl font-bold leading-[120%] w-60 ${
                      item.isFeatured ? "text-white" : "text-textDark"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 flex-shrink-0">
                    <IconComponent isFeatured={item.isFeatured} />
                  </div>
                </div>

                <p
                  className={`font-gilroy text-lg font-normal leading-[160%] w-full ${
                    item.isFeatured ? "text-white" : "text-textDark"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile responsive layout */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6">
            {highlights.map((item, index) => {
              const IconComponent = iconMap[item.iconType] || iconMap.star;

              return (
                <div
                  key={index}
                  className={`p-6 flex flex-col items-start gap-4 rounded-[20px] ${
                    item.isFeatured
                      ? "bg-primary text-white"
                      : index === 1
                        ? "bg-greyBlueLight text-primary"
                        : "bg-white border border-greyBorder text-primary"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h3
                      className={`font-gilroy text-xl font-bold leading-[120%] flex-1 pr-4 ${
                        item.isFeatured ? "text-white" : "text-textDark"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="w-8 h-8 flex-shrink-0">
                      <IconComponent isFeatured={item.isFeatured} />
                    </div>
                  </div>

                  <p
                    className={`font-gilroy text-base font-normal leading-[160%] w-full ${
                      item.isFeatured ? "text-white" : "text-textDark"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
