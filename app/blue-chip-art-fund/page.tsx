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

        {/* About the Fund Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] flex justify-center">
            <div className="max-w-[711px] w-full">
              <h2 className="governance-title" style={{textAlign: 'left'}}>
                About the Fund
              </h2>
              <p className="governance-description" style={{textAlign: 'left'}}>
                The Blue Chip Art Fund is a governed platform established to acquire, hold, and steward culturally and historically significant artworks within a long-duration ownership framework.
              </p>
              <p className="governance-description" style={{textAlign: 'left'}}>
                Operating within the Art Investment Group Trust structure, the fund prioritizes preservation, provenance integrity, and continuity over liquidity or short-term market dynamics.
              </p>
            </div>
          </div>
        </section>

        {/* Fund Philosophy Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-24 flex flex-col">
                <div className="max-w-[579px]">
                  <h2 className="governance-title">
                    Disciplined Acquisition
                  </h2>
                  <p className="governance-description">
                    Every acquisition is made with intention. We evaluate works through the lens of cultural significance, provenance, condition, and alignment with our long-term stewardship philosophy.<br /><br />Selection is never driven by volume or velocity. Each work must meet rigorous standards and represent a genuine contribution to a coherent collection.
                  </p>
                </div>

                {/* Divider */}
                <div className="divider-line my-12 lg:my-16"></div>

                <div className="max-w-[579px]">
                  <h2 className="governance-title">
                    Institutional Stewardship
                  </h2>
                  <p className="governance-description">
                    Art Investment Group Trust operates the Blue Chip Art Fund with institutional discipline. This includes professional custody standards, conservation protocols, comprehensive insurance, and clear governance structures.<br /><br />Our structures ensure that works are protected, properly maintained, and held for the long term—aligned with their cultural importance rather than market cycles.
                  </p>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative w-full h-full overflow-hidden min-h-[900px]">
                <div className="absolute inset-0">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=800"
                    alt="Artwork representing institutional stewardship"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#ffffff'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              {/* Tagline */}
              <h2 className="footer-tagline">
                Museum-quality art held with discipline and care for the long term.
              </h2>

              {/* CTA Button */}
              <div className="flex justify-center">
                <Link href="/request-access" className="footer-cta-primary" style={{textDecoration: 'none', display: 'inline-flex'}}>
                  Discuss the Fund
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
