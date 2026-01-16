import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleTagManager from "./components/GoogleTagManager";
import GlobalSchema from "./components/GlobalSchema";

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
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalSchema />
        <GoogleTagManager />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
