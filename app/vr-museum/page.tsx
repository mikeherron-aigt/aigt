// app/vr-museum/page.tsx
import type { Metadata } from "next";
import VrMuseumClientShell from "./VrMuseumClientShell";

export const metadata: Metadata = {
  title: "The Virtual Museum",
  description:
    "Interactive virtual museum preview environment for informational and stewardship context.",
};

export default function VrMuseumPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
          <div className="rounded-2xl border border-black/10 bg-white p-5 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs font-semibold tracking-widest text-black/50">
                  INTERACTIVE
                </div>
                <h1 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                  Explore a sample gallery
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-black/70 md:text-base">
                  Drag to look, scroll to move, and click a work to focus. Click
                  again to return to center.
                </p>
              </div>
            </div>

            {/* Interactive area */}
            <div className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-neutral-50">
              {/* Height: half the viewport. Tweak this value to taste. */}
              <div className="h-[50vh] w-full">
                <VrMuseumClientShell />
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-black/50">
              This preview environment is provided for informational and stewardship
              context. Availability and access are governed.
            </p>

            {/* Optional tiny helper for you while tuning height */}
            <p className="mt-2 text-[11px] leading-relaxed text-black/40">
              Adjust height by changing <span className="font-mono">h-[50vh]</span>{" "}
              to <span className="font-mono">h-[60vh]</span> or{" "}
              <span className="font-mono">h-[40vh]</span>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
