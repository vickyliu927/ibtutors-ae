'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

interface FooterData {
  title: string;
  phone?: string;
  phoneLink?: string;
  whatsapp?: string;
  whatsappLink?: string;
  address?: string;
  addressLink?: string;
  tutorchaseLink?: string;
}

const Footer = () => {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch<FooterData>(`*[_type == "footerSection" && !(_id in path("drafts.**"))][0]{
          title,
          phone,
          phoneLink,
          whatsapp,
          whatsappLink,
          address,
          addressLink,
          tutorchaseLink
        }`);

        console.log('Footer Data:', result);

        if (!result) {
          setError('Footer section not found in CMS');
          return;
        }
        setFooter(result);
      } catch (err) {
        console.error('Error fetching footer:', err);
        setError(err instanceof Error ? err.message : 'Failed to load footer');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex justify-center items-center">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    </footer>
  );

  if (error || !footer) return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-red-500 text-center">{error || 'Footer content not available'}</p>
      </div>
    </footer>
  );

  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {footer.title && footer.tutorchaseLink ? (
              <>
                {footer.title.split(/TutorChase/i).map((part: string, idx: number, arr: string[]) => (
                  <React.Fragment key={idx}>
                    <span className="text-blue-900">{part}</span>
                    {idx < arr.length - 1 && (
                      <a
                        href={footer.tutorchaseLink}
                        className="text-orange-500 hover:text-orange-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
              TutorChase
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <span className="text-blue-900">{footer.title}</span>
            )}
          </h2>
          <div className="flex justify-center space-x-8 mb-8">
            {footer.whatsapp && footer.whatsappLink && (
              <a
                href={footer.whatsappLink}
              className="flex items-center text-blue-800 hover:text-blue-900"
                target="_blank" rel="noopener noreferrer"
            >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
                {footer.whatsapp}
              </a>
            )}
            {footer.phone && (
              footer.phoneLink ? (
                <a
                  href={footer.phoneLink}
              className="flex items-center text-blue-800 hover:text-blue-900"
            >
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {footer.phone}
                </a>
              ) : (
                <span className="flex items-center text-blue-800">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
                  {footer.phone}
                </span>
              )
            )}
          </div>
          <div className="text-gray-500">
            {footer.addressLink ? (
              <a href={footer.addressLink} target="_blank" rel="noopener noreferrer">{footer.address}</a>
            ) : (
              <p>{footer.address}</p>
            )}
            <p className="mt-2">Copyright 2024 IB Tutors by TutorChase</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 