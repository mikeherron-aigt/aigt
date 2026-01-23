'use client';

import Script from 'next/script';

export default function BlueChipFundSchema() {
  return (
    <>
      {/* Blue Chip Art Fund Page Schema */}
      <Script
        id="blue-chip-fund-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'InvestmentFund',
            name: 'Blue Chip Art Fund',
            description: 'A governed platform established to acquire, hold, and steward culturally and historically significant artworks within a long-duration ownership framework.',
            url: 'https://artinvestmentgrouptrust.com/blue-chip-art-fund',
            isPartOf: {
              '@id': 'https://artinvestmentgrouptrust.com/#website',
            },
            organizer: {
              '@id': 'https://artinvestmentgrouptrust.com/#organization',
            },
            fundType: 'Art Investment Fund',
            investmentObjective: 'Long-term stewardship and institutional governance of museum-quality and culturally significant artworks',
            keywords: ['blue chip art', 'fine art investment', 'museum quality', 'art stewardship', 'cultural preservation', 'institutional art'],
          }),
        }}
      />

      {/* Breadcrumb Schema for Blue Chip Fund */}
      <Script
        id="blue-chip-fund-breadcrumb"
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
                name: 'Blue Chip Art Fund',
                item: 'https://artinvestmentgrouptrust.com/blue-chip-art-fund',
              },
            ],
          }),
        }}
      />
    </>
  );
}
