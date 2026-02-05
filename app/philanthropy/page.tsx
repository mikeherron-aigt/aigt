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
              {/* Use global H1 */}
              <h1>Art in Service of People</h1>

              {/* Use semantic H3 as the hero subhead.
                  Keep hero-subtitle class because you already defined it as a "special case" utility. */}
              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Sharing art through stewardship, education and healing
              </h3>

              {/* Use global P */}
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

              {/* Optional CTA placeholder (kept since Link is already imported)
                  If you do not want a CTA yet, delete this block. */}
              {/* 
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/request-access" className="cta-primary">
                  Start a Conversation
                </Link>
                <Link href="/museum" className="cta-secondary">
                  See the Collection
                </Link>
              </div>
              */}
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
              {/* Use global H2 */}
              <h2>Stewardship Beyond Ownership</h2>

              {/* Use semantic H3 (subsection title) */}
              <h3 className="hero-subtitle" style={{ marginBottom: 32 }}>
                Responsibility beyond the collection
              </h3>

              {/* Use global P */}
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

      {/* Globe section will go here next */}
    </main>
  );
}
