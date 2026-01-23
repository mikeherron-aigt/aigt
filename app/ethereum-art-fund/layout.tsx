import type { Metadata } from "next";
import EthereumFundSchema from "../components/EthereumFundSchema";

export const metadata: Metadata = {
  title:
    "Ethereum Art Fund | Tokenized Art Investment | Art Investment Group Trust",
  description:
    "Explore the Ethereum Art Fund: a governed platform for tokenized access to Ethereum-native cultural assets. Institutional governance applied to digital art investment with long-term stewardship principles.",
  keywords:
    "Ethereum art, digital art investment, NFT stewardship, tokenized art, art fund, blockchain art, institutional art investment",
  openGraph: {
    title: "Ethereum Art Fund | Institutional Stewardship of Digital Art",
    description:
      "A governed platform designed to explore structured ownership, fractionalization, and tokenized access to culturally significant, Ethereum-native artworks.",
    url: "https://artinvestmentgrouptrust.com/ethereum-art-fund",
    type: "website",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F5a13615e39cb4a898e26aab1d64089af?format=webp&width=1200&height=630",
        width: 1200,
        height: 630,
        alt: "Ethereum Art Fund - Colorful abstract artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethereum Art Fund | Institutional Stewardship of Digital Art",
    description:
      "A governed platform for tokenized access to culturally significant Ethereum-native artworks.",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F5a13615e39cb4a898e26aab1d64089af?format=webp&width=1200&height=630",
    ],
  },
  alternates: {
    canonical: "https://artinvestmentgrouptrust.com/ethereum-art-fund",
  },
};

export default function EthereumArtFundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EthereumFundSchema />
      {children}
    </>
  );
}
