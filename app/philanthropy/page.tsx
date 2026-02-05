import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InteractiveGlobe from "@/components/InteractiveGlobe";

export const metadata: Metadata = {
  title: "Art in Service of People - Philanthropy",
  description:
    "Sharing art through stewardship, education and healing. Through philanthropy, education, and art therapy initiatives, we work to place art where it can be experienced, learned from, and used in service of human well-being.",
};

export default function PhilanthropyPage() {
  return (
    <main className="philanthropy-page min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Hero Section - Split Layout */}
      <section className="relative w-full !max-w-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
            {/* Left: Text Content */}
            <div
              className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16"
              style={{ backgroundColor: "#f8f8f8" }}
            >
              <h1>Art in Service of People</h1>

              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Sharing art through stewardship, education and healing
              </h3>

              <div className="max-w-2xl">
                <p>
                  Art has the power to do more than be admired. When stewarded with care and shared with
                  intention, it can educate, comfort, and connect people.
                </p>

                <p>
                  Through philanthropy, education, and art therapy initiatives, we work to place art where it
                  can be experienced, learned from, and used in service of human well-being.
                </p>

                <p style={{ fontStyle: "italic" }}>This is not about recognition. It is about responsibility.</p>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative w-full h-[400px] lg:h-auto">
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

      {/* Stewardship Beyond Ownership Section */}
      <section className="w-full bg-white !max-w-none">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] relative">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16 bg-white">
              <h2>Stewardship Beyond Ownership</h2>

              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Responsibility beyond the collection
              </h3>

              <div className="max-w-2xl">
                <p>Art holds responsibility beyond possession.</p>

                <p>
                  Our philanthropic approach begins with long-term stewardship. That means preserving artworks
                  with care, documenting their history, and ensuring they remain part of a living cultural
                  conversation. Stewardship also means placing art in environments where it can be seen,
                  studied, and understood rather than confined to private storage.
                </p>

                <p>
                  This commitment reflects a belief that art gains meaning through context and access, not
                  isolation.
                </p>
              </div>
            </div>

            {/* Right: White background with floating quote box */}
            <div className="relative bg-white flex items-center justify-center px-6 sm:px-8 lg:px-16 py-12 lg:py-16">
              {/* Floating Quote Card */}
              <figure className="max-w-md p-8 lg:p-12" style={{ backgroundColor: "#f8f8f8" }}>
                <blockquote>
                  <p style={{ fontStyle: "italic" }}>
                    Art asks something of the people who care for it. Stewardship is how we answer.
                  </p>
                </blockquote>

                <figcaption className="text-right">
                  <p style={{ marginBottom: 4 }}>
                    <strong>John Dowling Jr.</strong>
                  </p>
                  <p style={{ marginBottom: 0, opacity: 0.85 }}>Steward</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Sharing Art With the World Section - Globe */}
      <section className="w-full !max-w-none" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-start px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16 space-y-12">
              {/* Sharing Art With the World */}
              <div>
                <h2>Sharing Art With the World</h2>
                <h3 className="hero-subtitle" style={{ marginBottom: 24 }}>
                  Access as a Core Principle
                </h3>
                <div className="max-w-2xl space-y-4">
                  <p>
                    We believe art should be experienced, not hidden. When appropriate, works under our
                    stewardship are shared through exhibitions, institutional loans, and public-facing
                    placements that expand access while maintaining curatorial and conservation standards.
                  </p>
                  <p>
                    These efforts are undertaken thoughtfully and responsibly, and reflect how museums and
                    cultural institutions around the world are sustained. Public access, education, and
                    stewardship are core components of modern philanthropy, and sharing art through
                    institutional and community contexts is a proven way to preserve cultural value over time.
                  </p>
                </div>
              </div>

              {/* Art as Education */}
              <div>
                <h2>Art as Education</h2>
                <h3 className="hero-subtitle" style={{ marginBottom: 24 }}>
                  Teaching the Next Generation to See
                </h3>
                <div className="max-w-2xl space-y-4">
                  <p>Art shapes curiosity long before it shapes taste.</p>
                  <p>
                    Introducing children and young people to art builds visual literacy, emotional awareness,
                    and creative confidence. Learning how to look, ask questions, and make something tangible
                    helps develop perspective, empathy, and problem-solving skills that extend well beyond the
                    classroom.
                  </p>
                  <p>
                    Our educational initiatives support programs that bring art into learning environments in
                    ways that are accessible, thoughtful, and age-appropriate. Educational access, particularly
                    for young people, is consistently recognized as one of the most enduring public benefits of
                    cultural institutions.
                  </p>
                </div>
              </div>

              {/* Philanthropy as Cultural Infrastructure */}
              <div>
                <h2>Philanthropy as Cultural Infrastructure</h2>
                <h3 className="hero-subtitle" style={{ marginBottom: 24 }}>
                  How art institutions are sustained over time
                </h3>
                <div className="max-w-2xl space-y-4">
                  <p>
                    Philanthropy plays a foundational role in sustaining cultural institutions. Around the
                    world, museums, educational programs, and public art initiatives rely on philanthropy to
                    support the work that cannot be reduced to admissions, transactions, or short-term metrics.
                  </p>
                  <p>
                    As public funding becomes more constrained and operational demands increase, philanthropy
                    increasingly underwrites the public-facing responsibilities of cultural institutions.
                    Education, access, preservation, research, and community engagement are not peripheral
                    activities. They are core infrastructure, and philanthropy is what allows them to endure.
                  </p>
                  <p>
                    Our philanthropic approach reflects this reality. We focus on the elements of stewardship
                    that ensure art remains part of civic and cultural life over time. Supporting education
                    programs, enabling public access, and sustaining environments where art can be experienced
                    thoughtfully are not add-ons to stewardship. They are what make stewardship meaningful.
                  </p>
                  <p>
                    By treating philanthropy as infrastructure rather than charity, we align our work with the
                    long-term needs of cultural institutions and the communities they serve. The goal is
                    durability. Not momentary impact, but lasting presence.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Globe */}
            <div className="relative w-full h-[600px] lg:h-auto flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
              <InteractiveGlobe />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
