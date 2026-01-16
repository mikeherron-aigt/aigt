import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Art Stewardship Framework | Art Investment Group Trust",
  description: "Learn how Art Investment Group Trust defines art stewardship through institutional governance, long term ownership, custody standards, and cultural preservation.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* About Page Schema */}
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
            description: 'Learn how Art Investment Group Trust defines art stewardship through institutional governance, long term ownership, custody standards, and cultural preservation.',
          }),
        }}
      />
      {children}
    </>
  );
}
