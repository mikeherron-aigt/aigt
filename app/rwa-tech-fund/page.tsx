'use client';

import Link from "next/link";
import Image from "next/image";

export default function RWATechFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        {/* Hero Section (matches About page structure) */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24 flex items-center">
                <div className="max-w-[711px]">
                  <h1>RWA Tech Fund</h1>

                  <div className="hero-subtitle flex flex-col gap-4">
                    <p>
                      A standalone platform designed to power regulated private funds with consistent operations,
                      governance, and reporting.
                    </p>

                    <p>
                      This is a technology focused fund. It is separate from any art fund, museum initiative, or real
                      estate vehicle.
                    </p>

                    <p>
                      What we know for sure: any outside fund that wants to use the platform comes to the board for
                      approval, and if approved, pays fees to the technology company for using the system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden">
                <Image
                  src="/rwa-tech-hero.png"
                  alt="Abstract, institutional technology infrastructure"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 601px"
                />
              </div>
            </div>

            {/* Decorative Elements (match About exactly) */}
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
              style={{ top: "0", height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
              style={{ top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>
        </section>

        {/* Design Bar (match About exactly) */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{ width: "calc(50vw + 112px)" }} />
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(50vw + 105px)", right: "0" }} />
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }} />
          </div>
        </div>

        {/* Section 1: What is being built (simple white module) */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-gallery-plaster">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[1fr_40%] gap-10 lg:gap-14 items-start">
              <div className="max-w-[711px] flex flex-col gap-4">
                <h2 className="m-0">What is being built</h2>
                <p>
                  At the center of this initiative is a fund operating platform. The goal is to provide a standardized
                  backend system that supports fundraising workflows, investor onboarding, governance, and reporting for
                  approved funds.
                </p>
                <p>
                  The platform is being developed as a standalone operating company so it can be built, funded, and
                  scaled independently.
                </p>
              </div>

              {/* Governance callout (different format) */}
              <div className="bg-paper-white p-10">
                <p className="uppercase tracking-[0.08em] text-[11px] font-medium text-archive-slate m-0">
                  Governance
                </p>
                <h3 className="mt-4">Board-approved access</h3>
                <p className="mt-4">
                  Outside funds are reviewed by the board before onboarding. If approved, they pay fees to the
                  technology company for platform access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How the platform is used (light gray module) */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
              <div className="max-w-[711px]">
                <h2 className="m-0">How the platform is used</h2>
                <p className="mt-4">
                  Approved funds use the platform to support core operational needs. This keeps workflows consistent and
                  governance clear across the ecosystem.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-10">
                  <h3 className="m-0">Onboarding</h3>
                  <p className="mt-4">
                    Investor onboarding and accreditation workflows built for a clean, repeatable process.
                  </p>
                </div>

                <div className="bg-white p-10">
                  <h3 className="m-0">Governance</h3>
                  <p className="mt-4">
                    Structured approval flows that keep oversight explicit and consistent.
                  </p>
                </div>

                <div className="bg-white p-10">
                  <h3 className="m-0">Reporting</h3>
                  <p className="mt-4">
                    Fund level reporting and ongoing investor communications in a consistent format.
                  </p>
                </div>

                <div className="bg-white p-10">
                  <h3 className="m-0">Operations</h3>
                  <p className="mt-4">
                    A standardized backend system that reduces fragmentation and manual processes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why a separate technology fund (white module, different layout) */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-gallery-plaster">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[900px]">
              <h2 className="m-0">Why a separate technology fund</h2>
              <div className="mt-6 flex flex-col gap-4">
                <p>
                  The technology carries a different risk profile than art, museum initiatives, or real estate. The goal
                  of separating the technology into its own operating company and fund is clarity, risk isolation, and
                  long term scalability.
                </p>
                <p>
                  Investors in the RWA Tech Fund are investing in the technology business itself, not in underlying art
                  holdings, museum initiatives, or real estate projects.
                </p>
              </div>
            </div>

            {/* Three-step bar module */}
            <div className="mt-10 bg-paper-white">
              <div className="px-10 py-10">
                <h3 className="m-0">How platform fees turn into a business</h3>
                <p className="mt-4 max-w-[850px]">
                  Approved funds pay fees to the technology company for using the platform. Those fees support buildout,
                  maintenance, and ongoing operations.
                </p>
              </div>

              <div className="grid md:grid-cols-3">
                <div className="p-10 border-t border-gallery-plaster md:border-t-0 md:border-r border-gallery-plaster bg-white">
                  <p className="uppercase tracking-[0.08em] text-[11px] font-medium text-archive-slate m-0">01</p>
                  <h3 className="mt-4 m-0">Build</h3>
                  <p className="mt-4 m-0">
                    Core platform development and infrastructure that supports real fund operations.
                  </p>
                </div>
                <div className="p-10 border-t border-gallery-plaster md:border-t-0 md:border-r border-gallery-plaster bg-white">
                  <p className="uppercase tracking-[0.08em] text-[11px] font-medium text-archive-slate m-0">02</p>
                  <h3 className="mt-4 m-0">Maintain</h3>
                  <p className="mt-4 m-0">
                    Ongoing maintenance, security hardening, and operational continuity.
                  </p>
                </div>
                <div className="p-10 border-t border-gallery-plaster md:border-t-0 bg-white">
                  <p className="uppercase tracking-[0.08em] text-[11px] font-medium text-archive-slate m-0">03</p>
                  <h3 className="mt-4 m-0">Scale</h3>
                  <p className="mt-4 m-0">
                    Additional approved funds onboard over time, increasing recurring platform revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: What investors are supporting (gray module, icon-less tiles) */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-10 sm:mb-12 lg:mb-14 max-w-[995px] mx-auto">
              <h2 className="text-center m-0">What investors are supporting</h2>
              <p className="text-center max-w-[820px] m-0">
                An investment in the RWA Tech Fund supports the development of the platform, the team building it, and
                the infrastructure that powers current and future approved funds.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-10 min-h-[220px] flex flex-col gap-3">
                <h3 className="m-0">Platform development</h3>
                <p className="m-0">
                  Funding core engineering work that makes the platform real and operational.
                </p>
              </div>
              <div className="bg-white p-10 min-h-[220px] flex flex-col gap-3">
                <h3 className="m-0">Technology team</h3>
                <p className="m-0">
                  Building and maintaining the team responsible for delivery, security, and continuity.
                </p>
              </div>
              <div className="bg-white p-10 min-h-[220px] flex flex-col gap-3">
                <h3 className="m-0">Shared infrastructure</h3>
                <p className="m-0">
                  A backend system that powers internal funds and approved third party funds.
                </p>
              </div>
              <div className="bg-white p-10 min-h-[220px] flex flex-col gap-3">
                <h3 className="m-0">Recurring model</h3>
                <p className="m-0">
                  A business model based on platform access fees paid by approved funds over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: FAQ (white module, details elements) */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-gallery-plaster">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[900px]">
              <h2 className="m-0">FAQ</h2>
              <p className="mt-4">
                Fast answers to the questions that typically come up early.
              </p>

              <div className="mt-8 flex flex-col">
                {[
                  {
                    q: "Is every fund allowed to onboard?",
                    a: "No. Outside funds are reviewed by the board before onboarding. Approval is required.",
                  },
                  {
                    q: "Is this tied to a specific asset class?",
                    a: "The platform is being built as infrastructure. Approved funds may span different asset classes over time.",
                  },
                  {
                    q: "Is this a token launch?",
                    a: "No. This page describes fund operations infrastructure. Anything beyond that would be a separate discussion and timeline.",
                  },
                  {
                    q: "What is the business model?",
                    a: "Approved funds pay fees to the technology company for platform access and services.",
                  },
                ].map((item) => (
                  <details key={item.q} className="border-t border-gallery-plaster py-6">
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                      <span className="text-[16px] font-medium">{item.q}</span>
                      <span className="text-[18px] opacity-50">+</span>
                    </summary>
                    <p className="mt-4 mb-0">{item.a}</p>
                  </details>
                ))}
                <div className="border-t border-gallery-plaster" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: CTA (gray module) */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="bg-white p-10 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-[760px]">
                <h2 className="m-0">Request materials</h2>
                <p className="mt-4 mb-0">
                  If you are evaluating fit, we will share the materials and walk through the operating model, governance,
                  and platform strategy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/request-access" className="footer-cta-primary" style={{ textDecoration: "none" }}>
                  Request Access
                </Link>
                <Link
                  href="/about"
                  className="footer-cta-secondary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  Learn more
                </Link>
              </div>
            </div>

            <p className="mt-6 text-[12px] text-archive-slate max-w-[900px]">
              Private offering. Information provided for discussion purposes only.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
