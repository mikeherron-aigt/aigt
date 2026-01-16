'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TermsPage() {
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
              <Link href="/#investment-offerings" className="nav-link">Offerings</Link>
              <Link href="/#gallery" className="nav-link">Gallery</Link>
              <Link href="/#stewardship-in-practice" className="nav-link">Stewardship</Link>
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
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <h1 className="governance-title mb-12">Terms of Use</h1>

          <div className="space-y-8">
            <div>
              <h2 className="governance-subtitle mb-4">Acceptance of Terms</h2>
              <p className="governance-description">
                By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, you should discontinue use of the website.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Use of Website</h2>
              <p className="governance-description">
                This website is intended solely for informational purposes. You agree not to use the website for any unlawful, misleading, or unauthorized purpose, or in any manner that could impair its operation or integrity.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">No Reliance</h2>
              <p className="governance-description">
                Information provided on this website should not be relied upon as a basis for making investment or participation decisions. Any reliance on such information is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Intellectual Property</h2>
              <p className="governance-description">
                All content on this website, including text, design, graphics, and logos, is the property of Art Investment Group Trust or its licensors and is protected by applicable intellectual property laws. No content may be reproduced, distributed, or used without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Limitation of Liability</h2>
              <p className="governance-description">
                To the fullest extent permitted by law, Art Investment Group Trust disclaims all liability for any direct, indirect, incidental, or consequential damages arising out of or related to the use of this website.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Governing Law</h2>
              <p className="governance-description">
                These Terms of Use are governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Modifications</h2>
              <p className="governance-description">
                Art Investment Group Trust reserves the right to modify these Terms of Use at any time. Continued use of the website following any modification constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>
        </div>
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
                <Link href="/disclosures" className="hover:opacity-7">Disclosures</Link>
                <span className="px-2">|</span>
                <Link href="/privacy" className="hover:opacity-7">Privacy</Link>
                <span className="px-2">|</span>
                <Link href="/terms" className="hover:opacity-7">Terms</Link>
                <span className="px-2">|</span>
                <Link href="/request-access" className="hover:opacity-7">Contact</Link>
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
