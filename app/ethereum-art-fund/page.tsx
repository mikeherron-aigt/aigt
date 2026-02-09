'use client';

import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { useArtworks } from "@/app/hooks/useArtworks";
import type { Artwork } from "@/app/lib/api";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import Image from "next/image";
import { slugify } from "@/app/lib/slug";

const JOHN_DOWLING_PROFILE_URL = "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2a84950d36374b0fbc5643367302bc6a?format=webp&width=620";

interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const mapArtworkToItem = (artwork: Artwork): ArtworkItem => ({
  src: artwork.image_url,
  title: artwork.title,
  artist: artwork.artist,
  year: artwork.year_created ? artwork.year_created.toString() : "Contemporary",
  collection: artwork.collection_name,
});

const getArtworkHref = (artwork: { title: string; collection?: string }) => {
  if (!artwork.collection) return null;
  return `/collections/${slugify(artwork.collection)}/${slugify(artwork.title)}`;
};

export default function EthereumArtFundPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { artworks } = useArtworks({ version: "v02" });

  // Get random featured works from all collections
  const featuredWorks = useMemo(() => {
    const validArtworks = artworks
      .filter((artwork) => !artwork.title.toLowerCase().includes("untitled"))
      .map(mapArtworkToItem);

    // Shuffle array to get random selection
    const shuffled = [...validArtworks].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [artworks]);

  const heroArtwork = featuredWorks[0];
  const heroArtworkHref = heroArtwork ? getArtworkHref(heroArtwork) : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
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
    if ((e.target as HTMLElement).closest('a')) return;
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
                  <h1 style={{marginBottom: '17px', textAlign: 'left'}}>
                    Ethereum Art Fund
                  </h1>

                  {/* Subtitle */}
                  <div className="hero-subtitle" style={{textAlign: 'left'}}>
                    <p>
                      Tokenized Access to Ethereum-Native Cultural Assets
                    </p>
                  </div>

                  {/* Body Copy */}
                  <div style={{textAlign: 'left', marginTop: '24px'}}>
                    <p>
                      The Ethereum Art Fund is a governed platform designed to explore structured ownership, fractionalization, and tokenized access to culturally significant, Ethereum-native artworks.
                    </p>
                    <p style={{marginTop: '16px'}}>
                      Operating within the Art Investment Group Trust framework, EAF applies institutional governance to an emerging asset model that blends art stewardship with evolving blockchain-based ownership structures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  {heroArtwork?.src ? (
                    heroArtworkHref ? (
                      <Link
                        href={heroArtworkHref}
                        aria-label={`View details for ${heroArtwork.title}`}
                        className="block w-full h-full"
                      >
                        <ProgressiveImage
                          src={heroArtwork.src}
                          alt={heroArtwork.title}
                          fill
                          eager
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full">
                        <ProgressiveImage
                          src={heroArtwork.src}
                          alt={heroArtwork.title}
                          fill
                          eager
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    )
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: "var(--gallery-plaster)" }}
                    />
                  )}
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
                <div className="max-w-[579px]">
                  <h2 style={{marginBottom: '24px'}}>
                    Institutional Discipline for an Experimental Medium
                  </h2>
                  <p>
                    Ethereum-native art represents one of the most important cultural developments of the digital era. It also introduces new forms of ownership, liquidity, and risk.
                  </p>
                  <p>
                    Ethereum Art Fund is intentionally designed to operate with a higher risk profile and a shorter expected time horizon than other AIGT platforms.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="px-4 sm:px-8 lg:p-[80px_40px]" style={{backgroundColor: '#f5f5f5'}}>
                <h3 style={{marginBottom: '24px'}}>
                  Structured Exposure to Innovation
                </h3>
                <p style={{marginBottom: '16px'}}>
                  Applying governance to tokenized art ownership
                </p>
                <p style={{marginBottom: '16px'}}>
                  Exploring fractional participation structures
                </p>
                <p style={{marginBottom: '16px'}}>
                  Establishing standards for custody, documentation, and access
                </p>
                <p>
                  Creating controlled exposure to an evolving market
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="text-center">
                A Distinct Mandate
              </h2>
              <h3 className="text-center max-w-[735px]">
                The Ethereum Art Fund is differentiated from other Art Investment Group Trust stewardship platforms by its mandate.
              </h3>
              <p className="text-center max-w-[995px]">
                The Ethereum Art Fund was established with a clearly defined mandate. It operates at the intersection of cultural stewardship and evolving ownership models, engaging selectively with tokenization and fractional participation while maintaining institutional governance. This flexibility introduces additional risk and shorter time horizons, which are acknowledged and managed through structure rather than avoided.
              </p>
            </div>

            {/* Four Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Tokenization and Fractional Ownership Structures
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Emerging Market Infrastructure
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Innovation in Access and Participation
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Measured Engagement with Liquidity Dynamics
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* The Catalog of John Dowling Jr. Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[278px_1fr] gap-12 lg:gap-[120px] items-start">
              {/* Left: Image - John Dowling Jr. Profile Photo */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-[278px] h-[278px] rounded-full overflow-hidden">
                  <Image
                    src={JOHN_DOWLING_PROFILE_URL}
                    alt="John Dowling Jr."
                    fill
                    className="object-cover aigt-protected-image"
                    sizes="278px"
                  />
                </div>
              </div>

              {/* Right: Content */}
              <div className="max-w-[579px]">
                <h2 style={{marginBottom: '24px'}}>
                  The Catalog of John Dowling Jr.
                </h2>
                <p>
                  The fund launched with the complete Ethereum-native catalog of John Dowling Jr. as its foundational body of work.
                </p>
                <p>
                  Dowling's on-chain practice represents a cohesive and historically significant contribution to early Ethereum-native art. The catalog provides a structured and well-documented foundation suitable for experimentation with fractional ownership models under governance.
                </p>
                <p>
                  The collection offers:
                </p>
                <ul style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                  <li>Clear provenance</li>
                  <li>Cohesive artistic narrative</li>
                  <li>Sufficient scale for structured participation</li>
                  <li>Alignment with Ethereum-native principles</li>
                </ul>
              </div>
            </div>

            {/* Featured Works Slider */}
            <div className="mt-16">
              <h3 style={{marginBottom: '32px'}}>
                Featured Works
              </h3>
              
              {/* Slider Container */}
              <div className="slider-wrapper">
                <div className="slider-container">
                  <div
                    ref={sliderRef}
                    className="artwork-slider"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
                  >
                    {[...featuredWorks, ...featuredWorks].map((artwork, index) => (
                      <div key={index} className="artwork-card">
                        {(() => {
                          const artworkHref = getArtworkHref(artwork);
                          const imageContent = (
                            <div className="artwork-image-wrapper" style={{ aspectRatio: '247 / 206' }}>
                              <ProgressiveImage
                                src={artwork.src}
                                alt={artwork.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                              />
                            </div>
                          );

                          return artworkHref ? (
                            <Link
                              href={artworkHref}
                              className="artwork-card-button"
                              aria-label={`View details for ${artwork.title}`}
                            >
                              {imageContent}
                            </Link>
                          ) : (
                            <div className="artwork-card-button">{imageContent}</div>
                          );
                        })()}
                        <div className="artwork-info">
                          <h3>{artwork.title}</h3>
                          <p className="artwork-details">{artwork.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider Navigation Arrows */}
              <div className="flex justify-center items-center gap-6 mt-12">
                <button
                  onClick={() => scrollSlider('left')}
                  className="slider-nav-arrow slider-nav-arrow-left"
                  aria-label="Scroll left"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="slider-nav-arrow slider-nav-arrow-right"
                  aria-label="Scroll right"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How the Ethereum Art Fund Operates */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="text-center">
                How the Ethereum Art Fund Operates
              </h2>
              <h3 className="text-center max-w-[817px]">
                An overview of participation mechanics, risk profile, and operating discipline.
              </h3>
              <p className="text-center max-w-[995px]">
                The Ethereum Art Fund operates through selective acquisition, experimental ownership structures, higher risk tolerance, and governance designed to explore emerging models while maintaining institutional discipline.
              </p>
            </div>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Fractionalized Participation */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3>Fractionalized Participation</h3>
                  <p>
                    Ethereum Art Fund is designed to enable fractional exposure to curated bodies of work rather than sole ownership of individual pieces.
                  </p>
                  <p>
                    Participation structures may include:
                  </p>
                  <ul style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Tokenized representations of pooled artworks</li>
                    <li>Fractional economic interests</li>
                    <li>Defined governance and transfer parameters</li>
                    <li>Clear disclosures around risk and liquidity constraints</li>
                  </ul>
                  <p>
                    These structures are subject to regulatory considerations and are implemented conservatively.
                  </p>
                </div>
              </div>

              {/* Higher Risk. Shorter Horizon */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3>Higher Risk. Shorter Horizon</h3>
                  <p>
                    The Ethereum Art Fund carries a higher risk profile than the long-horizon stewardship Blue Chip Art Fund platform
                  </p>
                  <p>
                    Risk factors include:
                  </p>
                  <ul style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Market volatility</li>
                    <li>Regulatory evolution</li>
                    <li>Technological change</li>
                    <li>Liquidity uncertainty</li>
                    <li>Novel ownership structures</li>
                  </ul>
                  <p>
                    Ethereum Art Fund is intended for participants who understand and accept these dynamics as part of exposure to an emerging asset class.
                  </p>
                </div>
              </div>

              {/* Selective and Disciplined Growth */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3>Selective and Disciplined Growth</h3>
                  <p>
                    While the Dowling catalog serves as the foundation, Ethereum Art Fund may expand to include additional Ethereum-native works that meet the fund's acquisition and governance criteria.
                  </p>
                  <p>
                    Expansion remains selective and committee-driven, with a focus on cultural relevance and suitability for tokenized participation models.
                  </p>
                </div>
              </div>

              {/* Governance in a Digital Context */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3>Governance in a Digital Context</h3>
                  <p>
                    Despite its experimental mandate, Ethereum Art Fund maintains institutional custody and control standards, including:
                  </p>
                  <ul style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Secure digital asset custody</li>
                    <li>Redundant access management</li>
                    <li>Documentation and provenance continuity</li>
                    <li>Ongoing technical review</li>
                  </ul>
                  <p>
                    Innovation does not replace discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 style={{marginBottom: '16px'}}>
              Participation and Alignment
            </h2>
            <p className="max-w-[1038px]" style={{marginBottom: '48px'}}>
              Participation in the Ethereum Art Fund is intentionally structured. The following considerations outline who the platform is designed for, how it differs from other stewardship platforms, and the expectations around engagement, risk, and alignment.
            </p>

            {/* Three Grey Boxes */}
            <div className="flex flex-col gap-6">
              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>For Informed and Qualified Participants</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  Participation in the Ethereum Art Fund is offered through private placement to qualified participants who understand the experimental nature of tokenized art structures.
                </p>
                <p className="stewardship-card-description">
                  Ethereum Art Fund is not positioned as a preservation-only vehicle, nor as a trading product. It occupies a defined middle ground between stewardship and innovation.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>Complementary, Not Substitutable</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  Ethereum Art Fund operates alongside Art Investment Group Trust's long-horizon, lower-risk stewardship Blue Chip Art Fund platform. Participants seeking permanent ownership, minimal turnover, and preservation-first mandates may find those platforms more appropriate. Participants seeking structured exposure to tokenized art ownership and emerging market dynamics may find alignment with Ethereum Art Fund.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px', minHeight: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '0'}}>
                <h3 className="stewardship-card-title" style={{textAlign: 'left', width: '100%'}}>Informed Dialogue Required</h3>
                <p className="stewardship-card-description" style={{marginTop: '16px'}}>
                  Art Investment Group Trust engages prospective participants through direct, considered discussion. Understanding intent, risk tolerance, and time horizon is essential before participation. Request access to begin a private conversation about the Ethereum Art Fund.
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
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              {/* Private Conversations Section */}
              <div className="text-center flex flex-col items-center gap-4">
                <h3 className="text-center">
                  Private Conversations
                </h3>
                <p className="text-center max-w-[789px] mx-auto">
                  Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct, considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not transactions.
                </p>
                <p className="text-center max-w-[789px] mx-auto">
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
              <ProtectedImage
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
