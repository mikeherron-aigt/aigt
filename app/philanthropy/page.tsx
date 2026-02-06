import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Art in Service of People - Philanthropy",
  description:
    "Sharing art through stewardship, education and healing. Through philanthropy, education, and art therapy initiatives, we work to place art where it can be experienced, learned from, and used in service of human well-being.",
};

export default function PhilanthropyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full !max-w-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
            {/* Left: Dark panel */}
            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-14 bg-black text-white">
              <h1 className="text-4xl lg:text-5xl leading-tight">Art in Service of People</h1>

              <h3 className="mt-6 text-lg opacity-85">
                Sharing art through stewardship, education and healing
              </h3>

              <div className="max-w-2xl mt-8 space-y-5 text-white/80">
                <p>
                  Art has the power to do more than be admired. When stewarded with care and shared with
                  intention, it can educate, comfort, and connect people.
                </p>

                <p>
                  Through philanthropy, education, and art therapy initiatives, we work to place art where it can
                  be experienced, learned from, and used in service of human well-being.
                </p>

                <p className="italic text-white/70">This is not about recognition. It is about responsibility.</p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/request-access"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium bg-white text-black border border-white"
                >
                  Request Access
                </Link>

                <Link
                  href="/stewardship"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-white/40 text-white hover:border-white/70"
                >
                  Stewardship Overview
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative w-full h-[420px] lg:h-auto">
              <Image
                src="/girl_viewing_art.png"
                alt="Young girl in yellow dress viewing art in museum"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship Beyond Ownership */}
      <section className="w-full !max-w-none bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <h2 className="text-2xl lg:text-3xl">Stewardship Beyond Ownership</h2>

              <h3 className="mt-2 text-base opacity-70">Responsibility beyond the collection</h3>

              <div className="max-w-2xl mt-8 space-y-5 text-black/70">
                <p>Art holds responsibility beyond possession.</p>

                <p>
                  Our philanthropic approach begins with long-term stewardship. That means preserving artworks
                  with care, documenting their history, and ensuring they remain part of a living cultural
                  conversation. Stewardship also means placing art in environments where it can be seen, studied,
                  and understood rather than confined to private storage.
                </p>

                <p>This commitment reflects a belief that art gains meaning through context and access, not isolation.</p>
              </div>
            </div>

            {/* Right: Quote */}
            <div className="flex items-center justify-center">
              <figure className="w-full max-w-xl p-10 bg-[#f5f5f5]">
                <blockquote className="text-black/70 italic">
                  <p>Art asks something of the people who care for it.</p>
                  <p>Stewardship is how we answer.</p>
                </blockquote>

                <figcaption className="mt-8 text-right text-black/70">
                  <p className="font-semibold text-black">John Dowling Jr.</p>
                  <p className="opacity-80">Steward</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship is enforced through process */}
      <section className="w-full !max-w-none bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left column: copy + decorative globe */}
            <div className="relative overflow-hidden min-h-[520px]">
              <h2 className="text-2xl lg:text-3xl leading-snug">
                Stewardship is enforced
                <br />
                through process.
              </h2>

              <p className="max-w-xl mt-6 text-black/70">
                The platform supports multiple funds with independent economics and governance. This separation
                preserves clarity, reduces cross-risk, and reinforces institutional credibility.
              </p>

              <Link
                href="/stewardship"
                className="inline-block mt-7 px-6 py-3 text-sm font-medium border border-gray-300 text-black"
              >
                See the Stewardship Standard
              </Link>

              {/* Decorative dotted globe */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-72 top-40 h-[980px] w-[980px] rounded-full opacity-40"
                style={{
                  backgroundImage: "radial-gradient(#cfcfcf 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                  WebkitMaskImage:
                    "radial-gradient(circle at 40% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 72%)",
                  maskImage:
                    "radial-gradient(circle at 40% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 72%)",
                }}
              />
            </div>

            {/* Right column: stacked cards */}
            <div className="space-y-8 relative z-10">
              <div className="p-8 bg-[#f5f5f5]">
                <h3 className="text-lg font-semibold">Sharing Art With the World</h3>
                <p className="mt-1 text-sm italic text-black/70">Access as a Core Principle</p>

                <div className="mt-5 space-y-4 text-black/70 text-sm leading-relaxed">
                  <p>
                    We believe art should be experienced, not hidden. When appropriate, works under our stewardship
                    are shared through exhibitions, institutional loans, and public-facing placements that expand
                    access while maintaining curatorial and conservation standards.
                  </p>
                  <p>
                    These efforts are undertaken thoughtfully and responsibly, and reflect how museums and cultural
                    institutions around the world are sustained. Public access, education, and stewardship are core
                    components of modern philanthropy, and sharing art through institutional and community contexts
                    is a proven way to preserve cultural value over time.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-[#f5f5f5]">
                <h3 className="text-lg font-semibold">Art as Education</h3>
                <p className="mt-1 text-sm italic text-black/70">Teaching the Next Generation to See</p>

                <div className="mt-5 space-y-4 text-black/70 text-sm leading-relaxed">
                  <p>Art shapes curiosity long before it shapes taste.</p>
                  <p>
                    Introducing children and young people to art builds visual literacy, emotional awareness, and
                    creative confidence. Learning how to look, ask questions, and make something tangible helps
                    develop perspective, empathy, and problem-solving skills that extend well beyond the classroom.
                  </p>
                  <p>
                    Our educational initiatives support programs that bring art into learning environments in ways
                    that are accessible, thoughtful, and age-appropriate. Educational access, particularly for
                    young people, is consistently recognized as one of the most enduring public benefits of cultural
                    institutions.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-[#f5f5f5]">
                <h3 className="text-lg font-semibold">Philanthropy as Cultural Infrastructure</h3>
                <p className="mt-1 text-sm italic text-black/70">How art institutions are sustained over time</p>

                <div className="mt-5 space-y-4 text-black/70 text-sm leading-relaxed">
                  <p>
                    Philanthropy plays a foundational role in sustaining cultural institutions. Around the world,
                    museums, educational programs, and public art initiatives rely on philanthropy to support the
                    work that cannot be reduced to admissions, transactions, or short-term metrics.
                  </p>
                  <p>
                    As public funding becomes more constrained and operational demands increase, philanthropy
                    increasingly underwrites the public-facing responsibilities of cultural institutions. Education,
                    access, preservation, research, and community engagement are not peripheral activities. They are
                    core infrastructure, and philanthropy is what allows them to endure.
                  </p>
                  <p>
                    Our philanthropic approach reflects this reality. We focus on the elements of stewardship that
                    ensure art remains part of civic and cultural life over time. The goal is durability, not
                    momentary impact, but lasting presence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark section with 2x2 cards */}
      <section className="w-full !max-w-none bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl">Title of Something</h2>
            <p className="mt-4 text-white/70">
              An overview of how stewardship supports access, education, discipline, and long-term cultural benefit.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white text-black p-10">
              <h3 className="text-lg font-semibold">Art Therapy and Healing</h3>
              <p className="mt-2 text-sm italic text-black/70">Art as a form of care</p>
              <div className="mt-5 space-y-4 text-sm text-black/70 leading-relaxed">
                <p>
                  Art can serve people in quieter, more personal ways. In hospitals, rehabilitation settings, and
                  community environments, art has a measurable impact on stress, attention, and well-being.
                </p>
                <p>
                  Our art therapy efforts are philanthropic in nature and designed in collaboration with qualified
                  professionals and institutions. They are non-commercial, ethically presented, and operate from
                  management standards.
                </p>
              </div>
            </div>

            <div className="bg-white text-black p-10">
              <h3 className="text-lg font-semibold">Community and Care Settings</h3>
              <p className="mt-2 text-sm italic text-black/70">Placing art where people are</p>
              <div className="mt-5 space-y-4 text-sm text-black/70 leading-relaxed">
                <p>
                  Beyond traditional institutions, art can play a meaningful role in everyday environments.
                </p>
                <p>
                  Where appropriate, we support the presence of art and curated programming in healthcare settings,
                  community organizations, and educational spaces, with processes that ensure works are protected
                  and context is preserved.
                </p>
              </div>
            </div>

            <div className="bg-white text-black p-10">
              <h3 className="text-lg font-semibold">A Thoughtful, Governed Approach</h3>
              <p className="mt-2 text-sm italic text-black/70">Clear boundaries and accountability</p>
              <div className="mt-5 space-y-4 text-sm text-black/70 leading-relaxed">
                <p>
                  All philanthropy initiatives operate within a risk framework and governance structure. This ensures
                  transparency, accountability, and respect for the role art plays in both cultural and human contexts.
                </p>
                <p>
                  Our philanthropic work is not designed to produce financial outcomes. It exists to extend access,
                  support learning, and reinforce meaningful civic stewardship.
                </p>
              </div>
            </div>

            <div className="bg-white text-black p-10">
              <h3 className="text-lg font-semibold">Stewardship Includes People</h3>
              <p className="mt-2 text-sm italic text-black/70">Responsibility beyond the collection</p>
              <div className="mt-5 space-y-4 text-sm text-black/70 leading-relaxed">
                <p>
                  Caring for art means understanding its impact beyond collectors and institutions.
                </p>
                <p>
                  Whether through education, therapy, or public access, our aim is to ensure that art remains
                  present in human life, felt, seen, experienced in ways that are responsible, respectful, and enduring.
                </p>
                <p className="italic">
                  Art holds memory.
                  <br />
                  Art supports learning.
                  <br />
                  Art deserves stewardship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer call to action */}
      <section className="w-full !max-w-none bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-20 text-center">
          {/* Simple mark + wordmark (no external asset dependency) */}
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-[3px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-2 w-2 bg-black/70"
                  style={{ opacity: i === 4 ? 1 : 0.65 }}
                />
              ))}
            </div>
            <p className="text-sm text-black/70">Art Investment Group Trust</p>
          </div>

          <h2 className="mt-8 text-2xl lg:text-3xl">
            Governed platforms for the long-term stewardship
            <br />
            of culturally significant art.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/request-access"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium bg-[#f5f5f5] border border-gray-300 text-black"
            >
              Request Access
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-gray-300 text-black"
            >
              Schedule a Discussion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
