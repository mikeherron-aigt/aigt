// app/philanthropy/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Art in Service of People - Philanthropy",
  description:
    "Sharing art through stewardship, education and healing. Through philanthropy, education, and art therapy initiatives, we work to place art where it can be experienced, learned from, and used in service of human well-being.",
};

function DotGlobeDecoration() {
  // Lightweight SVG “dot globe” so you do not need an asset file.
  // It intentionally crops off the left side like your screenshot.
  return (
    <div className="absolute left-0 bottom-0 -translate-x-[35%] translate-y-[12%] w-[760px] h-[760px] pointer-events-none opacity-[0.35]">
      <svg viewBox="0 0 800 800" className="w-full h-full">
        <defs>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="rgba(0,0,0,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
          </radialGradient>

          <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="2.2" fill="rgba(0,0,0,0.22)" />
          </pattern>

          <mask id="circleMask">
            <rect width="800" height="800" fill="black" />
            <circle cx="420" cy="420" r="320" fill="white" />
          </mask>
        </defs>

        <circle cx="420" cy="420" r="320" fill="url(#dots)" mask="url(#circleMask)" />
        <circle cx="420" cy="420" r="330" fill="url(#fade)" opacity="0.9" />
      </svg>
    </div>
  );
}

function HeroImageFrame() {
  // Matches the “thin frame + corner blocks + bottom-left accent” look from your other hero.
  return (
    <>
      {/* Thin border frame */}
      <div className="absolute inset-6 border border-white/50 pointer-events-none" />

      {/* Corner “ticks” */}
      <div className="absolute left-6 top-6 w-8 h-8 border-l border-t border-white/70 pointer-events-none" />
      <div className="absolute right-6 top-6 w-8 h-8 border-r border-t border-white/70 pointer-events-none" />
      <div className="absolute left-6 bottom-6 w-8 h-8 border-l border-b border-white/70 pointer-events-none" />
      <div className="absolute right-6 bottom-6 w-8 h-8 border-r border-b border-white/70 pointer-events-none" />

      {/* Small corner blocks (bottom corners) */}
      <div className="absolute left-6 bottom-6 w-3 h-3 bg-white/70 pointer-events-none" />
      <div className="absolute right-6 bottom-6 w-3 h-3 bg-white/70 pointer-events-none" />

      {/* Bottom-left accent block outside the image edge */}
      <div className="absolute -left-4 -bottom-4 w-7 h-7 pointer-events-none" style={{ backgroundColor: "#2b4a4a" }} />
    </>
  );
}

const buttonPrimary =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium border transition-colors";
const buttonOutline =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium border transition-colors";

export default function PhilanthropyPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* Hero */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-14 lg:py-20">
            {/* Left */}
            <div className="max-w-xl">
              <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] leading-tight font-semibold text-[#1f2933]">
                Art in Service of People
              </h1>

              <p className="mt-5 text-[18px] leading-relaxed text-[#3b4a54]">
                Sharing art through stewardship, education and healing
              </p>

              <div className="mt-8 space-y-6 text-[18px] leading-relaxed text-[#27323a]">
                <p>
                  Art has the power to do more than be admired. When stewarded with care and shared with intention,
                  it can educate, comfort, and connect people.
                </p>

                <p>
                  Through philanthropy, education, and art therapy initiatives, we work to place art where it can be
                  experienced, learned from, and used in service of human well-being.
                </p>

                <p className="italic">This is not about recognition. It is about responsibility.</p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/request-access"
                  className={buttonPrimary}
                  style={{
                    backgroundColor: "#9aa095",
                    borderColor: "#9aa095",
                    color: "#ffffff",
                  }}
                >
                  Request Access
                </Link>

                <Link
                  href="/stewardship"
                  className={buttonOutline}
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#c9d0d6",
                    color: "#1f2933",
                  }}
                >
                  Stewardship Overview
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="relative w-full">
              {/* Match hero image sizing to your other hero: a fixed, consistent height on desktop */}
              <div className="relative w-full overflow-hidden" style={{ height: 520 }}>
                <Image
                  src="/girl_viewing_art.png"
                  alt="Young girl viewing art in a museum"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <HeroImageFrame />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship Beyond Ownership */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start py-16 lg:py-20">
            <div className="max-w-xl">
              <h2 className="text-[34px] sm:text-[38px] leading-tight font-semibold text-[#1f2933]">
                Stewardship Beyond Ownership
              </h2>
              <p className="mt-3 text-[16px] text-[#3b4a54]">Responsibility beyond the collection</p>

              <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-[#27323a]">
                <p>Art holds responsibility beyond possession.</p>
                <p>
                  Our philanthropic approach begins with long-term stewardship. That means preserving artworks with
                  care, documenting their history, and ensuring they remain part of a living cultural conversation.
                  Stewardship also means placing art in environments where it can be seen, studied, and understood
                  rather than confined to private storage.
                </p>
                <p>This commitment reflects a belief that art gains meaning through context and access, not isolation.</p>
              </div>
            </div>

            <div className="flex lg:justify-end">
              <figure
                className="w-full max-w-[560px] p-10"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <blockquote className="text-[18px] italic leading-relaxed text-[#1f2933]">
                  Art asks something of the people who care for it. <br />
                  Stewardship is how we answer.
                </blockquote>

                <figcaption className="mt-6 text-right text-[#3b4a54]">
                  <div className="font-semibold text-[#1f2933]">John Dowling Jr.</div>
                  <div className="text-sm">Steward</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship is enforced through process + right column cards */}
      <section className="relative w-full !max-w-none overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-16 lg:py-20 relative">
            {/* Left: headline + button + globe decoration */}
            <div className="relative">
              <h2 className="text-[34px] sm:text-[38px] leading-tight font-semibold text-[#1f2933]">
                Stewardship is enforced <br /> through process.
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#3b4a54]">
                The platform supports multiple funds with independent economics and governance. This separation
                preserves clarity, reduces cross-risk, and reinforces institutional credibility.
              </p>

              <div className="mt-8">
                <Link
                  href="/stewardship"
                  className={buttonPrimary}
                  style={{
                    backgroundColor: "#9aa095",
                    borderColor: "#9aa095",
                    color: "#ffffff",
                  }}
                >
                  See the Stewardship Standard
                </Link>
              </div>

              <DotGlobeDecoration />
            </div>

            {/* Right: three stacked cards */}
            <div className="space-y-8">
              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[20px] font-semibold text-[#1f2933]">Sharing Art With the World</h3>
                <p className="mt-2 text-[14px] font-semibold text-[#3b4a54]">Access as a Core Principle</p>

                <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    We believe art should be experienced, not hidden. When appropriate, works under our stewardship
                    are shared through exhibitions, institutional loans, and public-facing placements that expand
                    access while maintaining curatorial and conservation standards.
                  </p>
                  <p>
                    These efforts are undertaken thoughtfully and responsibly, and reflect how museums and cultural
                    institutions around the world are sustained. Public access, education, and stewardship are core
                    components of modern philanthropy, and sharing art through institutional and community contexts is
                    a proven way to preserve cultural value over time.
                  </p>
                </div>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[20px] font-semibold text-[#1f2933]">Art as Education</h3>
                <p className="mt-2 text-[14px] font-semibold text-[#3b4a54]">Teaching the Next Generation to See</p>

                <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>Art shapes curiosity long before it shapes taste.</p>
                  <p>
                    Introducing children and young people to art builds visual literacy, emotional awareness, and
                    creative confidence. Learning how to look, ask questions, and make something tangible helps
                    develop perspective, empathy, and problem-solving skills that extend well beyond the classroom.
                  </p>
                  <p>
                    Our educational initiatives support programs that bring art into learning environments in ways that
                    are accessible, thoughtful, and age-appropriate. Educational access, particularly for young people,
                    is consistently recognized as one of the most enduring public benefits of cultural institutions.
                  </p>
                </div>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[20px] font-semibold text-[#1f2933]">Philanthropy as Cultural Infrastructure</h3>
                <p className="mt-2 text-[14px] font-semibold text-[#3b4a54]">How art institutions are sustained over time</p>

                <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    Philanthropy plays a foundational role in sustaining cultural institutions. Around the world,
                    museums, educational programs, and public art initiatives rely on philanthropy to support the work
                    that cannot be reduced to admissions, transactions, or short-term metrics.
                  </p>
                  <p>
                    As public funding becomes more constrained and operational demands increase, philanthropy
                    increasingly underwrites the public-facing responsibilities of cultural institutions. Education,
                    access, preservation, research, and community engagement are not peripheral activities. They are
                    core infrastructure, and philanthropy is what allows them to endure.
                  </p>
                  <p>
                    Our philanthropic approach reflects this reality. We focus on the elements of stewardship that
                    ensure art remains part of civic and cultural life over time. Supporting education programs,
                    enabling public access, and sustaining environments where art can be experienced thoughtfully are
                    not add-ons to stewardship. They are what make stewardship meaningful.
                  </p>
                  <p>
                    By treating philanthropy as infrastructure rather than charity, we align our work with the
                    long-term needs of cultural institutions and the communities they serve. The goal is durability.
                    Not momentary impact, but lasting presence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four-card section with centered heading */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="py-16 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-[34px] sm:text-[38px] leading-tight font-semibold text-[#1f2933]">
                Title of Something
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[#3b4a54]">
                An overview of how stewardship practice, acquisition discipline, and long-term accountability align.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[18px] font-semibold text-[#1f2933]">Art Therapy and Healing</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  Art can be a form of care.
                </p>
                <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    Art can serve people in quieter, more personal ways. For individuals navigating illness, grief,
                    isolation, or emotional distress, creative engagement can provide stability and relief.
                  </p>
                  <p>
                    Our art therapy efforts are philanthropic in nature and designed in collaboration with qualified
                    professionals and organizations. They are non-commercial, ethically governed, and operated from
                    management costs.
                  </p>
                  <p>
                    The purpose is not to position art as a cure, but to make creative engagement available as a
                    supportive and dignified resource.
                  </p>
                </div>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[18px] font-semibold text-[#1f2933]">Community and Care Settings</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  Placing Art Where People Are
                </p>
                <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    Beyond traditional institutions, art can play a meaningful role in everyday environments.
                  </p>
                  <p>
                    Where appropriate, we support the presence of art and creative programming in healthcare settings,
                    community organizations, and learning spaces, and partner with vetted institutions where impact is
                    measurable and sustained.
                  </p>
                  <p>
                    These initiatives are especially meaningful when rooted in local community, where trust and
                    cultural institutions can serve as anchoring civic resources.
                  </p>
                </div>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[18px] font-semibold text-[#1f2933]">A Thoughtful, Governed Approach</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  Clear boundaries and accountability
                </p>
                <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    All philanthropic initiatives operate within a clear governance framework. This ensures
                    transparency, accountability, and respect for the role art plays in both cultural and human
                    contexts.
                  </p>
                  <p>
                    Our philanthropic work is not designed to produce financial outcomes. It exists to extend access,
                    support learning, and contribute meaningfully to the cultural life of the communities we serve.
                  </p>
                </div>
              </div>

              <div className="p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="text-[18px] font-semibold text-[#1f2933]">Stewardship Includes People</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  Responsibility beyond the collection
                </p>
                <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#3b4a54]">
                  <p>
                    Caring for art means understanding its impact beyond collections and institutions.
                  </p>
                  <p>
                    Whether through education, therapy, or public access, our role is to ensure that art remains
                    present in human life. Seen, felt, and experienced in ways that are responsible, respectful, and
                    enduring.
                  </p>
                  <p className="italic">
                    Art holds memory. <br />
                    Art supports meaning. <br />
                    Stewardship means honoring all of it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
          <div className="py-16 lg:py-20 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 text-[#1f2933]">
              <div className="relative w-10 h-10">
                <Image src="/logo-mark.png" alt="Art Investment Group Trust" fill className="object-contain" />
              </div>
              <div className="text-[14px] font-medium text-[#1f2933]">Art Investment Group Trust</div>
            </div>

            <h2 className="mt-6 text-[28px] sm:text-[32px] font-semibold text-[#1f2933] max-w-3xl">
              Governed platforms for the long-term stewardship <br className="hidden sm:block" />
              of culturally significant art.
            </h2>

            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href="/request-access"
                className={buttonPrimary}
                style={{
                  backgroundColor: "#9aa095",
                  borderColor: "#9aa095",
                  color: "#ffffff",
                }}
              >
                Request Access
              </Link>

              <Link
                href="/schedule"
                className={buttonOutline}
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#c9d0d6",
                  color: "#1f2933",
                }}
              >
                Schedule a Discussion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
