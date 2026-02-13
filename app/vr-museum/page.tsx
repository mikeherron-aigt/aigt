// app/vr-museum/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
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

              {/* Standard vertical blocks */}
              <div className="mt-8 space-y-3 max-w-xl">
                <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/75 md:text-base">
                  Museum-grade context, preserved digitally
                </div>
                <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/75 md:text-base">
                  Accurate scale, curated spatial sequencing
                </div>
                <div className="border-l border-black/15 pl-4 text-[15px] leading-relaxed text-black/75 md:text-base">
                  Controlled access for scholars and partners
                </div>
              </div>
            </div>

            {/* Standard horizontal block with image */}
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/vrmuseum.png"
                  alt="Virtual Museum"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.10),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(0,0,0,0.08),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-black/5" />
              </div>
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

      {/* Interactive Environment only */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          {/* No gray card here. Just the interactive env filling the area. */}
          <div className="h-[80vh] w-full">
            <VrMuseumClientShell variant="embed" />
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

      {/* Use cases */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            Designed for institutional engagement
          </h3>

          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-base">
            The Virtual Museum may support a range of stewardship driven use cases, including:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 text-[15px] text-black/75 md:max-w-3xl md:text-base">
            <div className="border-l border-black/15 pl-4">Remote scholarly study and research</div>
            <div className="border-l border-black/15 pl-4">Curatorial collaboration and exhibition planning</div>
            <div className="border-l border-black/15 pl-4">International institutional visibility</div>
            <div className="border-l border-black/15 pl-4">Archival documentation and contextualization</div>
            <div className="border-l border-black/15 pl-4">Controlled private access for aligned partners</div>
          </div>

          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-base">
            Access is intentionally governed. The Virtual Museum is not intended to operate as an
            open public platform. Participation and availability may be permissioned based on
            audience, jurisdiction, and institutional context.
          </p>
        </div>
      </section>

      {/* Technology philosophy */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                Infrastructure over innovation theater
              </h3>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
                <p>
                  The underlying technology is selected for fidelity, stability, and longevity.
                  Spatial representation, scale accuracy, material rendering, and controlled
                  sequencing are prioritized over speed or novelty.
                </p>
                <p>
                  The goal is not to showcase technology. It is to ensure that the digital
                  environment upholds the same standards of care, seriousness, and credibility
                  expected of any museum grade institution.
                </p>
                <p>Technology does not define the experience. Stewardship does.</p>
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
              The Virtual Museum is not intended to operate as a standalone business or revenue
              generating platform. It exists as long term cultural and institutional infrastructure.
            </p>
            <p>
              Governance, curatorial oversight, and narrative control remain aligned with the
              broader stewardship framework. Participation in the Virtual Museum does not create
              new economic rights, liquidity mechanisms, or investor entitlements beyond those
              defined in the governing documents.
            </p>
            <p>Its value lies in trust, continuity, and institutional legitimacy over time.</p>
          </div>
        </div>
      </section>

      {/* Long horizon */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            Built for the long horizon
          </h3>

          <div className="mt-5 max-w-3xl space-y-5 text-[15px] leading-relaxed text-black/75 md:text-base">
            <p>
              The Virtual Museum is a future facing initiative grounded in long duration thinking.
              Development, access, and programming are expected to evolve deliberately and
              responsibly, independent of short term timelines or external validation.
            </p>
            <p>
              This platform is designed to mature alongside the collection itself, reinforcing its
              narrative, preserving its context, and supporting institutional engagement across
              decades rather than cycles.
            </p>
          </div>

          <div className="mt-10 border-t border-black/10 pt-8">
            <h4 className="text-sm font-semibold tracking-wide text-black/60">
              Part of a broader stewardship framework
            </h4>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/60">
              The Virtual Museum operates alongside physical museum infrastructure, institutional
              partnerships, and archival systems as part of a unified approach to cultural stewardship.
            </p>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-black/50">
              Descriptions of future initiatives are provided for informational and stewardship context
              only and do not constitute an offer, solicitation, or commitment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
