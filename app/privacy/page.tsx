'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PrivacyPage() {
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
          <h1 className="governance-title mb-12">Privacy Policy</h1>

          <div className="space-y-8">
            <div>
              <h2 className="governance-subtitle mb-4">Overview</h2>
              <p className="governance-description">
                Art Investment Group Trust is committed to protecting the privacy and confidentiality of individuals who engage with our platforms, communications, and digital properties.
              </p>
              <p className="governance-description mt-4">
                This Privacy Policy describes how information is collected, used, stored, and protected in connection with this website and related communications.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Information Collected</h2>
              <p className="governance-description">
                Information may be collected when you voluntarily submit it through forms, correspondence, or direct engagement. This may include name, contact details, affiliation, country of residence, and information provided in connection with access requests or inquiries.
              </p>
              <p className="governance-description mt-4">
                Technical information such as IP address, browser type, and usage data may also be collected through standard website analytics tools.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Use of Information</h2>
              <p className="governance-description">
                Information is used solely for purposes consistent with the mission and operations of Art Investment Group Trust, including evaluating inquiries, responding to requests, conducting communications, and maintaining operational and regulatory integrity.
              </p>
              <p className="governance-description mt-4">
                Information is not sold, rented, or shared for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Confidentiality and Security</h2>
              <p className="governance-description">
                Reasonable administrative, technical, and organizational measures are employed to protect information against unauthorized access, disclosure, or misuse. Access to information is limited to individuals with a legitimate business or governance purpose.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Disclosure of Information</h2>
              <p className="governance-description">
                Information may be disclosed where required by law, regulation, or legal process, or in connection with regulatory, compliance, or governance obligations.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Retention</h2>
              <p className="governance-description">
                Information is retained only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Updates</h2>
              <p className="governance-description">
                This Privacy Policy may be updated periodically. Continued use of the website constitutes acceptance of any revisions.
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
