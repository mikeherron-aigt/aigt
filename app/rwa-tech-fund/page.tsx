'use client';

import Image from "next/image";

export default function RWATechFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24 flex items-center">
                <div className="max-w-[711px]">
                  <h1>RWA Tech Fund</h1>

                  <div className="hero-subtitle flex flex-col gap-4">
                    <p>
                      A standalone platform designed to power regulated private funds with consistent operations, governance,
                      and reporting.
                    </p>

                    <p>
                      This is a technology focused fund. It is separate from any art fund, museum initiative, or real estate
                      vehicle.
                    </p>

                    <p>
                      What we know for sure: any outside fund that wants to use the platform comes to the board for approval,
                      and if approved, pays fees to the technology company for using the system.
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

        {/* Minimal Body */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-gallery-plaster">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px] flex flex-col gap-4">
              <h2 className="m-0">What is being built</h2>
              <p>
                At the center of this initiative is a fund operating platform. The goal is to provide a standardized backend
                system that supports fundraising workflows, investor onboarding, governance, and reporting for approved funds.
              </p>
              <p>
                The platform is being developed as a standalone operating company so it can be built, funded, and scaled
                independently.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px] flex flex-col gap-4">
              <h2 className="m-0">What investors are supporting</h2>
              <p>
                An investment in the RWA Tech Fund supports the development of the platform, the team building it, and the
                infrastructure that powers current and future approved funds.
              </p>
              <p>
                The model is simple: funds use the platform, and the technology company earns recurring fees for providing
                that infrastructure.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
