import React from 'react';
import Link from 'next/link';
import { getFooterData } from '../lib/getFooterData';
import { getServerRelAttributes } from '../lib/serverLinkUtils';

const Footer = async () => {
  const footer = await getFooterData();

  if (!footer) {
    return (
      <footer 
        className="py-20 px-4 -mt-32"
        style={{
          background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto text-center pt-32">
          <p className="text-textDark">Footer content not available</p>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className="py-20 px-4 -mt-32"
      style={{
        background: 'linear-gradient(103deg, #FFF6F3 0%, #F2F4FA 68.07%, #F6F5FE 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-12 pt-32">
          {/* Main content section */}
          <div className="flex flex-col items-center gap-8 w-full">
            {/* Title */}
            <h2 className="text-center text-3xl lg:text-4xl font-medium leading-[140%] font-gilroy max-w-4xl">
              <span className="text-textDark">
                Alternatively contact us via Email or Phone, or visit{' '}
              </span>
                        <a
                href={footer.tutorchaseLink || "https://www.tutorchase.com"}
                          target="_blank"
                rel={getServerRelAttributes(footer.tutorchaseLink || "https://www.tutorchase.com")}
                className="text-primary"
                        >
                          TutorChase
                        </a>
            </h2>

            {/* WhatsApp button */}
            {footer.whatsapp && footer.whatsappLink && (
              <a
                href={footer.whatsappLink}
                className="flex items-center gap-4 md:gap-3"
                target="_blank"
                rel={getServerRelAttributes(footer.whatsappLink)}
              >
                <div className="flex items-center justify-center w-10 h-10 md:w-8 md:h-8 rounded-full bg-primary p-2">
                  <svg 
                    width="22" 
                    height="22" 
                    viewBox="0 0 33 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white md:w-[18px] md:h-[18px]"
                  >
                    <rect x="0.5" width="32" height="32" rx="16" fill="#001A96"/>
                    <path d="M14.8857 11.5479C14.9748 11.5479 15.0461 11.5735 15.1094 11.627C15.1762 11.6833 15.242 11.7771 15.3037 11.9248C15.3315 11.991 15.4765 12.3395 15.6182 12.6797C15.7572 13.0135 15.899 13.3515 15.917 13.3877V13.3887C15.946 13.4457 16.0086 13.5726 15.9609 13.7285L15.9336 13.7979L15.9053 13.8535V13.8545C15.8662 13.9336 15.8344 13.9974 15.7832 14.0684L15.7246 14.1426C15.6906 14.1819 15.6563 14.2237 15.623 14.2637C15.5511 14.3503 15.483 14.4317 15.4219 14.4922L15.4209 14.4932C15.4098 14.5043 15.3898 14.5242 15.3721 14.5439C15.3633 14.5537 15.353 14.5657 15.3438 14.5781C15.3382 14.5856 15.3188 14.6115 15.3096 14.6455L15.2578 14.835H15.3623C15.4579 14.9871 15.7427 15.3807 16.1592 15.8096C16.6017 16.2652 17.2026 16.7726 17.8926 17.0723C17.9233 17.0856 17.987 17.1117 18.0439 17.1348C18.0725 17.1463 18.1003 17.1577 18.1221 17.166C18.1328 17.1701 18.1436 17.1737 18.1523 17.1768C18.1564 17.1782 18.1616 17.1801 18.167 17.1816C18.1697 17.1824 18.1745 17.1834 18.1797 17.1846C18.1821 17.1851 18.1956 17.1885 18.2129 17.1885C18.254 17.1885 18.2853 17.1731 18.2979 17.166C18.3129 17.1575 18.3248 17.1476 18.333 17.1406L18.374 17.0996C18.4889 16.9697 18.8698 16.5246 19 16.3311C19.0874 16.2002 19.1853 16.1504 19.293 16.1504C19.3667 16.1504 19.4415 16.1728 19.5312 16.2051C19.6323 16.2415 19.9871 16.4096 20.333 16.5762C20.6683 16.7377 20.9972 16.8992 21.0098 16.9053C21.1817 16.9878 21.2635 17.032 21.3105 17.1084V17.1094C21.3216 17.1276 21.3361 17.1673 21.3438 17.2363C21.3511 17.3029 21.351 17.3858 21.3428 17.4805C21.3264 17.6698 21.2777 17.8949 21.2002 18.1104C21.1133 18.3512 20.8681 18.5909 20.5723 18.7793C20.2774 18.9671 19.9689 19.0803 19.7949 19.0957L19.7939 19.0967L19.7334 19.1016V19.1025C19.6378 19.1119 19.535 19.1211 19.4072 19.1211C19.1085 19.1211 18.5592 19.0722 17.3711 18.5977C16.2351 18.1438 15.1023 17.1974 14.1621 15.9082L13.9766 15.6455C13.9614 15.6233 13.9465 15.6018 13.9375 15.5898V15.5889L13.8281 15.4385C13.5475 15.0364 13.1104 14.2823 13.1104 13.502C13.1104 12.5001 13.5886 11.9514 13.8398 11.793C13.9552 11.7203 14.1601 11.6596 14.3672 11.6162C14.5704 11.5737 14.7496 11.5538 14.7969 11.5518C14.8453 11.5497 14.8642 11.5484 14.874 11.5479H14.8857Z" fill="white" stroke="#001A96" strokeWidth="0.3"/>
                    <path d="M17.1514 7.0498C21.7276 7.05006 25.4502 10.7457 25.4502 15.2871C25.4502 19.828 21.7276 23.5233 17.1514 23.5234C15.7789 23.5234 14.4224 23.1849 13.2227 22.5439L13.2041 22.5342L13.1836 22.54L8.77246 23.9424C8.75554 23.9478 8.738 23.9502 8.7207 23.9502C8.67557 23.9502 8.63115 23.9316 8.59863 23.8984C8.55384 23.8526 8.53812 23.7854 8.55859 23.7246L9.99316 19.4941L10.001 19.4727L9.98926 19.4521C9.24459 18.1937 8.85059 16.7561 8.85059 15.2871C8.85059 10.7456 12.5745 7.0498 17.1514 7.0498ZM17.1504 8.67676C13.4765 8.677 10.4873 11.6416 10.4873 15.2871C10.4873 16.6881 10.926 18.0281 11.7559 19.1621C11.7887 19.207 11.7981 19.2657 11.7803 19.3184L11.0664 21.4229L11.0352 21.5166L11.1289 21.4863L13.3389 20.7842C13.3558 20.7788 13.3733 20.7764 13.3906 20.7764C13.4235 20.7764 13.4563 20.7853 13.4844 20.8037C14.5743 21.5189 15.8425 21.8975 17.1514 21.8975C20.8248 21.8972 23.8135 18.9321 23.8135 15.2871C23.8135 11.6415 20.824 8.67676 17.1504 8.67676Z" fill="white" stroke="#001A96" strokeWidth="0.1"/>
                  </svg>
                </div>
                <span className="text-xl font-gilroy text-textDark" style={{ fontWeight: 400 }}>
                  {footer.whatsapp || 'Send WhatsApp'}
                </span>
              </a>
            )}
          </div>

          {/* Address and Copyright */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg text-[#8B8E91] font-gilroy leading-[160%] text-center" style={{ fontWeight: 200 }}>
              {footer.address || 'One Central, Dubai World Trade Centre'}
            </div>
            <div className="text-lg text-[#8B8E91] font-gilroy leading-[160%] text-center" style={{ fontWeight: 200 }}>
              Copyright 2025 IB Tutors by TutorChase
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
