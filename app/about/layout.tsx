import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Art Stewardship Framework | Art Investment Group Trust",
  description: "Learn how Art Investment Group Trust defines art stewardship through institutional governance, long term ownership, custody standards, and cultural preservation.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
