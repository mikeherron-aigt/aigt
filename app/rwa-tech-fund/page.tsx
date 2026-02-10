'use client';

import Image from "next/image";

export default function RWATechFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24 flex items-center">
                <div className="max-w-[711px]">
                  <h1>RWA Tech Fund</h1>

                  <div className="hero-subtitle flex flex-col gap-4">
                    <p>
                      A standalone platform designed to power regulated private funds with consistent operations, governance,
                      and reporting.
                    </p>

                    <p>
                      This is a technology focused fund. It is separate from any art fund, museum initiative, or real estate
                      vehicle.
                    </p>

                    <p>
                      What we know for sure: any outside fund that wants to use the platform comes to the board for approval,
                      and if approved, pays fees to the technology company for using the system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden">
                <Image
                  src="/rwa-tech-hero.png"
                  alt="Abstract, institutional technology infrastructure"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 601px"
                />
              </div>
            </div>

            {/* Decorative Elements (match About exactly) */}
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
              style={{ top: "0", height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
              style={{ top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>
        </section>

        {/* Design Bar (match About exactly) */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{ width: "calc(50vw + 112px)" }} />
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(50vw + 105px)", right: "0" }} />

          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }} />
          </div>
        </div>

        {/* ============================= */}
{/* EVERYTHING UNDER THE HERO */}
{/* Drop this directly under your hero wrapper in the page */}
{/* ============================= */}

<section className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
    {/* Intro + quick proof points */}
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-start">
      <div>
        <h2 className="text-[26px] sm:text-[32px] lg:text-[38px] leading-tight tracking-[-0.02em] text-black">
          Stewardship first, execution always.
        </h2>

        <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-black/70 max-w-[70ch]">
          We built this to feel institutional, not experimental. The work is simple: acquire with
          discipline, document with rigor, steward with care, and report in a way serious allocators
          can actually trust.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
              Governance
            </div>
            <div className="mt-2 text-[15px] font-medium text-black">
              Centralized oversight
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-black/65">
              Clear decision rights, consistent process.
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
              Reporting
            </div>
            <div className="mt-2 text-[15px] font-medium text-black">
              Institutional cadence
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-black/65">
              Updates that reflect reality, not hype.
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
              Optionality
            </div>
            <div className="mt-2 text-[15px] font-medium text-black">
              Digital record layer
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-black/65">
              Tech supports governance, not speculation.
            </div>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div className="rounded-3xl border border-black/10 bg-[#f7f7f7] p-6 sm:p-7">
        <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
          What this is
        </div>
        <div className="mt-2 text-[18px] font-medium text-black">
          A long-horizon art ownership vehicle
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-black/70">
          Not a trading product. Not a marketplace. Not a token launch. A governed structure built
          to own, steward, and contextualize works over time.
        </p>

        <div className="mt-6 rounded-2xl bg-white border border-black/10 p-4">
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Designed for
          </div>
          <ul className="mt-3 space-y-2 text-[14px] text-black/70">
            <li className="flex gap-2">
              <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-black/40" />
              Investors who can hold illiquid assets long-term
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-black/40" />
              People who want reporting discipline and process clarity
            </li>
            <li className="flex gap-2">
              <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-black/40" />
              Allocators who value cultural legitimacy as part of value creation
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-3 text-[14px] hover:opacity-90 transition"
          >
            Request materials
          </a>
          <a
            href="/stewardship"
            className="inline-flex items-center justify-center rounded-full bg-white border border-black/15 text-black px-5 py-3 text-[14px] hover:bg-black/[0.03] transition"
          >
            Learn the model
          </a>
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-black/50">
          Private offering. Accredited investors only. Information provided for discussion purposes.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Section divider */}
<div className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
    <div className="h-px w-full bg-black/10" />
  </div>
</div>

{/* Pillars (different module style) */}
<section className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
      <div>
        <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
          The framework
        </div>
        <h3 className="mt-3 text-[24px] sm:text-[28px] lg:text-[32px] tracking-[-0.02em] text-black">
          Four pillars, one operating standard.
        </h3>
        <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-black/70 max-w-[55ch]">
          Everything maps back to a few principles. They keep the operation clean, repeatable, and
          defensible.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Acquisition
          </div>
          <div className="mt-2 text-[16px] font-medium text-black">
            Conviction, not volume
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-black/70">
            Sourcing, diligence, pricing discipline, and a clear reason to own the work for years.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Documentation
          </div>
          <div className="mt-2 text-[16px] font-medium text-black">
            Provenance you can audit
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-black/70">
            Title, condition, custody, and rights captured with enough structure to stand up later.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Stewardship
          </div>
          <div className="mt-2 text-[16px] font-medium text-black">
            Preserve the asset, elevate the context
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-black/70">
            Conservation, storage, insurance, and institutional placement decisions that protect
            value over time.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Reporting
          </div>
          <div className="mt-2 text-[16px] font-medium text-black">
            Clarity without theater
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-black/70">
            A consistent cadence that respects illiquidity and avoids pretending this trades like
            public markets.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Dark band module (different format) */}
<section className="w-full bg-black text-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
      <div>
        <div className="text-[12px] uppercase tracking-[0.14em] text-white/60">
          Optional digital layer
        </div>
        <h3 className="mt-3 text-[24px] sm:text-[28px] lg:text-[32px] tracking-[-0.02em] text-white">
          Technology is a record, not a promise.
        </h3>
        <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-white/70 max-w-[70ch]">
          If used, blockchain is simply a way to mirror ownership records and metadata. It does not
          change the nature of the interest. It does not create liquidity. It does not create a
          marketplace.
        </p>

        <div className="mt-7 grid sm:grid-cols-3 gap-3">
          {[
            { t: "No trading", d: "Not listed. No exchange." },
            { t: "No new rights", d: "Governance stays centralized." },
            { t: "No hype layer", d: "Admin, not marketing." },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <div className="text-[14px] font-medium text-white">{item.t}</div>
              <div className="mt-2 text-[13px] leading-relaxed text-white/70">{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-7">
        <div className="text-[12px] uppercase tracking-[0.14em] text-white/60">
          What you actually get
        </div>
        <ul className="mt-4 space-y-3 text-[14px] text-white/75">
          <li className="flex gap-2">
            <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-white/50" />
            A governed interest with contractual economics
          </li>
          <li className="flex gap-2">
            <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-white/50" />
            Centralized decision-making and operating controls
          </li>
          <li className="flex gap-2">
            <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-white/50" />
            Structured documentation and reporting cadence
          </li>
          <li className="flex gap-2">
            <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-white/50" />
            Optional digital representation as an administrative layer
          </li>
        </ul>

        <div className="mt-6 rounded-2xl bg-black/40 border border-white/10 p-4">
          <div className="text-[12px] uppercase tracking-[0.14em] text-white/60">
            Plain english
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/75">
            We do not use tech to make art feel liquid. We use tech to make records feel clean.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Timeline module (different format) */}
<section className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
    <div className="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
          How it works
        </div>
        <h3 className="mt-3 text-[24px] sm:text-[28px] lg:text-[32px] tracking-[-0.02em] text-black">
          A simple lifecycle. Built for long holds.
        </h3>
      </div>

      <a
        href="/process"
        className="text-[14px] text-black/70 hover:text-black transition underline underline-offset-4 decoration-black/20"
      >
        See full operating model
      </a>
    </div>

    <div className="mt-10 grid lg:grid-cols-4 gap-4">
      {[
        {
          step: "01",
          title: "Source",
          body: "Deal flow, curatorial filter, pricing discipline.",
        },
        {
          step: "02",
          title: "Diligence",
          body: "Title, authenticity, condition, rights, custody plan.",
        },
        {
          step: "03",
          title: "Steward",
          body: "Insurance, storage, conservation, contextual placement.",
        },
        {
          step: "04",
          title: "Report",
          body: "Periodic updates that match the asset class reality.",
        },
      ].map((s) => (
        <div key={s.step} className="rounded-3xl border border-black/10 bg-[#fafafa] p-6">
          <div className="flex items-baseline justify-between">
            <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
              Step {s.step}
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
          </div>
          <div className="mt-3 text-[16px] font-medium text-black">{s.title}</div>
          <div className="mt-2 text-[14px] leading-relaxed text-black/70">{s.body}</div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQ accordion-lite (no JS, different format) */}
<section className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] pb-12 sm:pb-16 lg:pb-20">
    <div className="rounded-[32px] border border-black/10 bg-white overflow-hidden">
      <div className="px-6 sm:px-8 py-8 bg-[#f7f7f7]">
        <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
          FAQ
        </div>
        <h3 className="mt-2 text-[22px] sm:text-[26px] tracking-[-0.02em] text-black">
          Quick answers, no theatrics.
        </h3>
      </div>

      <div className="divide-y divide-black/10">
        {[
          {
            q: "Is this liquid?",
            a: "No. This is built for long-term ownership. There is no public market and no promised exit path.",
          },
          {
            q: "Do tokens change anything?",
            a: "No. If used, a token is only an administrative representation of the same underlying interest, not a separate product.",
          },
          {
            q: "What do investors control?",
            a: "Investors do not direct acquisitions, sales, custody, or day-to-day decisions. Governance is centralized by design.",
          },
          {
            q: "How does valuation work?",
            a: "Art is illiquid and subjective. Valuations are based on good-faith methodology and may remain unchanged for long periods.",
          },
        ].map((item) => (
          <details key={item.q} className="group px-6 sm:px-8 py-6">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
              <span className="text-[15px] sm:text-[16px] font-medium text-black">
                {item.q}
              </span>
              <span className="text-black/40 group-open:rotate-45 transition text-[20px] leading-none">
                +
              </span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-black/70 max-w-[85ch]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </div>
</section>

{/* CTA band */}
<section className="w-full bg-white">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] pb-16 lg:pb-24">
    <div className="rounded-[36px] border border-black/10 bg-[#f7f7f7] p-8 sm:p-10 lg:p-12">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-black/50">
            Next step
          </div>
          <h3 className="mt-3 text-[24px] sm:text-[28px] lg:text-[32px] tracking-[-0.02em] text-black">
            Want the full materials package?
          </h3>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-black/70 max-w-[70ch]">
            If you are evaluating fit, we will share the docs and walk you through the structure,
            operating model, and reporting cadence.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3.5 text-[14px] hover:opacity-90 transition"
          >
            Request offering materials
          </a>
          <a
            href="/faq"
            className="inline-flex items-center justify-center rounded-full bg-white border border-black/15 text-black px-6 py-3.5 text-[14px] hover:bg-black/[0.03] transition"
          >
            Read FAQs
          </a>
          <p className="text-[12px] leading-relaxed text-black/50">
            Private offering. Accredited investors only.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
