import type { Metadata } from "next";
import BlueChipFundSchema from "../components/BlueChipFundSchema";

export const metadata: Metadata = {
  title: "Blue Chip Art Fund | Museum Quality Art Investment | Art Investment Group Trust",
  description: "Discover the Blue Chip Art Fund: a governed platform for long-term stewardship of historically significant and museum-quality artworks. Institutional governance prioritizing preservation, provenance, and cultural responsibility.",
  keywords: "blue chip art, fine art investment, museum quality, art stewardship, art fund, institutional art, cultural preservation",
  openGraph: {
    title: "Blue Chip Art Fund | Museum Quality Art Investment & Stewardship",
    description: "Focused on established works with deep cultural and historical significance, managed through long-horizon ownership and institutional governance.",
    url: "https://artinvestmentgrouptrust.com/blue-chip-art-fund",
    type: "website",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=1200&height=630",
        width: 1200,
        height: 630,
        alt: "Blue Chip Art Fund - Museum quality artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Chip Art Fund | Museum Quality Art Investment",
    description: "Institutional stewardship of historically significant and museum-quality artworks with long-term governance.",
    images: ["https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=1200&height=630"],
  },
  canonical: "https://artinvestmentgrouptrust.com/blue-chip-art-fund",
};

export default function BlueChipArtFundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlueChipFundSchema />
      {children}
    </>
  );
}
