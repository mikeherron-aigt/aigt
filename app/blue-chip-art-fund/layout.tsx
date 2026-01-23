import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blue Chip Art Fund | Art Investment Group Trust",
  description:
    "Learn about the Blue Chip Art Fund and how Art Investment Group Trust applies institutional governance, long horizon ownership, and custody standards to culturally significant artworks.",
  openGraph: {
    title: "Blue Chip Art Fund | Art Investment Group Trust",
    description:
      "Learn about the Blue Chip Art Fund and how Art Investment Group Trust applies institutional governance, long horizon ownership, and custody standards to culturally significant artworks.",
    url: "https://artinvestmentgrouptrust.com/blue-chip-art-fund",
    type: "website",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=1200&height=630",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Chip Art Fund | Art Investment Group Trust",
    description:
      "Learn about the Blue Chip Art Fund and how Art Investment Group Trust applies institutional governance, long horizon ownership, and custody standards to culturally significant artworks.",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=1200&height=630",
    ],
  },
  alternates: {
    canonical: "https://artinvestmentgrouptrust.com/blue-chip-art-fund",
  },
};

export default function BlueChipArtFundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
