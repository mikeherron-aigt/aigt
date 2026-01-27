'use client';

import Image from "next/image";
import Link from "next/link";

export default function MuseumPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">

        {/* HERO */}
        <section className="w-full relative bg-[#f5f5f5]">
          <div className="max-w-[1440px] mx-auto relative">
            <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[691px] overflow-hidden">

              {/* Background image */}
              <Image
                src="/museum_hero.png"
                alt="Museum exterior with landscaping and signage"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />

              {/* Overlay card */}
              <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-8 lg:px-[80px]">
                <div
                  className="bg-white/90 border border-black/10 max-w-[560px]"
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h1
                      style={{
                        fontFamily:
                          "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
                        fontSize: "56px",
                        lineHeight: "1.05",
                        color: "#1f2937",
                      }}
                    >
                      A Public Institution
                      <br />
                      for Long-Horizon
                      <br />
                      Art Stewardship
                    </h1>

                    <p
                      style={{
                        marginTop: "20px",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "#4b5563",
                        maxWidth: "520px",
                      }}
                    >
                      The John Dowling Jr. Museum of Contemporary Art is a planned
                      contemporary art museum conceived as a living cultural
                      institution rooted on Long Island.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PERSONAL HISTORY */}
        <section className="w-full py-12 sm:py-16 lg:py-20 bg-[#f5f5f5]">
          <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="bg-white p-8 sm:p-12 lg:p-16 flex flex-col gap-8">
              <h3 className="museum-card-title text-center">
                John Dowling Jr’s personal history is inseparable from Long Island,
                where the museum is planned to take shape. Born in Queens and
                raised in the region, his connection to place grounds the
                institution in lived experience rather than abstraction.
              </h3>

              <hr
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent 0%, #334155 10%, #334155 90%, transparent 100%)",
                  opacity: "0.5",
                  width: "100%",
                  maxWidth: "500px",
                  border: "none",
                  margin: "0 auto",
                }}
              />

              <p className="museum-intro-text">
                The museum bears his name not as recognition, but as responsibility.
                It reflec
