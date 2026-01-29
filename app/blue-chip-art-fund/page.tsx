'use client';

import Image from "next/image";

import { useState, useRef, useEffect } from "react";

interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
}

const featuredWorks: ArtworkItem[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F270bfbf622d44bb58da3863d2d4a1416?format=webp&width=800",
    title: "80s Series #2",
    artist: "John Dowling Jr.",
    year: "Contemporary"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0b223e89165544369065645eb9e01981?format=webp&width=800",
    title: "80s Series #25",
    artist: "John Dowling Jr.",
    year: "Contemporary"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F412947b95d6b487f8e94d9db43269338?format=webp&width=800",
    title: "80s Series #14",
    artist: "John Dowling Jr.",
    year: "Contemporary"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F41a3331c307447f9a770facf2b3f3f7b?format=webp&width=800",
    title: "80s Series #53",
    artist: "John Dowling Jr.",
    year: "Contemporary"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F08edb5409851472b964e3c762012ec12?format=webp&width=800",
    title: "80s Series #38",
    artist: "John Dowling Jr.",
    year: "Contemporary"
  }
];

export default function BlueChipArtFundPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 350;
    const newScrollLeft = direction === 'left'
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const openModal = (artwork: ArtworkItem) => {
    setSelectedImage(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isModalOpen]);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>


      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center py-12 lg:py-0">
                <div className="max-w-[711px] w-full">
                  {/* Heading */}
                  <h1 className="hero-title" style={{marginBottom: '17px', textAlign: 'left'}}>
                    Blue Chip Art Fund
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
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F97494ca48242488c963375b90301c8d2?format=webp&width=800&height=1200"
                    alt="Quiet, refined interior space evoking long-term art stewardship"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 242px)'}}></div>
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 242px)', height: '242px'}}></div>
          </div>
        </section>

        {/* Design Bar */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{width: 'calc(50vw + 112px)'}}></div>
          <div className="absolute top-0 h-full bg-ledger-stone" style={{left: 'calc(50vw + 105px)', right: '0'}}></div>
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{left: 'calc(60% - 32px)'}}></div>
          </div>
        </div>

        {/* Two Column Content Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Left Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
              
                  <h2 className="governance-title" style={{marginBottom: '24px'}}>
                    Institutional Stewardship for Established Art
                  </h2>
                  <p className="governance-description">
                    The Blue Chip Art Fund is designed for artworks with established cultural significance and enduring historical relevance.
                  </p>
                  <p className="governance-description">
                    The fund applies institutional governance, professional custody standards, and long-horizon ownership to works that warrant preservation across generations rather than participation in evolving market structures.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="px-4 sm:px-8 lg:p-[80px_40px]" style={{backgroundColor: '#f5f5f5'}}>
                <h3 className="governance-title" style={{marginBottom: '24px', fontSize: '28px', lineHeight: '36px'}}>
                  Preservation-First Stewardship
                </h3>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Prioritizing long-duration ownership over liquidity
                </p>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Maintaining museum-quality custody and care standards
                </p>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Preserving provenance, context, and historical integrity
                </p>
                <p className="governance-description">
                  Minimizing turnover to support long-term cultural value
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">
                A Distinct Mandate
              </h2>
              <p className="governance-subtitle text-center max-w-[735px]">
                The Blue Chip Art Fund is differentiated by its preservation-first mandate and long-term ownership horizon.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The Blue Chip Art Fund operates with the explicit objective of long-term stewardship. It prioritizes permanence, stability, and cultural continuity over liquidity or market responsiveness.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                Acquisitions are made with the expectation of extended holding periods, limited turnover, and careful custodial management designed to preserve both physical condition and historical context.
              </p>
            </div>

            {/* Four Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Long-Horizon Ownership
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Preservation-First Stewardship
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Selective and Infrequent Acquisition
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Institutional Custody and Care
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Curatorial and Acquisition Focus Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[417px_1fr] gap-[28.8px] lg:gap-[72px] items-start">
              {/* Left: Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-[417px] h-[417px] overflow-hidden">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F46a1b818e6284590a3a3c7f7dc300464?format=webp&width=800&height=1200"
                    alt="Quiet, refined interior space evoking long-term art stewardship"
                    fill
                    className="object-cover"
                    sizes="417px"
                  />
                </div>
              </div>

              {/* Right: Content */}
              <div className="max-w-[579px]" style={{marginLeft: '-30px'}}>
                <h2 className="governance-title" style={{marginBottom: '24px'}}>
                  Curatorial and Acquisition Focus
                </h2>
                <p className="governance-description">
                  The Blue Chip Art Fund is focused on the acquisition and long-term stewardship of artworks with established cultural, historical, and institutional significance.
                </p>
                <p className="governance-description">
                  Works are selected based on enduring relevance, provenance integrity, and suitability for extended custodial care. The fund prioritizes pieces that have demonstrated lasting influence within art history rather than short-term market momentum.
                </p>
                <p className="governance-description">
                  Acquisition activity remains selective and deliberate, with an emphasis on quality, context, and preservation over volume.
                </p>
                <p className="governance-description">
                  Areas of focus to include:
                </p>
                <ul className="governance-description" style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                  <li>Historically significant modern and contemporary works</li>
                  <li>Artists with sustained institutional recognition</li>
                  <li>Works with documented exhibition and publication history</li>
                  <li>Pieces suitable for museum-quality custody and conservation</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* How the Blue Chip Art Fund Operates */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">
                How the Blue Chip Art Fund Operates
              </h2>
              <p className="governance-subtitle text-center max-w-[817px]">
                An overview of stewardship priorities, acquisition discipline, and long-term custodial care.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The Blue Chip Art Fund operates through selective acquisition, long-duration ownership, institutional custody standards, and governance designed to minimize turnover while preserving cultural value.
              </p>
            </div>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Long-Term Ownership */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Long-Term Ownership</h3>
                  <p className="practice-card-description">
                    The fund is designed for extended holding periods, with no expectation of short-term liquidity.
                  </p>
                </div>
              </div>

              {/* Lower Risk Profile */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Lower Risk Profile</h3>
                  <p className="practice-card-description">
                    By focusing on historically established works, the fund emphasizes stability over market volatility.
                  </p>
                </div>
              </div>

              {/* Selective Acquisition */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Selective Acquisition</h3>
                  <p className="practice-card-description">
                    Growth occurs infrequently and only when works meet strict cultural and custodial criteria.
                  </p>
                </div>
              </div>

              {/* Institutional Custody */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Institutional Custody</h3>
                  <p className="practice-card-description">
                    Works are maintained under professional standards appropriate for museum-quality art.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="governance-title" style={{marginBottom: '16px'}}>
              Participation and Alignment
            </h2>
            <p className="governance-description max-w-[1038px]" style={{marginBottom: '48px'}}>
              Participation in the Blue Chip Art Fund is designed for those aligned with long-term stewardship and preservation-first ownership.
            </p>

            {/* Three Grey Boxes */}
            <div className="flex flex-col gap-6">
              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>For Long-Term Stewards</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  Participation in the Blue Chip Art Fund is designed for individuals and institutions aligned with long-duration ownership and cultural stewardship.
                </p>
                <p className="stewardship-card-description">
                  The fund is intended for those who value continuity, preservation, and measured decision-making over short-term market responsiveness.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>Preservation, Not Liquidity</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  The Blue Chip Art Fund is not structured to prioritize liquidity, frequent transactions, or short-term price discovery.
                </p>
                <p className="stewardship-card-description">
                  Acquisitions are made with the expectation of extended holding periods, minimal turnover, and stewardship practices designed to preserve artistic, historical, and cultural integrity across generations.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>Deliberate Engagement</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  Art Investment Group Trust engages prospective participants through direct, considered discussion.
                </p>
                <p className="stewardship-card-description">
                  Participation begins with alignment around intent, stewardship philosophy, and long-term commitment rather than transaction-driven timelines.
                </p>
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
                <a href="/request-access" className="footer-cta-primary" style={{textDecoration: 'none', display: 'inline-flex'}}>
                  Schedule a Discussion
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

     

      {/* Image Modal - Same as home page */}
      {isModalOpen && selectedImage && (
        <div
          className="image-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size image viewer"
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-modal-close"
              onClick={closeModal}
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="image-modal-image-container">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            <div className="image-modal-info">
              <h2 className="image-modal-title">{selectedImage.title}</h2>
              <p className="image-modal-artist">{selectedImage.artist}, {selectedImage.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
