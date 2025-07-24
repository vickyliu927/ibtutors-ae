import { getFAQData } from '../lib/getFaqData';
import FAQSection from './FAQSection';

interface FAQProps {
  pageType?: 'homepage' | 'subject' | 'curriculum' | 'general';
  cloneId?: string | null;
  subjectSlug?: string;
}

const FAQ = async ({ pageType = 'homepage', cloneId, subjectSlug }: FAQProps = {}) => {
  const { sectionData, faqs } = await getFAQData(pageType, cloneId, subjectSlug);

  if (!sectionData || faqs.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-center">
            {!sectionData ? 'FAQ section not configured' : 'No FAQs available at the moment'}
          </p>
        </div>
      </section>
    );
  }

  return <FAQSection sectionData={sectionData} faqs={faqs} />;
};

export default FAQ; 