'use client';

import Link from "next/link";
import Image from "next/image";

export default function RWATechFundPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center py-12 lg:py-0">
                <div className="max-w-[711px] w-full">
                  <h1 style={{ marginBottom: "17px", textAlign: "left" }}>
                    RWA Tech Fund
                  </h1>

                  <div className="hero-subtitle" style={{ textAlign: "left" }}>
                    <p>Infrastructure for Board-Approved Fund Operations</p>
                  </div>

                  <div style={{ textAlign: "left", marginTop: "24px" }}>
                    <p>
                      RWA Tech Fund is a technology focused investment vehicle supporting the development of a fund operating
                      platform built for governance, onboarding, and reporting.
                    </p>
                    <p style={{ marginTop: "16px" }}>
                      What we know for sure: any outside fund that wants to use the platform comes to the board for approval,
                      and if approved, pays fees to the technology company for using the system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  <Image
                    src="/rwa-tech-hero.png"
                    alt="Abstract, institutional technology infrastructure"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
              style={{ top: 0, height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
              style={{ top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>
        </section>

        {/* Design Bar */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{ width: "calc(50vw + 112px)" }} />
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(50vw + 105px)", right: 0 }} />
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }} />
          </div>
        </div>

        {/* Two Column Content Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Left Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
                <div className="max-w-[579px]">
                  <h2 className="governance-title" style={{ marginBottom: "24px" }}>
                    A Fund Operating Platform
                  </h2>
                  <p className="governance-description">
                    The goal is to provide a standardized backend system that supports fundraising workflows, investor onboarding,
                    governance, and reporting for approved funds.
                  </p>
                  <p className="governance-description">
                    The platform is being developed as a standalone operating company so it can be built, funded, and scaled
                    independently, with a clean mandate and a clear risk profile.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="px-4 sm:px-8 lg:p-[80px_40px]" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="governance-title" style={{ marginBottom: "24px", fontSize: "28px", lineHeight: "36px" }}>
                  Board Controlled Access
                </h3>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Outside funds are not automatically onboarded
                </p>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Funds come to the board for review and approval
                </p>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Approved funds pay fees to the technology company
                </p>
                <p className="governance-description">
                  Governance is explicit, not implied
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">A Distinct Mandate</h2>
              <p className="governance-subtitle text-center max-w-[735px]">
                RWA Tech Fund exists to build infrastructure. It is separate from any art fund, museum initiative, or real estate
                vehicle.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The platform is being designed to support regulated private fund operations with consistent process, clear
                governance, and repeatable reporting. It is intended to function as shared infrastructure for affiliated funds and
                approved external funds over time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Fund Operations Infrastructure</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Board-Approved Access Model</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Fee Based Platform Economics</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Risk Isolation Through Separation</h3>
              </div>
            </div>
          </div>
        </section>

        {/* How the RWA Tech Fund Operates */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">How the RWA Tech Fund Operates</h2>
              <p className="governance-subtitle text-center max-w-[817px]">
                An overview of platform buildout, governance controls, and how fees support scaling.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The RWA Tech Fund supports a standalone technology company building a platform used by approved funds. Those funds
                pay fees for platform access and services, creating a recurring model over time.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Platform Buildout</h3>
                  <p className="practice-card-description">
                    Capital supports development of the operating platform, including onboarding, governance workflows, and
                    reporting infrastructure.
                  </p>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Board-Approved Onboarding</h3>
                  <p className="practice-card-description">
                    Outside funds are reviewed by the board. Approval is required before platform access is granted.
                  </p>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Fee Based Model</h3>
                  <p className="practice-card-description">
                    Approved funds pay fees to the technology company for using the system. Fees support maintenance, operations,
                    and continued buildout.
                  </p>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Separate Risk Profile</h3>
                  <p className="practice-card-description">
                    The technology business is structured separately so its risk profile and capital strategy remain clean and
                    isolated from other initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="governance-title" style={{ marginBottom: "16px" }}>
              Participation and Alignment
            </h2>
            <p className="governance-description max-w-[1038px]" style={{ marginBottom: "48px" }}>
              Participation in the RWA Tech Fund is designed for those aligned with long-term platform buildout, governance
              discipline, and a fee based infrastructure business model.
            </p>

            <div className="flex flex-col gap-6">
              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  For Infrastructure Builders
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  The RWA Tech Fund supports technology development, not ownership of art holdings or real estate assets.
                </p>
                <p className="stewardship-card-description">
                  It is intended for participants who understand platform businesses and the timelines required to build durable
                  infrastructure.
                </p>
              </div>

              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  Governance and Approval Culture
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  The core differentiator is governance. Outside funds are not automatically accepted and cannot access the system
                  without board approval.
                </p>
                <p className="stewardship-card-description">
                  The platform is designed to keep oversight explicit and consistent.
                </p>
              </div>

              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  Deliberate Engagement
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  If you are evaluating fit, we start with a conversation. The objective is alignment around intent, governance,
                  and operating expectations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Private Conversations Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant assets.
              </h2>

              <div className="text-center flex flex-col items-center gap-4">
                <h3 className="text-center">Private Conversations</h3>
                <p className="text-center max-w-[789px] mx-auto">
                  Art Investment Group Trust engages with qualified participants through direct, considered dialogue. We believe
                  long-term governance begins with thoughtful conversation, not transactions.
                </p>
                <p className="text-center max-w-[789px] mx-auto">
                  These conversations are exploratory by design. They allow space to discuss intent, governance alignment, and the
                  role each participant seeks to play in building durable infrastructure.
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/request-access"
                  className="footer-cta-primary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  Schedule a Discussion
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
