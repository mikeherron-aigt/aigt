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
      {/* HERO */}
      <section className="w-full !max-w-none bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[650px]">
            {/* Left */}
            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-14">
              <div className="max-w-xl space-y-6 text-black/80">
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

                <p className="italic text-black/60">
                  This is not about recognition. It is about responsibility.
                </p>
              </div>

              <div className="mt-10 flex gap-3">
                <Link
                  href="/request-access"
                  className="px-6 py-3 text-sm border border-gray-300 bg-[#f5f5f5]"
                >
                  Request Access
                </Link>
                <Link
                  href="/stewardship"
                  className="px-6 py-3 text-sm border border-gray-300"
                >
                  Stewardship Overview
                </Link>
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-full h-[420px] lg:h-[650px] bg-white">
              <Image
                src="/girl_viewing_art.png"
                alt="Young girl viewing art in museum"
                fill
                className="object-cover"
                priority
              />

              {/* Decorative overlay */}
              <div className="pointer-events-none absolute inset-6 border border-gray-300" />
              <div className="pointer-events-none absolute left-6 bottom-6 h-3 w-3 bg-gray-300" />
              <div className="pointer-events-none absolute right-6 bottom-6 h-3 w-3 bg-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship Beyond Ownership */}
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2>Stewardship Beyond Ownership</h2>
              <p className="mt-2 text-black/60">
                Responsibility beyond the collection
              </p>

              <div className="mt-8 max-w-xl space-y-4 text-black/70">
                <p>Art holds responsibility beyond possession.</p>
                <p>
                  Our philanthropic approach begins with long-term stewardship.
                  That means preserving artworks with care, documenting their
                  history, and ensuring they remain part of a living cultural
                  conversation.
                </p>
                <p>
                  This commitment reflects a belief that art gains meaning
                  through context and access, not isolation.
                </p>
              </div>
            </div>

            <figure className="p-10 bg-[#f5f5f5] max-w-xl">
              <blockquote className="italic text-black/70">
                Art asks something of the people who care for it. Stewardship is
                how we answer.
              </blockquote>
              <figcaption className="mt-6 text-right text-black/60">
                <strong className="text-black">John Dowling Jr.</strong>
                <div>Steward</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Process + Cards */}
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <div className="relative min-h-[560px] overflow-hidden">
              <h2>
                Stewardship is enforced
                <br />
                through process.
              </h2>

              <p className="mt-6 max-w-xl text-black/70">
                The platform supports multiple funds with independent economics
                and governance. This separation preserves clarity, reduces
                cross-risk, and reinforces institutional credibility.
              </p>

              <Link
                href="/stewardship"
                className="inline-block mt-6 px-6 py-3 border border-gray-300 bg-[#f5f5f5]"
              >
                See the Stewardship Standard
              </Link>

              {/* Decorative globe */}
              <div
                aria-hidden="true"
                className="absolute -left-72 top-36 h-[900px] w-[900px] rounded-full opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#cfcfcf 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                  maskImage:
                    "radial-gradient(circle at 42% 44%, black 0%, black 58%, transparent 74%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 42% 44%, black 0%, black 58%, transparent 74%)",
                }}
              />
            </div>

            {/* Right cards */}
            <div className="space-y-8">
              <div className="p-8 bg-[#f5f5f5]">
                <h3>Sharing Art With the World</h3>
                <p className="italic text-black/60">
                  Access as a Core Principle
                </p>
                <p className="mt-4 text-black/70">
                  We believe art should be experienced, not hidden. When
                  appropriate, works under our stewardship are shared through
                  exhibitions, institutional loans, and public-facing placements.
                </p>
              </div>

              <div className="p-8 bg-[#f5f5f5]">
                <h3>Art as Education</h3>
                <p className="italic text-black/60">
                  Teaching the Next Generation to See
                </p>
                <p className="mt-4 text-black/70">
                  Introducing children and young people to art builds visual
                  literacy, emotional awareness, and creative confidence.
                </p>
              </div>

              <div className="p-8 bg-[#f5f5f5]">
                <h3>Philanthropy as Cultural Infrastructure</h3>
                <p className="italic text-black/60">
                  How art institutions are sustained over time
                </p>
                <p className="mt-4 text-black/70">
                  Philanthropy underwrites the public-facing responsibilities of
                  cultural institutions. The goal is durability, not momentary
                  impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four-card section */}
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2>Title of Something</h2>
            <p className="mt-4 text-black/70">
              An overview of how stewardship supports access, education,
              discipline, and long-term cultural benefit.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Art Therapy and Healing",
                body:
                  "Art can serve people in quieter, more personal ways. In hospitals, rehabilitation settings, and community environments, art has a measurable impact on well-being.",
              },
              {
                title: "Community and Care Settings",
                body:
                  "Beyond traditional institutions, art can play a meaningful role in everyday environments when placed with care and governance.",
              },
              {
                title: "A Thoughtful, Governed Approach",
                body:
                  "All philanthropy initiatives operate within a clear governance framework that ensures accountability and respect.",
              },
              {
                title: "Stewardship Includes People",
                body:
                  "Caring for art means understanding its impact beyond collections. Art deserves to remain present in human life.",
              },
            ].map((card) => (
              <div key={card.title} className="p-10 bg-[#f5f5f5]">
                <h3>{card.title}</h3>
                <p className="mt-4 text-black/70">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer */}
      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-20 text-center">
          <h2>
            Governed platforms for the long-term stewardship
            <br />
            of culturally significant art.
          </h2>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/request-access"
              className="px-6 py-3 border border-gray-300 bg-[#f5f5f5]"
            >
              Request Access
            </Link>
            <Link
              href="/schedule"
              className="px-6 py-3 border border-gray-300"
            >
              Schedule a Discussion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
