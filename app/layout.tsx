import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Art Investment Group Trust",
  description: "A Trust Structure for Cultural Assets - Art Trust operates an institutional system for acquisition, custody, and long-duration stewardship of museum-grade artworks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
