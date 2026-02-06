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
    <main
      className="philanthropy-page min-h-screen"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {/* Hero Section */}
      <section className="relative w-full !max-w-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
            <div
              className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16"
              style={{ backgroundColor: "#f8f8f8" }}
            >
              <h1>Art in Service of People</h1>

              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Sharing art through stewardship, education and healing
              </h3>

              <div className="max-w-2xl space-y-4">
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

                <p style={{ fontStyle: "italic" }}>
                  This is not about recognition. It is about responsibility.
                </p>
              </div>
            </div>

            <div className="relative w-full h-[400px] lg:h-auto">
              <Image
                src="/girl_viewing_art.png"
                alt="Young girl viewing art in a museum"
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
      <section className="w-full bg-white !max-w-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16">
              <h2>Stewardship Beyond Ownership</h2>

              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Responsibility beyond the collection
              </h3>

              <div className="max-w-2xl space-y-4">
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

            <div className="flex items-center justify-center px-6 sm:px-8 lg:px-16 py-12 lg:py-16">
              <figure
                className="max-w-md p-8 lg:p-12"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <blockquote>
                  <p style={{ fontStyle: "italic" }}>
                    Art asks something of the people who care for it. Stewardship
                    is how we answer.
                  </p>
                </blockquote>

                <figcaption className="text-right mt-6">
                  <p>
                    <strong>John Dowling Jr.</strong>
                  </p>
                  <p style={{ opacity: 0.85 }}>Steward</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Stewardship is enforced through process */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2>Stewardship is enforced through process.</h2>

              <p className="max-w-xl mt-4">
                The platform supports multiple funds with independent economics
                and governance. This separation preserves clarity, reduces
                cross-risk, and reinforces institutional credibility.
              </p>

              <Link
                href="/stewardship"
                className="inline-block mt-6 px-6 py-3 text-sm font-medium border border-gray-300"
              >
                See the Stewardship Standard
              </Link>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-white">
                <h3>Sharing Art With the World</h3>
                <p className="italic mb-4">Access as a Core Principle</p>
                <p>
                  We believe art should be experienced, not hidden. When
                  appropriate, works under our stewardship are shared through
                  exhibitions, institutional loans, and public-facing placements.
                </p>
                <p>
                  Public access, education, and stewardship are core components
                  of modern philanthropy and a proven way to preserve cultural
                  value over time.
                </p>
              </div>

              <div className="p-8 bg-white">
                <h3>Art as Education</h3>
                <p className="italic mb-4">
                  Teaching the Next Generation to See
                </p>
                <p>
                  Introducing children and young people to art builds visual
                  literacy, emotional awareness, and creative confidence.
                </p>
                <p>
                  Educational access is consistently recognized as one of the
                  most enduring public benefits of cultural institutions.
                </p>
              </div>

              <div className="p-8 bg-white">
                <h3>Philanthropy as Cultural Infrastructure</h3>
                <p className="italic mb-4">
                  How art institutions are sustained over time
                </p>
                <p>
                  Philanthropy underwrites the public-facing responsibilities of
                  cultural institutions including education, access,
                  preservation, and research.
                </p>
                <p>
                  The goal is durability. Not momentary impact, but lasting
                  presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
