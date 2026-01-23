'use client';

import Script from 'next/script';

export default function RequestAccessSchema() {
  return (
    <>
      {/* Request Access Page Schema */}
      <Script
        id="request-access-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Request Access',
            description: 'Request access to Art Investment Group Trust platforms and begin a private conversation about art investment and stewardship opportunities.',
            url: 'https://artinvestmentgrouptrust.com/request-access',
            isPartOf: {
              '@id': 'https://artinvestmentgrouptrust.com/#website',
            },
            mainEntity: {
              '@id': 'https://artinvestmentgrouptrust.com/#organization',
            },
          }),
        }}
      />

      {/* Breadcrumb Schema for Request Access */}
      <Script
        id="request-access-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://artinvestmentgrouptrust.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Request Access',
                item: 'https://artinvestmentgrouptrust.com/request-access',
              },
            ],
          }),
        }}
      />

      {/* FAQPage Schema for Art Investment Questions */}
      <Script
        id="request-access-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is an art investment fund?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'An art investment fund is a structured vehicle that acquires and holds artworks as long term assets, typically emphasizing governance, custody, and preservation rather than short term buying and selling.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does institutional art investment work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Institutional art investment applies governance frameworks, professional custody standards, and long horizon ownership principles to the acquisition and stewardship of fine art.',
                },
              },
              {
                '@type': 'Question',
                name: 'Who can invest in art through Art Investment Group Trust?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Participation is limited to qualified purchasers, institutions, family offices, and approved partners through private conversations and governed access.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
