'use client';

import Script from 'next/script';

export default function GlobalSchema() {
  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://artinvestmentgrouptrust.com/#organization',
            name: 'Art Investment Group Trust',
            alternateName: 'AIGT',
            description: 'A governed art investment platform focused on the acquisition, stewardship, and long term ownership of culturally significant and museum quality artworks for qualified participants.',
            url: 'https://artinvestmentgrouptrust.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800',
              width: 238,
              height: 60,
            },
            sameAs: [],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '',
              contactType: 'Customer Service',
              availableLanguage: ['en'],
            },
            foundingDate: '2024',
            knowsAbout: [
              'Art Investment',
              'Art Stewardship',
              'Fine Art',
              'Institutional Governance',
              'Cultural Preservation',
              'Ethereum Art',
              'Digital Art',
              'Museum Quality Art',
            ],
          }),
        }}
      />

      {/* Website Schema with Search Action */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://artinvestmentgrouptrust.com/#website',
            name: 'Art Investment Group Trust',
            url: 'https://artinvestmentgrouptrust.com',
            publisher: {
              '@id': 'https://artinvestmentgrouptrust.com/#organization',
            },
            description: 'Institutional platform for art investment and stewardship with museum quality works and long horizon ownership.',
          }),
        }}
      />

      {/* Local Business Schema (for context) */}
      <Script
        id="localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://artinvestmentgrouptrust.com/#localbusiness',
            name: 'Art Investment Group Trust',
            image: 'https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800',
            description: 'Governed platforms for institutional art investment and stewardship',
            url: 'https://artinvestmentgrouptrust.com',
            areaServed: {
              '@type': 'Country',
              name: 'United States',
            },
            serviceType: 'Art Investment Fund Management',
          }),
        }}
      />

      {/* Home Page Breadcrumb Schema */}
      <Script
        id="home-breadcrumb"
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
            ],
          }),
        }}
      />
    </>
  );
}
