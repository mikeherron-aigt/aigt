// app/rwa-tech-fund/page.tsx

import Image from "next/image";

export default function RWATechFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* HERO WRAPPER (match other pages: light gray band behind hero) */}
      <div className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
        <main>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] pt-10 sm:pt-14 lg:pt-20 pb-10 sm:pb-14 lg:pb-20">
                <div className="max-w-[720px]">
                  <p className="text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-black/60">
                    Platform Infrastructure
                  </p>

                  <h1 className="mt-4 text-[34px] leading-[1.08] sm:text-[44px] sm:leading-[1.06] lg:text-[56px] lg:leading-[1.04] font-medium text-black">
                    RWA Tech Fund
                  </h1>

                  <p className="mt-4 text-[16px] leading-[1.6] sm:text-[18px] sm:leading-[1.65] text-black/75">
                    A standalone technology platform that supports regulated private funds.
                    Built for governance, onboarding, and fund operations, with board oversight.
                  </p>

                  <div className="mt-8 space-y-4 text-[15px] leading-[1.8] sm:text-[16px] sm:leading-[1.85] text-black/75">
                    <p>
                      The RWA Tech Fund exists to support the development of a fund operating platform designed
                      to power private investment vehicles.
                    </p>

                    <p>
                      This is a technology focused fund. It is separate from any art fund, museum initiative,
                      or real estate vehicle.
                    </p>

                    <p>
                      What we know for sure: any outside fund that wants to use the platform comes to the board
                      for approval, and if approved, pays fees to the technology company for using the system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative px-4 sm:px-8 lg:px-[40px] pb-10 sm:pb-14 lg:pb-20 lg:pt-20">
                {/* Decorative rules around the hero image (no rounded corners) */}
                <div className="relative">
                  {/* Top rule */}
                  <div className="absolute -top-4 left-0 right-0 h-px bg-black/15" />
                  {/* Left rule */}
                  <div className="absolute top-0 -left-4 bottom-0 w-px bg-black/15" />

                  {/* Image frame */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-white">
                    <Image
                      src="/rwa-tech-hero.png"
                      alt="Abstract, institutional technology infrastructure"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      style={{ objectFit: "cover" }}
                    />

                    {/* Very subtle overlay to keep it consistent and calm */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
                  </div>

                  {/* Bottom rule */}
                  <div className="absolute -bottom-4 left-0 right-0 h-px bg-black/15" />
                  {/* Right rule */}
                  <div className="absolute top-0 -right-4 bottom-0 w-px bg-black/15" />
                </div>

                <p className="mt-3 text-[12px] leading-[1.5] text-black/50">
                  Image direction: institutional, minimal, architectural. Tech feeling without crypto tropes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* BODY */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
        <div className="max-w-[980px]">
          <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.2] font-medium text-black">
            What is being built
          </h2>

          <div className="mt-4 space-y-4 text-[15px] sm:text-[16px] leading-[1.85] text-black/75">
            <p>
              At the center of this initiative is a fund operating platform. The goal is to provide a
              standardized backend system that supports fundraising workflows, investor onboarding, governance,
              and reporting for approved funds.
            </p>

            <p>
              Our affiliated funds, including Ethereum Art Fund and Blue Chip Art Fund, are expected to use the
              same platform as part of their operations. Outside fund sponsors may apply to use the platform
              and are reviewed by the board before onboarding.
            </p>
          </div>

          {/* Single simple callout (removed the second box) */}
          <div className="mt-10 border border-black/10 bg-white p-6">
            <p className="text-[12px] tracking-[0.18em] uppercase text-black/55">
              Governance
            </p>
            <h3 className="mt-2 text-[18px] leading-[1.25] font-medium text-black">
              Board-approved access
            </h3>
            <p className="mt-3 text-[14px] leading-[1.75] text-black/70">
              Outside funds are reviewed by the board before onboarding. If approved, they pay fees to the
              technology company for platform access.
            </p>
          </div>

          <h2 className="mt-14 text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.2] font-medium text-black">
            What investors are supporting
          </h2>

          <div className="mt-4 space-y-4 text-[15px] sm:text-[16px] leading-[1.85] text-black/75">
            <p>
              An investment in the RWA Tech Fund supports the development of the platform, the team building it,
              and the infrastructure that powers current and future approved funds.
            </p>

            <p>
              The core model is simple: funds use the platform, and the technology company earns recurring fees
              for providing that infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
