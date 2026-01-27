'use client';

import Image from "next/image";
import Link from "next/link";


export default function MuseumPage() {
  return (
    <div className="min-h-screen bg-white">


      <main className="mx-auto max-w-[1440px] w-full">
        {/* Hero Section */}
        <section className="w-full relative">
          <div className="relative w-full aspect-[1440/691] min-h-[400px] sm:min-h-[500px] lg:min-h-[691px]">
            {/* Background Image */}
            <Image
              src="https://api.builder.io/api/v1/image/assets/TEMP/6ed250fee4ad058d3aacac1ceeeab310ef8e0527?width=2880"
              alt="Museum exterior with landscaping and signage"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />

            {/* Content Overlay Box */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end px-4 sm:px-8">
              <div className="museum-hero-overlay">
                <h1 className="museum-hero-overlay-title">
                  A Public Institution for Long-Horizon Art Stewardship
                </h1>
                <p className="museum-hero-overlay-text">
                  The John Dowling Jr. Museum of Contemporary Art is a planned contemporary art museum conceived as a living cultural institution rooted on Long Island.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* John Dowling Jr's Personal History Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col gap-8 lg:gap-12 bg-white p-8 sm:p-12 lg:p-16">
              <h3 className="museum-card-title text-center">
                John Dowling Jr's personal history is inseparable from Long Island, where the museum is planned to take shape. Born in Queens and raised in the region, his connection to place grounds the institution in lived experience rather than abstraction, shaping how art is created, cared for, and shared.
              </h3>
              <hr style={{
                height: '1px',
                background: 'linear-gradient(to right, transparent 0%, var(--archive-slate) 10%, var(--archive-slate) 90%, transparent 100%)',
                opacity: '0.5',
                width: '100%',
                maxWidth: '500px',
                border: 'none',
                margin: '0 auto'
              }} />
              <div>
                <p className="museum-intro-text">
                  The museum bears his name not as recognition, but as responsibility. It reflects a lifelong commitment to artistic creation, care, and stewardship, anchoring the Trust's collections to a human narrative and a specific place while holding them to a standard designed to endure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Physical Expression of Stewardship Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_0.59fr] gap-0 items-center">
            {/* Content */}
            <div className="px-4 sm:px-8 lg:px-[80px]">
              <div className="max-w-[633px]">
                <h2 className="museum-section-heading">A Physical Expression of Stewardship</h2>
                <div>
                  <div>
                    <p>
                      The museum is more than an exhibition space. It is a physical manifestation of the principles that govern Art Investment Group Trust—a commitment to preserving cultural significance, supporting artistic creation, and ensuring public access to important works of art.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div className="museum-body-text">
                    The Dowling represents a deliberate choice to move beyond abstract stewardship and create an institution with roots in place, community, and long-term vision. Every aspect of the museum's design and operations reflects a philosophy that art deserves more than acquisition and storage—it deserves care, context, and continued cultural relevance.
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0ae93150a1c34f6d9a2c26642853c1b8?format=webp&width=800&height=1200"
                alt="Artist working on painting in studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </section>

        {/* Why This Museum Matters Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            {/* Header */}
            <div className="max-w-[1022px] mx-auto mb-12 sm:mb-16 lg:mb-20">
              <h2 className="museum-section-title">
                Why This Museum Matters
              </h2>
              <p className="museum-intro-text">
                Art Investment Group Trust was established to steward culturally significant art within a disciplined, governed framework. The Dowling gives that framework physical form.
              </p>
              <p className="museum-intro-text">
                By creating a permanent public institution, the Trust extends its responsibility beyond ownership and into preservation, access, and continuity. The museum exists to ensure that important contemporary works are not fragmented, hidden, or lost to time, but cared for as part of a coherent cultural record.
              </p>
            </div>

            {/* Info Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
              {/* Long-Term Stewardship */}
              <div className="museum-info-card">
                <h3 className="museum-card-title">Long-Term Stewardship</h3>
                <p className="museum-card-description">
                  The museum is conceived as a permanent home for contemporary works, allowing art to be cared for, studied, and experienced over time rather than treated as a rotating display.
                </p>
              </div>

              {/* Permanent Public Access */}
              <div className="museum-info-card">
                <h3 className="museum-card-title">Permanent Public Access</h3>
                <p className="museum-card-description">
                  By establishing a physical institution, the museum provides sustained public access to significant works and artistic practice within a stable, welcoming cultural setting.
                </p>
              </div>

              {/* Living Artistic Practice */}
              <div className="museum-info-card">
                <h3 className="museum-card-title">Living Artistic Practice</h3>
                <p className="museum-card-description">
                  Through a visible working studio, the museum places artistic creation at the center of the visitor experience, allowing process and finished work to exist side by side.
                </p>
              </div>

              {/* Cultural and Human Impact */}
              <div className="museum-info-card">
                <h3 className="museum-card-title">Cultural and Human Impact</h3>
                <p className="museum-card-description">
                  Beyond exhibition, the museum supports art therapy and community-oriented programs, recognizing art's capacity to contribute to care, reflection, and public well-being.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Museum Interior Image */}
        <section className="w-full bg-white py-0">
          <div className="max-w-[1440px] mx-auto">
            <div className="relative w-full aspect-[1452/739]">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/51176b4e0735f737b34cf505c5b5bcae40be0fa8?width=2904"
                alt="Contemporary art museum interior with gallery spaces and visitors"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </section>

        {/* A Living Studio Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_0.59fr] gap-0 items-center">
            {/* Content */}
            <div className="px-4 sm:px-8 lg:px-[80px]">
              <div className="max-w-[717px]">
                <h2 className="museum-section-heading">A Living Studio</h2>
                <div>
                  <div>
                    <p>
                      The Living Studio is conceived as an active site of creation within the museum, where artistic process exists in full view of the public.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div>
                    <p>
                      Artists in residence across disciplines including painting, sculpture, mixed media, and experimental practices will be invited to work on site for extended periods of time. These residencies are designed to support sustained practice rather than production schedules, allowing work to evolve through repetition, restraint, and revision.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div className="museum-body-text">
                    In addition to invited residents, the studio is intended to serve as a shared resource for local and regional artists. Through structured access and curated programs, members of the surrounding artistic community will be invited to utilize the space, tools, and institutional support of the museum.
                  </div>
                  <div className="museum-body-text">
                    By placing creation alongside collection, the Living Studio reinforces the museum's belief that art is not only something to be preserved, but something that must be continually made. The studio exists not as a spectacle, but as a working environment that honors craft, labor, and time.
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/0156f455a577a883d93b34ab681952510a64b559?width=1134"
                alt="Artist working in studio space"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </section>

        {/* Museum Building Exterior */}
        <section className="w-full bg-white py-0">
          <div className="max-w-[1440px] mx-auto">
            <div className="relative w-full aspect-[1440/659]">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/993fce7f4cbdeb5419ed8fb537bede67fa167604?width=2880"
                alt="Contemporary museum building exterior with modern architecture"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </section>

        {/* Museum Leadership Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-24 items-start">
              {/* Left Column - Image and Name */}
              <div className="flex flex-col items-center">
                <div className="museum-leadership-image mb-8">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/f1d73ec8954825f00b041cba2058662b7fed67c6?width=1028"
                    alt="Ashley Murison, Museum Director & Chief of Staff"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 280px, 280px"
                  />
                </div>
                <div className="text-center">
                  <h3 className="museum-leadership-name" style={{paddingTop: '20px'}}>Ashley Murison</h3>
                  <p className="museum-leadership-title">Museum Director &<br/>Chief of Staff</p>
                </div>
              </div>

              {/* Right Column - Info Box */}
              <div className="bg-paper-white p-8 lg:p-10">
                <h2 className="museum-section-heading mb-6">Museum Leadership</h2>
                <div className="museum-leadership-bio space-y-6">
                  <p className="museum-body-text">
                    Ashley Murison serves as Museum Director and Chief of Staff for the John Dowling Jr. Museum of Contemporary Art, overseeing institutional planning, curatorial coordination, and operational execution.
                  </p>
                  <p className="museum-body-text">
                    In this role, she is responsible for translating the museum's long-term vision into a functioning public institution, guiding program development, artist residencies, community engagement, and day-to-day leadership as the museum moves from planning to realization. She works closely with Art Investment Group Trust leadership to ensure alignment between artistic purpose, institutional integrity, and public responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead Section */}
        <section className="w-full bg-paper-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Content */}
              <div className="max-w-[633px]">
                <h2 className="museum-section-heading">Looking Ahead</h2>
                <div>
                  <div>
                    <p>
                      The John Dowling Jr. Museum of Contemporary Art is currently in the planning phase. While a final site has not yet been selected and construction timelines remain under development, the institutional framework, curatorial intent, and long-term commitment behind the museum are already in place.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div>
                    <p>
                      This museum is not conceived as a speculative concept or temporary installation. It is a deliberate extension of Art Investment Group Trust's stewardship mandate, translating long-duration ownership and custodial discipline into a permanent public institution. The planning process reflects the same measured approach that governs the Trust's collections, prioritizing durability, purpose, and cultural relevance over speed.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div>
                    <p>
                      When realized, the Dowling will stand as a lasting cultural presence on Long Island, designed to house significant contemporary works, support ongoing artistic creation, and serve the public across generations. The renderings shown here reflect not an idea in abstraction, but a clear and considered vision for an institution built to endure.
                    </p>
                    <p>
                      <br />
                    </p>
                  </div>
                  <div>
                    <p>This is not a promise of immediacy. </p>
                    <p>It is a commitment to permanence.</p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[94/85] lg:max-w-[564px]">
                <Image
                  src="https://api.builder.io/api/v1/image/assets/TEMP/cf693bd9cacbe96f0d8e06bbafdc005d1ccd6baa?width=1128"
                  alt="Museum planning and architectural concept"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 564px"
                />
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

        {/* Footer Section */}
        <footer className="w-full" style={{backgroundColor: '#f5f5f5', paddingTop: '32px', paddingBottom: '32px'}}>
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
      </main>
    </div>
  );
}
