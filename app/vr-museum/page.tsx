// app/vr-museum/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import VrMuseumClientShell from "./VrMuseumClientShell";

// Force dynamic rendering (keeps behavior consistent with your Home page pattern)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Virtual Museum",
  description:
    "Extending museum grade stewardship, access, and scholarship beyond physical walls.",
};

export default function VrMuseumPage() {
  // Optional: lightweight schema, mirrors the “serious institutional” tone
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "The Virtual Museum",
    description:
      "Extending museum grade stewardship, access, and scholarship beyond physical walls.",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Script
        id="vr-museum-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <main>
        {/* HERO - matches Home page layout/styling */}
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
              <div className="max-w-[637px]">
                <h1 style={{ marginBottom: "17px" }}>
                  The Virtual Museum
                </h1>

                <div className="hero-subtitle">
                  <p>
                    Extending museum grade stewardship, access, and scholarship beyond
                    physical walls.
                  </p>
                </div>

                {/* Same “vertical rule” bullets as your earlier VR page, but using home typography */}
                <div className="mt-8 space-y-3 max-w-[640px]">
                  <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/70 md:text-base">
                    Museum grade context, preserved digitally
                  </div>
                  <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/70 md:text-base">
                    Accurate scale, curated spatial sequencing
                  </div>
                  <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/70 md:text-base">
                    Controlled access for scholars and partners
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[18px] mt-6 sm:mt-8">
                  <Link
                    href="/request-access"
                    className="cta-primary"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Column (single static image, but same sizing container as Home hero) */}
            <div className="relative w-full overflow-hidden bg-gallery-plaster h-[400px] sm:h-[500px] lg:h-[680px]">
              <Image
                src="/vrmuseum.png"
                alt="Virtual Museum"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Decorative Elements (identical to Home) */}
          <div
            className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
            style={{ top: "0", height: "calc(100% - 242px)" }}
          />
          <div
            className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
            style={{ top: "calc(100% - 242px)", height: "242px" }}
          />
        </div>

        {/* Design Bar (identical to Home) */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div
            className="absolute top-0 left-0 h-full bg-gallery-plaster"
            style={{ width: "calc(50vw + 112px)" }}
          />
          <div
            className="absolute top-0 h-full bg-ledger-stone"
            style={{ left: "calc(50vw + 105px)", right: "0" }}
          />
          <div className="max-w-[1440px] w-full h-full relative">
            <div
              className="absolute top-0 w-8 h-full bg-deep-patina"
              style={{ left: "calc(60% - 32px)" }}
            />
          </div>
        </div>

        {/* SECTION 1 */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24 border-b border-black/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2>A permanent digital extension of the collection</h2>

            <div className="mt-6 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
              <p>
                The Virtual Museum is designed as a long term institutional extension
                of the collection, not a digital novelty or consumer experience.
              </p>
              <p>
                Its purpose is deliberate. To provide high fidelity access to the works
                for scholars, curators, institutions, and aligned partners when physical
                access is impractical or impossible. The Virtual Museum mirrors the
                standards of a physical museum, prioritizing accuracy, narrative
                coherence, and preservation over scale or spectacle.
              </p>
              <p>
                This initiative forms part of a broader stewardship strategy focused on
                continuity, legitimacy, and long horizon cultural relevance.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE */}
        <section className="w-full bg-white border-b border-black/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-10 sm:py-14">
            {/* Adjust height here as needed */}
            <div className="w-full h-[80vh]">
              <VrMuseumClientShell variant="embed" />
            </div>
          </div>
        </section>

        {/* Built for seriousness */}
        <section className="w-full bg-white border-b border-black/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3>Built for seriousness, not entertainment</h3>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                  <p>
                    The Virtual Museum is not designed as a mass market platform, a
                    gaming experience, or a consumer facing monetized digital product.
                    It does not prioritize virality, engagement metrics, or consumer
                    traffic.
                  </p>
                  <p>
                    Instead, it functions as an institutional access layer. A controlled
                    environment where artworks can be viewed at accurate scale, within
                    curated spatial contexts, and supported by archival documentation and
                    scholarly narrative.
                  </p>
                  <p>
                    Technology is used quietly and intentionally, in service of
                    preservation, access, and institutional integrity rather than novelty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complement section */}
        <section className="w-full border-b border-black/10" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-4">
                <h3>A complement, not a substitute</h3>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                  <p>The Virtual Museum does not replace the physical museum. It extends it.</p>
                  <p>
                    Where the physical museum provides place, presence, and material
                    authority, the Virtual Museum provides reach and continuity. Together,
                    they form a unified institutional framework that supports exhibition
                    planning, scholarly engagement, and long term narrative stewardship
                    without compromising custodial control of the works.
                  </p>
                  <p>This dual structure allows the collection to remain both deeply grounded and globally accessible.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="w-full bg-white border-b border-black/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <h3>Designed for institutional engagement</h3>

            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-base">
              The Virtual Museum may support a range of stewardship driven use cases, including:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 text-[15px] text-black/75 md:max-w-3xl md:text-base">
              <div className="border-l border-black/15 pl-4">Remote scholarly study and research</div>
              <div className="border-l border-black/15 pl-4">Curatorial collaboration and exhibition planning</div>
              <div className="border-l border-black/15 pl-4">International institutional visibility</div>
              <div className="border-l border-black/15 pl-4">Archival documentation and contextualization</div>
              <div className="border-l border-black/15 pl-4">Controlled private access for aligned partners</div>
            </div>

            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-base">
              Access is intentionally governed. The Virtual Museum is not intended to operate as an
              open public platform. Participation and availability may be permissioned based on
              audience, jurisdiction, and institutional context.
            </p>
          </div>
        </section>

        {/* Technology philosophy */}
        <section className="w-full bg-white border-b border-black/10">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3>Infrastructure over innovation theater</h3>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                  <p>
                    The underlying technology is selected for fidelity, stability, and longevity.
                    Spatial representation, scale accuracy, material rendering, and controlled
                    sequencing are prioritized over speed or novelty.
                  </p>
                  <p>
                    The goal is not to showcase technology. It is to ensure that the digital
                    environment upholds the same standards of care, seriousness, and credibility
                    expected of any museum grade institution.
                  </p>
                  <p>Technology does not define the experience. Stewardship does.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governance */}
        <section className="w-full border-b border-black/10" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <h3>A stewardship asset, not a revenue center</h3>

            <div className="mt-5 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
              <p>
                The Virtual Museum is not intended to operate as a standalone business or revenue
                generating platform. It exists as long term cultural and institutional infrastructure.
              </p>
              <p>
                Governance, curatorial oversight, and narrative control remain aligned with the
                broader stewardship framework. Participation in the Virtual Museum does not create
                new economic rights, liquidity mechanisms, or investor entitlements beyond those
                defined in the governing documents.
              </p>
              <p>Its value lies in trust, continuity, and institutional legitimacy over time.</p>
            </div>
          </div>
        </section>

        {/* Long horizon */}
        <section className="w-full bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <h3>Built for the long horizon</h3>

            <div className="mt-5 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
              <p>
                The Virtual Museum is a future facing initiative grounded in long duration thinking.
                Development, access, and programming are expected to evolve deliberately and
                responsibly, independent of short term timelines or external validation.
              </p>
              <p>
                This platform is designed to mature alongside the collection itself, reinforcing its
                narrative, preserving its context, and supporting institutional engagement across
                decades rather than cycles.
              </p>
            </div>

            <div className="mt-10 border-t border-black/10 pt-8">
              <h4 className="text-sm font-semibold tracking-wide text-black/60">
                Part of a broader stewardship framework
              </h4>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/60">
                The Virtual Museum operates alongside physical museum infrastructure, institutional
                partnerships, and archival systems as part of a unified approach to cultural stewardship.
              </p>
              <p className="mt-4 max-w-3xl text-xs leading-relaxed text-black/50">
                Descriptions of future initiatives are provided for informational and stewardship context
                only and do not constitute an offer, solicitation, or commitment.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
