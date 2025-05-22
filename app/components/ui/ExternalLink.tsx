'use client';

import React from 'react';
import { useLinkSettings } from '@/app/hooks/useLinkSettings';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  rel,
  ...rest 
}) => {
  const { getRel } = useLinkSettings();
  
  // Combine existing rel with the one derived from settings
  const relAttribute = getRel(href, rel);
  
  return (
    <a 
      href={href}
      className={className}
      rel={relAttribute}
      {...rest}
    >
      {children}
    </a>
  );
};

export default ExternalLink; 