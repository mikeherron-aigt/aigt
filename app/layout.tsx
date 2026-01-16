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
    icon: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F6f25261088414f8ba6164b2094ab2e48?format=webp&width=800",
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
