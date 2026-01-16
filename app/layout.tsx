import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
import GoogleTagManager from "./components/GoogleTagManager";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Art Investment Group Trust | Institutional Art Investment & Stewardship",
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
      <body suppressHydrationWarning>
        <GoogleTagManager />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
