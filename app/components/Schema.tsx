import Script from 'next/script';

interface FAQItem {
  question: string;
  answer: string;
}

interface SchemaProps {
  pageType?: 'home' | 'about';
  faqItems?: FAQItem[];
}

export default function Schema({ pageType = 'home', faqItems }: SchemaProps) {
  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://artinvestmentgrouptrust.com/#organization',
    name: 'Art Investment Group Trust',
    description: 'A governed art investment platform focused on the acquisition, stewardship, and long term ownership of culturally significant and museum quality artworks for qualified participants.',
    url: 'https://artinvestmentgrouptrust.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800',
      width: 238,
      height: 60,
    },
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://artinvestmentgrouptrust.com/#website',
    name: 'Art Investment Group Trust',
    url: 'https://artinvestmentgrouptrust.com',
    publisher: {
      '@id': 'https://artinvestmentgrouptrust.com/#organization',
    },
  };

  // About Page Schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About',
    url: 'https://artinvestmentgrouptrust.com/about',
    isPartOf: {
      '@id': 'https://artinvestmentgrouptrust.com/#website',
    },
    about: {
      '@id': 'https://artinvestmentgrouptrust.com/#organization',
    },
    description: 'Learn about Art Investment Group Trust, a governed art investment platform focused on the acquisition, stewardship, and long term ownership of culturally significant and museum quality artworks for qualified participants.',
  };

  // FAQ Page Schema
  const faqPageSchema = faqItems
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {/* Global Organization and Website Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* About Page Schema */}
      {pageType === 'about' && (
        <Script
          id="about-page-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(aboutPageSchema),
          }}
        />
      )}

      {/* FAQ Page Schema */}
      {pageType === 'home' && faqPageSchema && (
        <Script
          id="faq-page-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageSchema),
          }}
        />
      )}
    </>
  );
}
