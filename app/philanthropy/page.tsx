'use client';

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

/**
 * IMPORTANT:
 * - In the Next.js app router, `app/philanthropy/page.tsx` should import shared components from `/components`.
 * - This path avoids build failures caused by relative import confusion across environments.
 */
const InteractiveGlobe = dynamic(
  () => import("../components/InteractiveGlobe"),
  { ssr: false }
);


export default function PhilanthropyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* HERO WRAPPER (must be f5f5f5 like Home) */}
      <div className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
        <main>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
                <div className="max-w-[637px]">
                  <h1 style={{ marginBottom: "17px" }}>
                    Art in Service of People
                  </h1>

                  <div className="hero-subtitle">
                    <p>Sharing art through stewardship, education, and healing.</p>
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

                  {/* CTA Buttons */}
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

                    <Link
                      href="/stewardship"
                      className="cta-secondary"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Stewardship Overview
                    </Link>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  <Image
                    src="/girl_viewing_art.png"
                    alt="A child viewing a painting in a museum"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements (VERTICAL BAR + deep green cube alignment) */}
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
              style={{ top: "0", height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
              style={{ top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>

          {/* DESIGN BAR (HORIZONTAL) */}
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
        </main>
      </div>

      {/* EVERYTHING BELOW HERO SHOULD BE WHITE */}
      <div className="w-full bg-white">
        {/* Stewardship Beyond Ownership */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
                <div className="max-w-[711px]">
                  <h2>Stewardship Beyond Ownership</h2>
                  <h3>Responsibility beyond the collection</h3>

                  <p>Art holds responsibility beyond possession.</p>
                  <p>
                    Our philanthropic approach begins with long-term stewardship.
                    That means preserving works with care, documenting their history,
                    and ensuring they remain part of a living cultural conversation.
                    Stewardship also means placing art in environments where it can be
                    seen, studied, and understood rather than confined to private storage.
                  </p>
                  <p>
                    This commitment reflects a belief that art gains meaning through context
                    and access, not isolation.
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-8 lg:px-[80px] pt-10 lg:pt-0 flex items-start justify-center">
                <div className="w-full p-10" style={{ backgroundColor: "#f5f5f5" }}>
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
          </div>
        </section>

        {/* Globe + Stewardship Process Section */}
        <section className="relative w-full bg-white py-12 sm:py-16 lg:py-24 overflow-visible">
        
          
 {/* GLOBE (bleeds off left like Figma, scrolls with section) */}
<div
  className="pointer-events-none absolute hidden lg:block z-0"
  style={{
    // anchor from viewport left edge, but still positioned within the section
    left: "calc(-300px + max(0px, (100dvw - 1440px) / 2))",
    top: "420px",

    width: "1100px",
    height: "1100px",
    overflow: "visible",
  }}
>
  <InteractiveGlobe width={1100} height={1100} />
</div>


       

          {/* Content sits above globe */}
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-0">
              {/* Left */}
              <div className="px-4 sm:px-8 lg:px-[80px] lg:col-span-5 flex flex-col justify-start">
                <h2 style={{ maxWidth: 520 }}>
                  Stewardship is enforced
                  <br />
                  through process.
                </h2>

                <p style={{ maxWidth: 520 }}>
                  The platform supports multiple funds with independent economics and governance.
                  This separation preserves clarity, reduces cross-risk, and reinforces institutional credibility.
                </p>

                <div className="mt-6">
                  <Link
                    href="/stewardship"
                    className="cta-primary"
                    style={{
                      textDecoration: "none",
                      width: "fit-content",
                      display: "inline-flex",
                    }}
                  >
                    See the Stewardship Standard
                  </Link>
                </div>
              </div>

              {/* Spacer */}
              <div className="hidden lg:block lg:col-span-2" />

              {/* Right */}
              <div className="px-4 sm:px-8 lg:px-[80px] lg:col-span-5 mt-10 lg:mt-0 space-y-6">
                <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                  <h3>Sharing Art With the World</h3>
                  <h4>Access as a Core Principle</h4>
                  <p>
                    We believe art should be experienced, not hidden. When appropriate, works under our stewardship
                    are shared through exhibitions, institutional loans, and public-facing placements that expand access
                    while maintaining curatorial and conservation standards.
                  </p>
                  <p>
                    These efforts are undertaken thoughtfully and responsibly, and reflect how museums and cultural institutions
                    around the world are sustained. Public access, education, and stewardship are core components of modern philanthropy.
                  </p>
                </div>

                <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                  <h3>Art as Education</h3>
                  <h4>Teaching the Next Generation to See</h4>
                  <p>Art shapes curiosity long before it shapes taste.</p>
                  <p>
                    Introducing children and young people to art builds visual literacy, emotional awareness, and creative confidence.
                    Learning how to look, ask questions, and make something tangible helps develop perspective, empathy, and problem-solving skills.
                  </p>
                </div>

                <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                  <h3>Philanthropy as Cultural Infrastructure</h3>
                  <h4>How art institutions are sustained over time</h4>
                  <p>
                    Philanthropy plays a foundational role in sustaining cultural institutions. Around the world,
                    museums, educational programs, and public art initiatives rely on philanthropy to support work
                    that cannot be reduced to admissions, transactions, or short-term metrics.
                  </p>
                  <p>
                    By treating philanthropy as infrastructure rather than charity, we align our work with the long-term needs
                    of cultural institutions and the communities they serve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Title of Something + 4 cards */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="text-center max-w-[995px] mx-auto">
              <h2>Title of Something</h2>
              <p>
                An overview of how stewardship practice, acquisition discipline, and long-term accountability align.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8 max-w-[1280px] mx-auto">
              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3>Art Therapy and Healing</h3>
                <p>Art can be a form of care.</p>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3>Community and Care Settings</h3>
                <p>Placing art where people are.</p>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3>A Thoughtful, Governed Approach</h3>
                <p>Clear boundaries and accountability.</p>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3>Stewardship Includes People</h3>
                <p>Responsibility beyond the collection.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              <div className="flex justify-center">
                <Link
                  href="/request-access"
                  className="footer-cta-primary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  Schedule a Discussion
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
