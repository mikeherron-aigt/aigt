// app/vr-museum/page.tsx
import type { Metadata } from "next";
import VrMuseumClientShell from "./VrMuseumClientShell";

export const metadata: Metadata = {
  title: "The Virtual Museum",
  description:
    "Extending museum grade stewardship, access, and scholarship beyond physical walls.",
};

export default function VrMuseumPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="border-b border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                The Virtual Museum
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">
                Extending museum grade stewardship, access, and scholarship beyond
                physical walls.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-neutral-100 to-neutral-50" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(0,0,0,0.05),transparent_60%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Permanent digital extension */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            A permanent digital extension of the collection
          </h2>

          <div className="mt-6 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
            <p>
              The Virtual Museum is designed as a long term institutional extension
              of the collection, not a digital novelty or consumer experience.
            </p>
            <p>
              Its purpose is deliberate. To provide high fidelity access to the works
              for scholars, curators, institutions, and aligned partners when physical
              access is impractical or impossible. The Virtual Museum mirrors the
              standards of a physical museum, prioritizing accuracy, narrative
              coherence, and preservation over scale or spectacle.
            </p>
            <p>
              This initiative forms part of a broader stewardship strategy focused on
              continuity, legitimacy, and long horizon cultural relevance.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Environment */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
            {/* Half viewport height. Adjust as needed */}
            <div className="h-[50vh] w-full">
              <VrMuseumClientShell />
            </div>
          </div>
        </div>
      </section>

      {/* Built for seriousness */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                Built for seriousness, not entertainment
              </h3>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                <p>
                  The Virtual Museum is not designed as a mass market platform, a
                  gaming experience, or a consumer facing monetized digital product.
                  It does not prioritize virality, engagement metrics, or consumer
                  traffic.
                </p>
                <p>
                  Instead, it functions as an institutional access layer. A controlled
                  environment where artworks can be viewed at accurate scale, within
                  curated spatial contexts, and supported by archival documentation and
                  scholarly narrative.
                </p>
                <p>
                  Technology is used quietly and intentionally, in service of
                  preservation, access, and institutional integrity rather than novelty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complement section */}
      <section className="border-b border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4">
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                A complement, not a substitute
              </h3>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                <p>
                  The Virtual Museum does not replace the physical museum. It extends it.
                </p>
                <p>
                  Where the physical museum provides place, presence, and material
                  authority, the Virtual Museum provides reach and continuity. Together,
                  they form a unified institutional framework that supports exhibition
                  planning, scholarly engagement, and long term narrative stewardship
                  without compromising custodial control of the works.
                </p>
                <p>
                  This dual structure allows the collection to remain both deeply grounded
                  and globally accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="border-b border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            A stewardship asset, not a revenue center
          </h3>

          <div className="mt-5 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
            <p>
              The Virtual Museum is not intended to operate as a standalone business
              or revenue generating platform. It exists as long term cultural and
              institutional infrastructure.
            </p>
            <p>
              Governance, curatorial oversight, and narrative control remain aligned
              with the broader stewardship framework. Participation in the Virtual
              Museum does not create new economic rights, liquidity mechanisms, or
              investor entitlements beyond those defined in the governing documents.
            </p>
            <p>
              Its value lies in trust, continuity, and institutional legitimacy over time.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
