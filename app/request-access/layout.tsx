import type { Metadata } from "next";
import RequestAccessSchema from "../components/RequestAccessSchema";

export const metadata: Metadata = {
  title: "Request Access | Art Investment Group Trust",
  description:
    "Request access to Art Investment Group Trust to begin a private conversation about participation in our governed art investment and stewardship platforms.",
  openGraph: {
    title: "Request Access | Art Investment Group Trust",
    description:
      "Start a private conversation with our team about art investment and stewardship opportunities tailored to your interests and goals.",
    url: "https://artinvestmentgrouptrust.com/request-access",
    type: "website",
    images: [
      {
        url: "https://artinvestmentgrouptrust.com/og.png",
        width: 1200,
        height: 630,
        alt: "Request Access - Art Investment Group Trust",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Request Access | Art Investment Group Trust",
    description:
      "Start a private conversation about art investment and stewardship opportunities.",
  },
  alternates: {
    canonical: "https://artinvestmentgrouptrust.com/request-access",
  },
};

export default function RequestAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RequestAccessSchema />
      {children}
    </>
  );
}
