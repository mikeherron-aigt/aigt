'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";

interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  linkedinUrl?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Justin Fien",
    title: "Chairman",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0a20bbeb53d14e0eb90701446fed69fc?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/justin-fien-9a8763107/"
  },
  {
    name: "Jay O'Malley",
    title: "Chief Executive Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F81b60738a3c446deaa56835ff0ed693e?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/jay-o-malley-8102761b0/"
  },
  {
    name: "Steve Duren",
    title: "Chief Commercial Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fb25ae8084fb345bb8e78dd40e7afe448?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/steve-duren/"
  },
  {
    name: "Olivia Philips",
    title: "Chief Operating Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F477bf0701dcd412f829a0d8561369b90?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/meetoliviaphillips/"
  },
  {
    name: "Mike Herron",
    title: "Chief Marketing Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F9c772ecc1e27493abb2617aac7506cc6?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/mherron54/"
  },
  {
    name: "Jose Bracho",
    title: "Chief Business Development Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2163c773e4894f2095d0df4caddae544?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/jose-bracho-900557125/"
  },
  {
    name: "Daniel Sloan",
    title: "Chief Technology Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Ffbd3492989774d5ca255f0bc3da9dd91?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/sloandaniel/"
  },
  {
    name: "Abdur Nimeri",
    title: "Chief Investment Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F603a49449dd7440ba868f514734aaa6d?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/abdur-nimeri-52b11721/"
  },
  {
    name: "Dennis Epperson",
    title: "Chief Financial Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F4e10a705bbf7443c852fffa71aa20159?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/dennisepperson/"
  },
  {
    name: "Ashley Murison",
   title: "Museum Director\nChief of Staff",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F9294e8137f304e6aaeb4019b03c91a2a?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/ashleymurison/"
  },
{
    name: "John Joseph Dowling Jr.",
    title: "VR Museum Director\nChief Visionary Officer",
    description: "",
    imageUrl: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2a84950d36374b0fbc5643367302bc6a?format=webp&width=400",
    linkedinUrl: "https://www.linkedin.com/in/johndowlingjr/"
  },
  
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section with Image Collage */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto relative">
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

            {/* Decorative Elements - Positioned at bottom of image */}
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 242px)'}}></div>
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 242px)', height: '242px'}}></div>
          </div>
        </section>

        {/* Design Bar - Full Width */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          {/* Left portion - Gallery Plaster (extends to left edge of square) */}
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{width: 'calc(50vw + 112px)'}}></div>
          {/* Right portion - Ledger Stone (starts at right edge of square) */}
          <div className="absolute top-0 h-full bg-ledger-stone" style={{left: 'calc(50vw + 105px)', right: '0'}}></div>

          {/* Centered max-width container with square */}
          <div className="max-w-[1440px] w-full h-full relative">
            {/* Dark green square - same positioning as vertical bar */}
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{left: 'calc(60% - 32px)'}}></div>
          </div>
        </div>

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
                const photoElement = (
                  <div className="relative w-[102px] h-[102px] rounded-full overflow-hidden mb-6 hover:opacity-80 transition-opacity cursor-pointer">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="102px"
                    />
                  </div>
                );

                return (
                  <div key={index} className="flex flex-col items-center text-center">
                    {/* Photo */}
                    {member.linkedinUrl ? (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${member.name}'s LinkedIn profile`}
                      >
                        {photoElement}
                      </a>
                    ) : (
                      photoElement
                    )}

                    {/* Name */}
                    <h3 className="team-member-name" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>{member.name}</h3>

                    {/* Board Member Badge */}
                    <p className="team-member-board-badge" style={{fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 'bold', fontSize: '14px', marginTop: '4px', marginBottom: '2px'}}>Board Member</p>

                    {/* Title */}
               <p className="team-member-title" style={{ whiteSpace: 'pre-line' }}>
  {member.title}
</p>


                    {/* LinkedIn Icon */}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center w-5 h-5 transition-colors"
                        style={{color: 'var(--archive-slate, #555)'}}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#0A66C2')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--archive-slate, #555)')}
                        aria-label={`Visit ${member.name}'s LinkedIn profile`}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18.4 0H1.6C0.72 0 0 0.72 0 1.6v16.8C0 19.28 0.72 20 1.6 20h16.8c0.88 0 1.6-0.72 1.6-1.6V1.6C20 0.72 19.28 0 18.4 0zM6 17H3V8h3v9zm-1.5-10.24c-0.96 0-1.74-0.78-1.74-1.74s0.78-1.74 1.74-1.74 1.74 0.78 1.74 1.74-0.78 1.74-1.74 1.74zM17 17h-3v-4.74c0-1.12-0.04-2.58-1.58-2.58-1.58 0-1.82 1.24-1.82 2.52V17h-3V8h2.88v1.24h0.04c0.4-0.76 1.38-1.56 2.86-1.56 3.06 0 3.62 2.02 3.62 4.64V17z" />
                        </svg>
                      </a>
                    )}
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
