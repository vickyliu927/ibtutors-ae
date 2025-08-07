import { cachedFetch } from '@/sanity/lib/queryCache';

export interface FooterData {
  title?: string;
  phone?: string;
  phoneLink?: string;
  whatsapp?: string;
  whatsappLink?: string;
  address?: string;
  addressLink?: string;
  tutorchaseLink?: string;
}

export async function getFooterData(cloneId?: string | null): Promise<FooterData | null> {
  try {
    // If no cloneId provided, try to get it from middleware headers
    let targetCloneId = cloneId;
    if (!targetCloneId) {
      try {
        // Dynamically import next/headers only on server-side
        const { headers } = await import('next/headers');
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch (error) {
        console.log('[getFooterData] Could not access headers (client-side call), using default fallback');
        // When called client-side, return fallback data immediately
        return getDefaultFooterData();
      }
    }

    // Build clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "footerSection" && defined($cloneId) && cloneReference->cloneId.current == $cloneId][0] {
        title,
        phone,
        phoneLink,
        whatsapp,
        whatsappLink,
        address,
        addressLink,
        tutorchaseLink,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "footerSection" && cloneReference->baselineClone == true][0] {
        title,
        phone,
        phoneLink,
        whatsapp,
        whatsappLink,
        address,
        addressLink,
        tutorchaseLink,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "footerSection" && !defined(cloneReference)][0] {
        title,
        phone,
        phoneLink,
        whatsapp,
        whatsappLink,
        address,
        addressLink,
        tutorchaseLink,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    const params = { cloneId: targetCloneId };

    // Using cachedFetch with clone-aware caching
    const result = await cachedFetch<{
      cloneSpecific: (FooterData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      baseline: (FooterData & { sourceInfo?: { source: string; cloneId: string } }) | null;
      default: (FooterData & { sourceInfo?: { source: string; cloneId: string } }) | null;
    }>(
      query,
      params,
      { next: { revalidate: 86400 } }, // 24 hours cache
      24 * 60 * 60 * 1000 // 24 hours TTL
    );

    if (!result) {
      return getDefaultFooterData();
    }

    // Apply 3-tier fallback resolution
    const footerData = result.cloneSpecific || result.baseline || result.default;
    
    if (!footerData) {
      return getDefaultFooterData();
    }

    console.log(`[getFooterData] Resolved footer data from: ${footerData.sourceInfo?.source || 'unknown'} for clone: ${targetCloneId || 'none'}`);
    
    return {
      title: footerData.title,
      phone: footerData.phone,
      phoneLink: footerData.phoneLink,
      whatsapp: footerData.whatsapp,
      whatsappLink: footerData.whatsappLink,
      address: footerData.address,
      addressLink: footerData.addressLink,
      tutorchaseLink: footerData.tutorchaseLink,
    };
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return getDefaultFooterData();
  }
}

/**
 * Get default footer data as fallback
 */
function getDefaultFooterData(): FooterData {
  return {
    title: 'Alternatively contact us via Email or Phone, or visit TutorChase',
    phone: '+44(0)1865306636',
    whatsapp: 'Send WhatsApp',
    address: 'One Central, Dubai World Trade Centre',
    tutorchaseLink: 'https://www.tutorchase.com',
  };
} 