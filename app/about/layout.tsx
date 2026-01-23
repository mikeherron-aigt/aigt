import type { Metadata } from "next";
import AboutPageSchema from "../components/AboutPageSchema";

export const metadata: Metadata = {
  title: "Art Stewardship Framework | Art Investment Group Trust",
  description: "Learn how Art Investment Group Trust defines art stewardship through institutional governance, long term ownership, custody standards, and cultural preservation.",
  openGraph: {
    title: "Art Stewardship Framework | Art Investment Group Trust",
    description: "Discover how institutional governance and long-horizon ownership structure create sustainable stewardship models for culturally significant artworks.",
    url: "https://artinvestmentgrouptrust.com/about",
    type: "website",
    images: [
      {
        url: "https://artinvestmentgrouptrust.com/og.png",
        width: 1200,
        height: 630,
        alt: "Art Investment Group Trust Stewardship Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Stewardship Framework | Art Investment Group Trust",
    description: "Learn how institutional governance creates sustainable stewardship models for culturally significant artworks.",
  },
  canonical: "https://artinvestmentgrouptrust.com/about",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AboutPageSchema />
      {children}
    </>
  );
}
