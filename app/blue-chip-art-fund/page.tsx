'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BluChipArtFundPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-6 relative">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              <Link href="/about" className="nav-link">About</Link>
              <a href="/#investment-offerings" className="nav-link">Offerings</a>
              <a href="/#gallery" className="nav-link">Gallery</a>
              <a href="/#stewardship-in-practice" className="nav-link">Stewardship</a>
              <span className="nav-separator">|</span>
              <Link href="/request-access" className="btn-primary">Request Access</Link>
            </nav>

            {/* Mobile/Tablet Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden ml-auto p-2 text-archive-slate hover:opacity-70 transition-opacity"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Mobile/Tablet Dropdown Menu */}
            {isMenuOpen && (
              <nav className="lg:hidden absolute top-full right-0 left-0 bg-white border-t border-gallery-plaster shadow-md mt-2 z-50">
                <div className="flex flex-col p-4 sm:p-6 gap-6">
                  <Link
                    href="/about"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <a
                    href="/#investment-offerings"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Offerings
                  </a>
                  <a
                    href="/#gallery"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gallery
                  </a>
                  <a
                    href="/#stewardship-in-practice"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Stewardship
                  </a>
                  <div className="border-t border-gallery-plaster pt-4">
                    <Link
                      href="/request-access"
                      className="btn-primary mobile-menu-button w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Request Access
                    </Link>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="w-full relative" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center justify-center">
                <div className="max-w-[637px] w-full">
                  {/* Heading */}
                  <h1 className="hero-title" style={{marginBottom: '17px', textAlign: 'left'}}>
                    <div style={{fontSize: '41px', lineHeight: '45px'}}>
                      Blue Chip Art Fund
                    </div>
                  </h1>

                  {/* Subtitle */}
                  <div className="hero-subtitle" style={{textAlign: 'left'}}>
                    <p>
                      Long-Term Stewardship of Historically Significant Works
                    </p>
                  </div>

                  {/* Body Copy */}
                  <div className="hero-description" style={{textAlign: 'left', marginTop: '24px'}}>
                    <p>
                      The Blue Chip Art Fund is a governed platform established to acquire, hold, and steward culturally and historically significant artworks within a long-duration ownership framework.
                    </p>
                    <p style={{marginTop: '16px'}}>
                      Operating within the Art Investment Group Trust structure, the fund prioritizes preservation, provenance integrity, and continuity over liquidity or short-term market dynamics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Feafb8bb91b0e4cb4a3e057a625a6d313?format=webp&width=800"
                    alt="Gallery space representing the Blue Chip Art Fund collection"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Stewardship Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Institutional Stewardship */}
              <div className="flex flex-col gap-4">
                <h2 className="governance-title" style={{textAlign: 'left', marginBottom: '8px'}}>
                  Institutional Stewardship<br />for Established Art
                </h2>
                <p className="governance-description" style={{textAlign: 'left', marginBottom: '8px'}}>
                  The Blue Chip Art Fund is designed for artworks with established cultural significance and enduring historical relevance.
                </p>
                <p className="governance-description" style={{textAlign: 'left', marginBottom: '0'}}>
                  The fund applies institutional governance, professional custody standards, and long-horizon ownership to works that warrant preservation across generations rather than participation in evolving market structures.
                </p>
              </div>

              {/* Right Column - Preservation-First Stewardship */}
              <div className="flex flex-col gap-4 bg-paper-white p-8 lg:p-10">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '8px'}}>
                  Preservation-First Stewardship
                </h3>
                <ul className="list-none space-y-8 p-0 m-0">
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '0', paddingBottom: '24px', borderBottom: '1px solid transparent'}}>
                    Prioritizing long-duration ownership over liquidity
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '24px', paddingBottom: '24px', borderBottom: '1px solid transparent'}}>
                    Maintaining museum-quality custody and care standards
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '24px', paddingBottom: '24px', borderBottom: '1px solid transparent'}}>
                    Preserving provenance, context, and historical integrity
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '24px'}}>
                    Minimizing turnover to support long-term cultural value
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center text-center max-w-[800px] mx-auto gap-6">
              <h2 className="governance-title" style={{textAlign: 'center', marginBottom: '0'}}>
                A Distinct Mandate
              </h2>
              <p className="governance-subtitle" style={{textAlign: 'center', marginBottom: '0'}}>
                The Blue Chip Art Fund is differentiated by its preservation-first mandate and long-term ownership horizon.
              </p>
              <p className="governance-description" style={{textAlign: 'center', marginBottom: '8px'}}>
                The Blue Chip Art Fund operates with the explicit objective of long-term stewardship. It prioritizes permanence, stability, and cultural continuity over liquidity or market responsiveness.
              </p>
              <p className="governance-description" style={{textAlign: 'center', marginBottom: '0'}}>
                Acquisitions are made with the expectation of extended holding periods, limited turnover, and careful custodial management designed to preserve both physical condition and historical context.
              </p>
            </div>
          </div>
        </section>

        {/* Four Pillars Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Pillar 1 */}
              <div className="stewardship-card flex flex-col gap-4">
                <h3 className="stewardship-card-title">
                  Long-Horizon<br />Ownership
                </h3>
              </div>

              {/* Pillar 2 */}
              <div className="stewardship-card flex flex-col gap-4">
                <h3 className="stewardship-card-title">
                  Preservation-First<br />Stewardship
                </h3>
              </div>

              {/* Pillar 3 */}
              <div className="stewardship-card flex flex-col gap-4">
                <h3 className="stewardship-card-title">
                  Selective and<br />Infrequent<br />Acquisition
                </h3>
              </div>

              {/* Pillar 4 */}
              <div className="stewardship-card flex flex-col gap-4">
                <h3 className="stewardship-card-title">
                  Institutional<br />Custody and<br />Care
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Curatorial and Acquisition Focus Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[481px_1fr] gap-8 lg:gap-12 items-center">
              {/* Image Column */}
              <div className="relative w-full aspect-square overflow-hidden bg-gallery-plaster">
                <Image
                  src="https://api.builder.io/api/v1/image/assets/TEMP/3fcc0a77588d6a3d3a1383895fef7fdd4208516f?width=962"
                  alt="Refined interior space representing long-term art stewardship"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 481px"
                />
              </div>

              {/* Content Column */}
              <div className="flex flex-col gap-6 max-w-[634px]">
                <h2 className="governance-title" style={{marginBottom: '8px'}}>
                  Curatorial and Acquisition Focus
                </h2>
                <div className="flex flex-col gap-4">
                  <p className="governance-description" style={{marginBottom: '0'}}>
                    The Blue Chip Art Fund is focused on the acquisition and long-term stewardship of artworks with established cultural, historical, and institutional significance.
                  </p>
                  <p className="governance-description" style={{marginBottom: '0'}}>
                    Works are selected based on enduring relevance, provenance integrity, and suitability for extended custodial care. The fund prioritizes pieces that have demonstrated lasting influence within art history rather than short-term market momentum.
                  </p>
                  <p className="governance-description" style={{marginBottom: '0'}}>
                    Acquisition activity remains selective and deliberate, with an emphasis on quality, context, and preservation over volume.
                  </p>
                  <div className="governance-description" style={{marginBottom: '0'}}>
                    <p style={{marginBottom: '8px'}}>Areas of focus to include:</p>
                    <p style={{marginBottom: '4px'}}>Historically significant modern and contemporary works</p>
                    <p style={{marginBottom: '4px'}}>Artists with sustained institutional recognition</p>
                    <p style={{marginBottom: '4px'}}>Works with documented exhibition and publication history</p>
                    <p>Pieces suitable for museum-quality custody and conservation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How the Blue Chip Art Fund Operates Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center text-center gap-8 lg:gap-10">
              {/* Header */}
              <div className="flex flex-col items-center gap-4 max-w-[995px]">
                <h2 className="governance-title" style={{textAlign: 'center', marginBottom: '0'}}>
                  How the Blue Chip Art Fund Operates
                </h2>
                <p className="governance-subtitle" style={{textAlign: 'center', marginBottom: '0', maxWidth: '817px'}}>
                  An overview of stewardship priorities, acquisition discipline, and long-term custodial care.
                </p>
              </div>

              {/* Description */}
              <p className="governance-description" style={{textAlign: 'center', marginBottom: '0', maxWidth: '1022px'}}>
                The Blue Chip Art Fund operates through selective acquisition, long-duration ownership, institutional custody standards, and governance designed to minimize turnover while preserving cultural value.
              </p>

              {/* Grid of Cards - Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-[1200px]">
                {/* Long-Term Ownership */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Long-Term Ownership</h3>
                    <p className="fund-card-description">
                      The fund is designed for extended holding periods, with no expectation of short-term liquidity.
                    </p>
                  </div>
                </div>

                {/* Lower Risk Profile */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Lower Risk Profile</h3>
                    <p className="fund-card-description">
                      By focusing on historically established works, the fund emphasizes stability over market volatility.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Cards - Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-[1200px]">
                {/* Selective Acquisition */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Selective Acquisition</h3>
                    <p className="fund-card-description">
                      Growth occurs infrequently and only when works meet strict cultural and custodial criteria.
                    </p>
                  </div>
                </div>

                {/* Institutional Custody */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Institutional Custody</h3>
                    <p className="fund-card-description">
                      Works are maintained under professional standards appropriate for museum-quality art.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col gap-8 lg:gap-12">
              {/* Header */}
              <div className="flex flex-col gap-4">
                <h2 className="governance-title" style={{marginBottom: '0'}}>
                  Participation and Alignment
                </h2>
                <p className="governance-description" style={{marginBottom: '0'}}>
                  Participation in the Blue Chip Art Fund is designed for those aligned with long-term stewardship and preservation-first ownership.
                </p>
              </div>

              {/* Three Cards */}
              <div className="flex flex-col gap-6 lg:gap-8">
                {/* Card 1 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">For Long-Term Stewards</h3>
                    <p className="stewardship-card-description">
                      Participation in the Blue Chip Art Fund is designed for individuals and institutions aligned with long-duration ownership and cultural stewardship. The fund is intended for those who value continuity, preservation, and measured decision-making over short-term market responsiveness.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">Preservation, Not Liquidity</h3>
                    <p className="stewardship-card-description">
                      The Blue Chip Art Fund is not structured to prioritize liquidity, frequent transactions, or short-term price discovery. Acquisitions are made with the expectation of extended holding periods, minimal turnover, and stewardship practices designed to preserve artistic, historical, and cultural integrity across generations.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">Deliberate Engagement</h3>
                    <p className="stewardship-card-description">
                      Art Investment Group Trust engages prospective participants through direct, considered discussion. Participation begins with alignment around intent, stewardship philosophy, and long-term commitment rather than transaction-driven timelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Conversations Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#ffffff'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              {/* Tagline */}
              <h2 className="footer-tagline">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              {/* Private Conversations Section */}
              <div className="private-conversations text-center flex flex-col items-center">
                <h3 className="private-conversations-title">
                  Private Conversations
                </h3>
                <p className="private-conversations-text max-w-[789px]">
                  Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct, considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not transactions.
                </p>
                <p className="private-conversations-text max-w-[789px]">
                  These conversations are exploratory by design. They allow space to discuss long-term intent, governance alignment, and the role each participant seeks to play in preserving cultural value across generations.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center">
                <Link href="/request-access" className="footer-cta-primary" style={{textDecoration: 'none', display: 'inline-flex'}}>
                  Schedule a Discussion
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0">
          <div className="footer-content-box flex flex-col items-center gap-10">
            {/* Logo */}
            <div className="relative w-[180px] sm:w-[200px] lg:w-[205px] h-[45px] sm:h-[50px] lg:h-[52px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 205px"
              />
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-3">
              {/* Links */}
              <p className="footer-links">
                <Link href="/disclosures" className="hover:opacity-70">Disclosures</Link>
                <span className="px-2">|</span>
                <Link href="/privacy" className="hover:opacity-70">Privacy</Link>
                <span className="px-2">|</span>
                <Link href="/terms" className="hover:opacity-70">Terms</Link>
                <span className="px-2">|</span>
                <Link href="/request-access" className="hover:opacity-70">Contact</Link>
              </p>

              {/* Copyright */}
              <p className="footer-copyright">
                COPYRIGHT ©2026. ALL RIGHTS RESERVED.
              </p>

              {/* Disclaimer */}
              <p className="footer-disclaimer">
                Regulatory disclosures and offering materials are provided separately and only to eligible parties. This website is presented for informational purposes and does not constitute an offer or solicitation.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
