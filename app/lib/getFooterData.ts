import { client } from '@/sanity/lib/client';

export interface FooterData {
  title: string;
  phone?: string;
  phoneLink?: string;
  whatsapp?: string;
  whatsappLink?: string;
  address?: string;
  addressLink?: string;
  tutorchaseLink?: string;
}

export async function getFooterData(): Promise<FooterData | null> {
  try {
    const result = await client.fetch<FooterData>(
      `*[_type == "footerSection" && !(_id in path("drafts.**"))][0]{
        title,
        phone,
        phoneLink,
        whatsapp,
        whatsappLink,
        address,
        addressLink,
        tutorchaseLink
      }`,
      {},
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );

    if (!result) {
      console.log('Footer section not found in CMS');
      return null;
    }

    return result;
  } catch (err) {
    console.error('Error fetching footer:', err);
    return null;
  }
} 