// app/philanthropy/page.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import InteractiveGlobe from "../components/InteractiveGlobe";

export default function PhilanthropyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="w-full bg-[#f5f5f5]">
        <main>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Left Content */}
              <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
                <div className="max-w-[637px]">
                  <h1 className="mb-[17px]">Art in Service of People</h1>

                  <div className="hero-subtitle">
                    <p>
                      Sharing art through stewardship, education, and healing.
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-8 space-y-6 text-[#1f2933]">
                    <p>
                      Art has the power to do more than be admired. When stewarded
                      with care and shared with intention, it can educate, comfort,
                      and connect people.
                    </p>

                    <p>
                      Through philanthropy, education, and art therapy initiatives,
                      we work to place art where it can be experienced, learned from,
                      and used in service of human well-being.
                    </p>

                    <p className="italic">
                      This is not about recognition. It is about responsibility.
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-[18px] mt-6 sm:mt-8">
                    <Link
                      href="/request-access"
                      className="cta-primary flex items-center justify-center"
                    >
                      Request Access
                    </Link>

                    <Link
                      href="/stewardship"
                      className="cta-secondary flex items-center justify-center"
                    >
                      Stewardship Overview
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Globe */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-[#f5f5f5]">
                <InteractiveGlobe />
              </div>
            </div>

            {/* Vertical Decorative Bar */}
            <div
              className="absolute hidden lg:block w-8 bg-white pointer-events-none"
              style={{ left: "calc(60% - 32px)", top: 0, height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute hidden lg:block w-8 bg-ledger-stone pointer-events-none"
              style={{ left: "calc(60% - 32px)", top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>

          {/* Horizontal Design Bar */}
          <div className="w-full h-[36px] relative hidden lg:flex justify-center">
            <div
              className="absolute left-0 top-0 h-full bg-gallery-plaster"
              style={{ width: "calc(50vw + 112px)" }}
            />
            <div
              className="absolute top-0 h-full bg-ledger-stone"
              style={{ left: "calc(50vw + 105px)", right: 0 }}
            />

            <div className="max-w-[1440px] w-full h-full relative">
              <div
                className="absolute top-0 w-8 h-full bg-deep-patina"
                style={{ left: "calc(60% - 32px)" }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* BELOW HERO */}
      <div className="w-full bg-white">
        {/* Stewardship Beyond Ownership */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1fr_40%] gap-0">
            <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
              <div className="max-w-[711px]">
                <h2>Stewardship Beyond Ownership</h2>
                <h3>Responsibility beyond the collection</h3>

                <p>Art holds responsibility beyond possession.</p>

                <p>
                  Our philanthropic approach begins with long-term stewardship.
                  That means preserving works with care, documenting their history,
                  and ensuring they remain part of a living cultural conversation.
                </p>

                <p>
                  This commitment reflects a belief that art gains meaning through
                  context and access, not isolation.
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-8 lg:px-[80px] pt-10 lg:pt-0 flex items-start justify-center">
              <div className="w-full p-10 bg-[#f5f5f5]">
                <p className="italic text-[18px] leading-relaxed">
                  Art asks something of the people who care for it.
                  <br />
                  Stewardship is how we answer.
                </p>
                <div className="mt-6 text-right">
                  <div className="font-medium">John Dowling Jr.</div>
                  <div className="text-sm opacity-70">Steward</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stewardship Through Process */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1fr_40%] gap-0">
            <div className="px-4 sm:px-8 lg:px-[80px]">
              <h2>
                Stewardship is enforced
                <br />
                through process.
              </h2>

              <p className="max-w-[520px]">
                The platform supports multiple funds with independent economics
                and governance. This separation preserves clarity and reinforces
                institutional credibility.
              </p>

              <div className="mt-6">
                <Link
                  href="/stewardship"
                  className="cta-primary inline-flex"
                >
                  See the Stewardship Standard
                </Link>
              </div>
            </div>

            <div className="px-4 sm:px-8 lg:px-[80px] mt-10 lg:mt-0 space-y-6">
              <div className="p-10 bg-[#f5f5f5]">
                <h3>Sharing Art With the World</h3>
                <h4>Access as a Core Principle</h4>
                <p>
                  We believe art should be experienced, not hidden. Works are
                  shared through exhibitions and institutional loans where
                  appropriate.
                </p>
              </div>

              <div className="p-10 bg-[#f5f5f5]">
                <h3>Art as Education</h3>
                <h4>Teaching the Next Generation to See</h4>
                <p>
                  Introducing young people to art builds visual literacy,
                  emotional awareness, and creative confidence.
                </p>
              </div>

              <div className="p-10 bg-[#f5f5f5]">
                <h3>Philanthropy as Cultural Infrastructure</h3>
                <h4>How institutions are sustained</h4>
                <p>
                  Philanthropy supports work that cannot be reduced to
                  transactions or short-term metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] text-center">
            <h2 className="max-w-[912px] mx-auto">
              Governed platforms for the long-term stewardship of culturally
              significant art.
            </h2>

            <div className="mt-10">
              <Link
                href="/request-access"
                className="footer-cta-primary inline-flex"
              >
                Schedule a Discussion
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
