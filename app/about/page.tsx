'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "John Joseph Dowling Jr.",
    title: "Board Member; Chairman; Chief Visionary Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2a84950d36374b0fbc5643367302bc6a?format=webp&width=400"
  },
  {
    name: "Jose Bracho",
    title: "Board Member; Chief Business Development Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2163c773e4894f2095d0df4caddae544?format=webp&width=400"
  },
  {
    name: "Luis Cortes",
    title: "Board Member; Global Director of Art Acquisitions; Chief Revenue Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fbed6d284517842c4b5dd155c3023e20f?format=webp&width=400"
  },
  {
    name: "Steve Duren",
    title: "Board Member; Chief Commercial Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fb25ae8084fb345bb8e78dd40e7afe448?format=webp&width=400"
  },
  {
    name: "Mike Herron",
    title: "Board Member; Chief Marketing Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F9c772ecc1e27493abb2617aac7506cc6?format=webp&width=400"
  },
  {
    name: "Jay O'Malley",
    title: "Board Member; Chief Investment Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F81b60738a3c446deaa56835ff0ed693e?format=webp&width=400"
  },
  {
    name: "Olivia Philips",
    title: "Board Member; Chief Operating Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F477bf0701dcd412f829a0d8561369b90?format=webp&width=400"
  },
  {
    name: "Daniel Sloan",
    title: "Board Member; Chief Technology Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Ffbd3492989774d5ca255f0bc3da9dd91?format=webp&width=400"
  }
];

export default function AboutPage() {
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
      <main>
        {/* Hero Section with Image Collage */}
        <section className="w-full relative" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24 flex items-center">
                <div className="max-w-[711px]">
                  <h1 className="about-hero-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                    Stewardship Requires Accountability
                  </h1>
                  <div className="about-hero-description" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                    <p>
                      Art Investment Group Trust is governed by a board and leadership team with experience across art, culture, finance, and institutional stewardship.
                    </p>
                    <p>Oversight is intentional.</p>
                    <p>Responsibility is explicit.</p>
                    <p>
                      AIGT is not operated anonymously. Decisions are made by people accountable for long term outcomes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F8ed0757f4d7d41f9a6492d6376f81844?format=webp&width=800"
                  alt="Art collage representing stewardship and accountability"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 601px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Definition Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-gallery-plaster">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px]">
              <p className="text-[16px] sm:text-[18px] lg:text-[16px] leading-[26px] text-archive-slate">
                Art Investment Group Trust is a governed art investment platform focused on the acquisition, stewardship, and long term ownership of museum quality and culturally significant artworks for qualified participants.
              </p>
            </div>
          </div>
        </section>

        {/* About John Dowling Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-[37px] items-center">
              {/* Left Column - Image and Heading */}
              <div className="flex flex-col gap-8">
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-[310px] h-[310px] rounded-full overflow-hidden">
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2a84950d36374b0fbc5643367302bc6a?format=webp&width=620"
                      alt="John Dowling Jr."
                      fill
                      className="object-cover"
                      sizes="310px"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="about-john-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>About John Dowling Jr.</h2>
                  <h3 className="about-john-subtitle" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>A Legacy Being Stewarded in Real Time</h3>
                </div>
              </div>

              {/* Right Column - Bio */}
              <div className="about-john-bio-card">
                <p>
                  John Dowling is an accomplished painter, photographer, and writer whose four decade career has produced four complete collections.
                </p>
                <p>
                  Following a lifetime of serious medical challenges, John now lives with a condition for which there are no further medical interventions. He continues forward with clarity, gratitude, and full awareness of the limits of time.
                </p>
                <p>
                  With his creative output complete, John is focused on preservation, art therapy, and the thoughtful stewardship of his work so that it may endure beyond his lifetime.
                </p>
                <p>
                  This creates a rare moment for collectors. Historically, the strongest recognition and appreciation of an artist's work occurs once a body of work is closed. Here, acquisitions can be made while the artist is still alive and directly involved in how his legacy is shaped.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Two Ways to Steward Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[120px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">
              {/* Header */}
              <div className="flex flex-col items-center gap-4 max-w-[995px]">
                <h2 className="stewardship-ways-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                  Two Ways to Steward the Work
                </h2>
                <p className="stewardship-ways-subtitle" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                  The Ethereum Art Fund supports two complementary forms of stewardship for John Dowling Jr.'s work.
                </p>
              </div>

              {/* Cards */}
              <div className="grid md:grid-cols-2 gap-6 lg:gap-[34px] w-full max-w-[1198px]">
                {/* Fund Held Works Card */}
                <div className="stewardship-way-card">
                  <h3 className="stewardship-way-card-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>Fund Held Works</h3>
                  <p className="stewardship-way-card-description">
                    Selected works are acquired and stewarded within the Ethereum Art Fund as part of a governed, long horizon strategy.
                  </p>
                  <p className="stewardship-way-card-description">
                    These works are held to preserve cultural context, coherence, and long term significance.
                  </p>
                </div>

                {/* Private Placement Card */}
                <div className="stewardship-way-card">
                  <h3 className="stewardship-way-card-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>Private Placement of Individual Works</h3>
                  <p className="stewardship-way-card-description">
                    Select works are made available for direct private acquisition by aligned collectors and institutions, including hospitality, cultural, and architectural partners.
                  </p>
                  <p className="stewardship-way-card-description">
                    These placements are approached with discretion and curatorial intent, not volume based sales.
                  </p>
                  <p className="stewardship-way-card-description">
                    Both paths operate under the same standards of care, provenance, and cultural responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Mean by Art Stewardship Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px]">
              <h2 className="governance-title">
                What We Mean by Art Stewardship
              </h2>
              <p className="governance-description">
                Art stewardship at Art Investment Group Trust refers to the responsible acquisition, governance, custody, and long term ownership of culturally significant artworks. Stewardship prioritizes preservation, legitimacy, and continuity over liquidity or short term financial outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Art as a Long Term Alternative Investment Section */}
        <section className="w-full py-12 sm:py-16 lg:py-24" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px]">
              <h2 className="governance-title">
                Art as a Long Term Alternative Investment
              </h2>
              <p className="governance-description">
                Art is increasingly recognized as an alternative investment asset class when approached with institutional discipline. Art Investment Group Trust structures art ownership to support long duration holding periods, museum quality standards, and responsible capital alignment.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[120px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20 max-w-[995px] mx-auto">
              <h2 className="team-section-title" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                Stewardship Requires Accountability
              </h2>
              <p className="team-section-description">
                Art Investment Group Trust is governed by a board and leadership team with experience across art, culture, finance, and institutional stewardship. Oversight is intentional.
              </p>
              <p className="team-section-description">
                Responsibility is explicit. AIGT is not operated anonymously. Decisions are made by people accountable for long term outcomes.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-[51px] lg:gap-y-[95px]">
              {teamMembers.map((member, index) => {
                const titleParts = member.title.split('; ');
                const boardMember = titleParts[0];
                const role = titleParts.slice(1).join('; ');

                return (
                  <div key={index} className="flex flex-col items-center text-center">
                    {/* Photo */}
                    <div className="relative w-[102px] h-[102px] rounded-full overflow-hidden mb-6">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="102px"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="team-member-name" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>{member.name}</h3>

                    {/* Title */}
                    <div className="team-member-title-wrapper">
                      <p className="team-member-title">{boardMember}</p>
                      <p className="team-member-title">{role}</p>
                    </div>
                  </div>
                );
              })}
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
