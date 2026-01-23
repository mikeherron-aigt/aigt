'use client';

import Script from 'next/script';

export default function EthereumFundSchema() {
  return (
    <>
      {/* Ethereum Art Fund Page Schema */}
      <Script
        id="ethereum-fund-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'InvestmentFund',
            name: 'Ethereum Art Fund',
            description: 'A governed platform designed to explore structured ownership, fractionalization, and tokenized access to culturally significant, Ethereum-native artworks.',
            url: 'https://artinvestmentgrouptrust.com/ethereum-art-fund',
            isPartOf: {
              '@id': 'https://artinvestmentgrouptrust.com/#website',
            },
            organizer: {
              '@id': 'https://artinvestmentgrouptrust.com/#organization',
            },
            fundType: 'Art Investment Fund',
            investmentObjective: 'Long-term stewardship and governance of Ethereum-native cultural assets',
            keywords: ['Ethereum art', 'digital art investment', 'tokenized art', 'NFT stewardship', 'blockchain art', 'institutional art investment'],
          }),
        }}
      />

      {/* Breadcrumb Schema for Ethereum Fund */}
      <Script
        id="ethereum-fund-breadcrumb"
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
                name: 'Ethereum Art Fund',
                item: 'https://artinvestmentgrouptrust.com/ethereum-art-fund',
              },
            ],
          }),
        }}
      />
    </>
  );
}
