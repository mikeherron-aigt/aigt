import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "John Dowling Jr. Museum of Contemporary Art",
  description: "The John Dowling Jr. Museum of Contemporary Art is a planned institution on Long Island dedicated to the long-term stewardship of culturally significant contemporary works, artist residencies, and public access.",
};

export default function MuseumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
