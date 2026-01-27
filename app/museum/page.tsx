'use client';

import Image from "next/image";

export default function MuseumPage() {
  return (
    <main className="w-full bg-[#f5f5f5]">
      <section className="w-full">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[691px] overflow-hidden">
            <Image
              src="/museum_hero.png"
              alt="Museum exterior with landscaping and signage"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />

            <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-8 lg:px-[80px]">
              <div
                className="bg-white/90 border border-black/10 max-w-[560px]"
                style={{ backdropFilter: "blur(6px)" }}
              >
                <div className="p-6 sm:p-8 lg:p-10">
                  <h1
                    style={{
                      fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
                      fontSize: "56px",
                      lineHeight: "1.05",
                      color: "#1f2937",
                      margin: 0,
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
                    The John Dowling Jr. Museum of Contemporary Art is a planned contemporary art museum
                    conceived as a living cultural institution rooted on Long Island.
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
        John Dowling Jr’s personal history is inseparable from Long Island, where the museum is planned to take shape. Born in Queens and raised in the region, his connection to place grounds the institution in lived experience rather than abstraction, shaping how art is created, cared for, and shared.
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
        The museum bears his name not as recognition, but as responsibility. It reflects a lifelong commitment to artistic creation, care, and stewardship, anchoring the Trust’s collections to a human narrative and a specific place while holding them to a standard designed to endure.
      </p>
    </div>
  </div>
</section>
{/* A PHYSICAL EXPRESSION OF STEWARDSHIP */}
<section className="w-full bg-white py-12 sm:py-16 lg:py-20">
  <div className="grid lg:grid-cols-[1fr_0.59fr] gap-0 items-center">
    <div className="px-4 sm:px-8 lg:px-[80px]">
      <div className="max-w-[633px]">
        <h2 className="museum-section-heading">A Physical Expression of Stewardship</h2>

        <p className="museum-body-text mt-6">
          The museum is more than an exhibition space. It is a physical manifestation of the principles that govern Art Investment Group Trust, a commitment to preserving cultural significance, supporting artistic creation, and ensuring public access to important works of art.
        </p>

        <p className="museum-body-text mt-6">
          The Dowling represents a deliberate choice to move beyond abstract stewardship and create an institution with roots in place, community, and long-term vision. Every aspect of the museum’s design and operations reflects a philosophy that art deserves more than acquisition and storage. It deserves care, context, and continued cultural relevance.
        </p>
      </div>
    </div>

    <div className="relative w-full aspect-video">
      <Image
        src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0ae93150a1c34f6d9a2c26642853c1b8?format=webp&width=1200"
        alt="Artist working on painting in studio"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
    </div>
  </div>
</section>
{/* WHY THIS MUSEUM MATTERS */}
<section className="w-full py-12 sm:py-16 lg:py-20 bg-[#f5f5f5]">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
    <div className="max-w-[1022px] mx-auto mb-12 sm:mb-16 lg:mb-20">
      <h2 className="museum-section-title">Why This Museum Matters</h2>
      <p className="museum-intro-text">
        Art Investment Group Trust was established to steward culturally significant art within a disciplined, governed framework. The Dowling gives that framework physical form.
      </p>
      <p className="museum-intro-text">
        By creating a permanent public institution, the Trust extends its responsibility beyond ownership and into preservation, access, and continuity. The museum exists to ensure that important contemporary works are not fragmented, hidden, or lost to time, but cared for as part of a coherent cultural record.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
      <div className="museum-info-card">
        <h3 className="museum-card-title">Long-Term Stewardship</h3>
        <p className="museum-card-description">
          The museum is conceived as a permanent home for contemporary works, allowing art to be cared for, studied, and experienced over time rather than treated as a rotating display.
        </p>
      </div>

      <div className="museum-info-card">
        <h3 className="museum-card-title">Permanent Public Access</h3>
        <p className="museum-card-description">
          By establishing a physical institution, the museum provides sustained public access to significant works and artistic practice within a stable, welcoming cultural setting.
        </p>
      </div>

      <div className="museum-info-card">
        <h3 className="museum-card-title">Living Artistic Practice</h3>
        <p className="museum-card-description">
          Through a visible working studio, the museum places artistic creation at the center of the visitor experience, allowing process and finished work to exist side by side.
        </p>
      </div>

      <div className="museum-info-card">
        <h3 className="museum-card-title">Cultural and Human Impact</h3>
        <p className="museum-card-description">
          Beyond exhibition, the museum supports art therapy and community oriented programs, recognizing art’s capacity to contribute to care, reflection, and public well being.
        </p>
      </div>
    </div>
  </div>
</section>

      
    </main>
  );
}
