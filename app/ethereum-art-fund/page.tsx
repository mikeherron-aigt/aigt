'use client';

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const featuredWorksData: ArtworkItem[] = [
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/bf1425734f332533a074c41067eab96904592547?width=539",
    title: "80s Series #2",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/c449ed6d6c50481da77fcd400331fe03b0bd186f?width=539",
    title: "80s Series #25",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/35d9e20b231328fe15361b6f6b89e3dc2744cfce?width=539",
    title: "80s Series #14",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/6054acc63d39b4b9f9397cb08da9efd2770dc874?width=539",
    title: "80s Series #53",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/e44fc8c56a4ca0c1eaae9adcf85aa3a3d8c7f4f3?width=539",
    title: "80s Series #38",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  }
];

export default function EthereumArtFundPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                <div className="max-w-[637px] w-full">
                  {/* Heading */}
                  <h1 className="hero-title" style={{marginBottom: '17px', textAlign: 'left'}}>
                    <div style={{fontSize: '41px', lineHeight: '45px'}}>
                      Ethereum Art Fund
                    </div>
                  </h1>

                  {/* Subtitle */}
                  <div className="hero-subtitle" style={{textAlign: 'left'}}>
                    <p>
                      Tokenized Access to Ethereum-Native Cultural Assets
                    </p>
                  </div>

                  {/* Body Copy */}
                  <div className="hero-description" style={{textAlign: 'left', marginTop: '24px'}}>
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
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F349e5ab13a9c47e395981fd33e7bb58e?format=webp&width=800&height=1200"
                    alt="Ethereum-native digital artwork"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements - Positioned at bottom of image */}
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 242px)'}}></div>
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 242px)', height: '242px'}}></div>
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

        {/* Institutional Discipline Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Left Column - Content */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col gap-4">
                <h2 className="governance-title" style={{textAlign: 'left', marginBottom: '8px'}}>
                  Institutional Discipline for<br />an Experimental Medium
                </h2>
                <p className="governance-description" style={{textAlign: 'left', marginBottom: '8px'}}>
                  Ethereum-native art represents one of the most important cultural developments of the digital era. It also introduces new forms of ownership, liquidity, and risk.
                </p>
                <p className="governance-description" style={{textAlign: 'left', marginBottom: '0'}}>
                  Ethereum Art Fund is intentionally designed to operate with a higher risk profile and a shorter expected time horizon than other AIGT platforms.
                </p>
              </div>

              {/* Right Column - Structured Exposure */}
              <div className="flex flex-col gap-4 bg-paper-white p-8 lg:p-10 relative">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '16px'}}>
                  Structured Exposure to Innovation
                </h3>
                <ul className="list-none space-y-0 p-0 m-0">
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '0'}}>
                    Applying governance to tokenized art ownership
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '16px'}}>
                    Exploring fractional participation structures
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '16px'}}>
                    Establishing standards for custody, documentation, and access
                  </li>
                  <li className="governance-description" style={{textAlign: 'left', marginBottom: '0', marginTop: '16px'}}>
                    Creating controlled exposure to an evolving market
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
                The Ethereum Art Fund is differentiated from other Art Investment Group Trust stewardship platforms by its mandate.
              </p>
              <p className="governance-description" style={{textAlign: 'center', marginBottom: '0'}}>
                The Ethereum Art Fund was established with a clearly defined mandate. It operates at the intersection of cultural stewardship and evolving ownership models, engaging selectively with tokenization and fractional participation while maintaining institutional governance. This flexibility introduces additional risk and shorter time horizons, which are acknowledged and managed through structure rather than avoided.
              </p>
            </div>
          </div>
        </section>

        {/* Four Pillars Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Pillar 1 */}
              <div className="stewardship-card flex items-center justify-center">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '0'}}>
                  Tokenization and Fractional Ownership Structures
                </h3>
              </div>

              {/* Pillar 2 */}
              <div className="stewardship-card flex items-center justify-center">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '0'}}>
                  Emerging Market Infrastructure
                </h3>
              </div>

              {/* Pillar 3 */}
              <div className="stewardship-card flex items-center justify-center">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '0'}}>
                  Innovation in Access and Participation
                </h3>
              </div>

              {/* Pillar 4 */}
              <div className="stewardship-card flex items-center justify-center">
                <h3 className="governance-subtitle" style={{textAlign: 'left', marginBottom: '0'}}>
                  Measured Engagement with Liquidity Dynamics
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* The Catalog of John Dowling Jr. Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[278px_1fr] gap-8 lg:gap-12 items-start">
              {/* Left Column - Circular Image */}
              <div className="relative w-full max-w-[278px] mx-auto aspect-square overflow-hidden rounded-full bg-gallery-plaster">
                <Image
                  src="https://api.builder.io/api/v1/image/assets/TEMP/5d9889dd68020021e18d3ebf590dcb30cf36417d?width=620"
                  alt="John Dowling Jr. portrait"
                  fill
                  className="object-cover object-center"
                  sizes="278px"
                />
              </div>

              {/* Right Column - Content */}
              <div className="flex flex-col gap-6">
                <h2 className="governance-title" style={{marginBottom: '8px'}}>
                  The Catalog of John Dowling Jr.
                </h2>
                <div className="flex flex-col gap-4">
                  <p className="governance-description" style={{marginBottom: '0'}}>
                    The fund launched with the complete Ethereum-native catalog of John Dowling Jr. as its foundational body of work.
                  </p>
                  <p className="governance-description" style={{marginBottom: '0'}}>
                    Dowling's on-chain practice represents a cohesive and historically significant contribution to early Ethereum-native art. The catalog provides a structured and well-documented foundation suitable for experimentation with fractional ownership models under governance.
                  </p>
                  <div className="governance-description" style={{marginBottom: '0'}}>
                    <p style={{marginBottom: '8px'}}>The collection offers:</p>
                    <ul className="list-disc list-inside space-y-2" style={{marginLeft: '0', paddingLeft: '20px'}}>
                      <li>Clear provenance</li>
                      <li>Cohesive artistic narrative</li>
                      <li>Sufficient scale for structured participation</li>
                      <li>Alignment with Ethereum-native principles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Works Section */}
            <div className="mt-12 lg:mt-16">
              <h3 className="governance-subtitle" style={{marginBottom: '24px'}}>
                Featured Works
              </h3>

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
                  {[...featuredWorksData, ...featuredWorksData].map((artwork, index) => (
                    <div key={index} className="artwork-card">
                      <button
                        className="artwork-card-button"
                        onClick={() => openModal(artwork)}
                        aria-label={`View full-size image of ${artwork.title} by ${artwork.artist}`}
                      >
                        <div className="artwork-image-wrapper" style={{ aspectRatio: '247 / 206' }}>
                          <Image
                            src={artwork.src}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                          />
                        </div>
                      </button>
                      <div className="artwork-info">
                        <h3 className="artwork-title">{artwork.title}</h3>
                        <p className="artwork-details">{artwork.artist}<br />{artwork.collection || 'Cosmic Dreams Collection'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Navigation Arrows */}
              <div className="flex justify-center items-center gap-6 mt-8">
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

        {/* How the Ethereum Art Fund Operates Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center text-center gap-8 lg:gap-10">
              {/* Header */}
              <div className="flex flex-col items-center gap-4 max-w-[995px]">
                <h2 className="governance-title" style={{textAlign: 'center', marginBottom: '0'}}>
                  How the Ethereum Art Fund Operates
                </h2>
                <p className="governance-subtitle" style={{textAlign: 'center', marginBottom: '0', maxWidth: '817px'}}>
                  An overview of participation mechanics, risk profile, and operating discipline.
                </p>
              </div>

              {/* Description */}
              <p className="governance-description" style={{textAlign: 'center', marginBottom: '0', maxWidth: '1022px'}}>
                The Ethereum Art Fund operates through selective acquisition, experimental ownership structures, higher risk tolerance, and governance designed to explore emerging models while maintaining institutional discipline.
              </p>

              {/* First Row of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-[1200px]">
                {/* Fractionalized Participation */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Fractionalized Participation</h3>
                    <p className="fund-card-description" style={{marginBottom: '16px'}}>
                      Ethereum Art Fund is designed to enable fractional exposure to curated bodies of work rather than sole ownership of individual pieces.
                    </p>
                    <p className="fund-card-description" style={{marginBottom: '8px'}}>
                      Participation structures may include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 fund-card-description" style={{paddingLeft: '20px'}}>
                      <li>Tokenized representations of pooled artworks</li>
                      <li>Fractional economic interests</li>
                      <li>Defined governance and transfer parameters</li>
                      <li>Clear disclosures around risk and liquidity constraints</li>
                    </ul>
                    <p className="fund-card-description" style={{marginTop: '8px'}}>
                      These structures are subject to regulatory considerations and are implemented conservatively.
                    </p>
                  </div>
                </div>

                {/* Higher Risk. Shorter Horizon */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Higher Risk. Shorter Horizon</h3>
                    <p className="fund-card-description" style={{marginBottom: '16px'}}>
                      The Ethereum Art Fund carries a higher risk profile than the long-horizon stewardship Blue Chip Art Fund platform
                    </p>
                    <p className="fund-card-description" style={{marginBottom: '8px'}}>
                      Risk factors include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 fund-card-description" style={{paddingLeft: '20px'}}>
                      <li>Market volatility</li>
                      <li>Regulatory evolution</li>
                      <li>Technological change</li>
                      <li>Liquidity uncertainty</li>
                      <li>Novel ownership structures</li>
                    </ul>
                    <p className="fund-card-description" style={{marginTop: '8px'}}>
                      Ethereum Art Fund is intended for participants who understand and accept these dynamics as part of exposure to an emerging asset class.
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Row of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-[1200px]">
                {/* Selective and Disciplined Growth */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Selective and Disciplined Growth</h3>
                    <p className="fund-card-description" style={{marginBottom: '16px'}}>
                      While the Dowling catalog serves as the foundation, EAF may expand to include additional Ethereum-native works that meet the fund's acquisition and governance criteria.
                    </p>
                    <p className="fund-card-description">
                      Expansion remains selective and committee-driven, with a focus on cultural relevance and suitability for tokenized participation models.
                    </p>
                  </div>
                </div>

                {/* Governance in a Digital Context */}
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3 className="fund-card-title">Governance in a Digital Context</h3>
                    <p className="fund-card-description" style={{marginBottom: '8px'}}>
                      Despite its experimental mandate, EAF maintains institutional custody and control standards, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 fund-card-description" style={{paddingLeft: '20px'}}>
                      <li>Secure digital asset custody</li>
                      <li>Redundant access management</li>
                      <li>Documentation and provenance continuity</li>
                      <li>Ongoing technical review</li>
                    </ul>
                    <p className="fund-card-description" style={{marginTop: '8px'}}>
                      Innovation does not replace discipline.
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
                  Participation in the Ethereum Art Fund is intentionally structured. The following considerations outline who the platform is designed for, how it differs from other stewardship platforms, and the expectations around engagement, risk, and alignment.
                </p>
              </div>

              {/* Three Cards */}
              <div className="flex flex-col gap-6 lg:gap-8">
                {/* Card 1 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px', background: '#f5f5f5'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">For Informed and Qualified Participants</h3>
                    <p className="stewardship-card-description">
                      Participation in the Ethereum Art Fund is offered through private placement to qualified participants who understand the experimental nature of tokenized art structures.
                    </p>
                    <p className="stewardship-card-description" style={{marginTop: '8px'}}>
                      Ethereum Art Fund is not positioned as a preservation-only vehicle, nor as a trading product. It occupies a defined middle ground between stewardship and innovation.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px', background: '#f5f5f5'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">Complementary, Not Substitutable</h3>
                    <p className="stewardship-card-description">
                      Ethereum Art Fund operates alongside Art Investment Group Trust's long-horizon, lower-risk stewardship Blue Chip Art Fund platform. Participants seeking permanent ownership, minimal turnover, and preservation-first mandates may find those platforms more appropriate. Participants seeking structured exposure to tokenized art ownership and emerging market dynamics may find alignment with Ethereum Art Fund.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="stewardship-card" style={{height: 'auto', minHeight: '202px', background: '#f5f5f5'}}>
                  <div className="flex flex-col gap-2">
                    <h3 className="stewardship-card-title">Informed Dialogue Required</h3>
                    <p className="stewardship-card-description">
                      Art Investment Group Trust engages prospective participants through direct, considered discussion. Understanding intent, risk tolerance, and time horizon is essential before participation. Request access to begin a private conversation about the Ethereum Art Fund.
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

      {/* Image Modal */}
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
