import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleTagManager from "./components/GoogleTagManager";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Art Investment Group Trust",
    default: "Art Investment Group Trust | Institutional Art Investment & Stewardship",
  },
  description: "Art Investment Group Trust is a governed platform for art investment and cultural asset stewardship, focused on museum quality works, institutional governance, and long horizon ownership.",
  icons: {
    icon: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F8777a8773bb24f46b9dc74f6e814a2b3?format=webp&width=800",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
              description: 'A governed art investment platform focused on the acquisition, stewardship, and long term ownership of culturally significant and museum quality artworks for qualified participants.',
              url: 'https://artinvestmentgrouptrust.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800',
                width: 238,
                height: 60,
              },
            }),
          }}
        />
        {/* Website Schema */}
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
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <GoogleTagManager />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
