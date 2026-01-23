import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Access | Art Investment Group Trust",
  description: "Request access to Art Investment Group Trust to begin a private conversation about participation in our governed art investment and stewardship platforms.",
};

export default function RequestAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
