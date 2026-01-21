'use client';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";

interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const heroImages = [
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fffdf589de0bc4ea786d46b0d19e5477d?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fecd9bd97bdd94631b8bd359628504a86?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F78f0641dd09441d8940c7e4a70caaa37?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd55dfac4060d4f0eb36a87b0891cb969?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F1966a05cfb05418da8649eee471aebbb?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F25168eaaf54c432d92f9ef91b0c70273?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F8ea49871f2d147b9b748f6894c7520ad?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fdd0cfe564a194c7fb87c735f9d338e43?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fc0a258d5cae343aea89a7c36e3767fe2?format=webp&width=800"
];

const artworkData: ArtworkItem[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F270bfbf622d44bb58da3863d2d4a1416?format=webp&width=800",
    title: "80s Series #2",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0b223e89165544369065645eb9e01981?format=webp&width=800",
    title: "80s Series #25",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F412947b95d6b487f8e94d9db43269338?format=webp&width=800",
    title: "80s Series #14",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F41a3331c307447f9a770facf2b3f3f7b?format=webp&width=800",
    title: "80s Series #53",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F08edb5409851472b964e3c762012ec12?format=webp&width=800",
    title: "80s Series #38",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0758ca8fed06418c994a30eac779317f?format=webp&width=800",
    title: "80s Series #68",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F99ae9a973978458da61eddb794151497?format=webp&width=800",
    title: "80s Series #99",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2249d103ff824a26a277d0c413cf9c9c?format=webp&width=800",
    title: "Cosmic Dreams #001451",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F5aecfbbcd4cf49d98bf9a1eb9b2b08e9?format=webp&width=800",
    title: "80s Series #8",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F57017ec8c4284ef3897083c05ccb4a39?format=webp&width=800",
    title: "80s Series #32",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F4b0284b925464d1d9c172bd648f259e3?format=webp&width=800",
    title: "80s Series #29",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fe0ebfc6ee0a247898c870f509e743ab0?format=webp&width=800",
    title: "80s Series #43",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fa85281a076fa48b4b997fac1adf8470a?format=webp&width=800",
    title: "80s Series #123",
    artist: "John Dowling Jr.",
    year: "Contemporary",
    collection: "Cosmic Dreams Collection"
  }
];

const governanceImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F409e962a5a31455bac419bcb11ccf171?format=webp&width=800",
  title: "Contemporary Governance",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

const mediumsImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=800",
  title: "One Standard Across Mediums",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

const artArtistsImage: ArtworkItem = {
  src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F191d1f3757b744a3bb4c98c59bd49eba?format=webp&width=800",
  title: "Art and Artists",
  artist: "John Dowling Jr.",
  year: "Contemporary",
  collection: "Cosmic Dreams Collection"
};

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const faqItems = [
    {
      question: "What is an art investment fund?",
      answer: "An art investment fund is a structured vehicle that acquires and holds artworks as long term assets, typically emphasizing governance, custody, and preservation rather than short term buying and selling."
    },
    {
      question: "How does institutional art investment work?",
      answer: "Institutional art investment applies governance frameworks, professional custody standards, and long horizon ownership principles to the acquisition and stewardship of fine art."
    },
    {
      question: "Who can invest in art through Art Investment Group Trust?",
      answer: "Participation is limited to qualified purchasers, institutions, family offices, and approved partners through private conversations and governed access."
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    // Don't start dragging if clicking on a button
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
    const scrollAmount = 350; // Amount to scroll per click
    const newScrollLeft = direction === 'left'
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const toggleSubtitles = () => {
    if (!videoRef.current) return;
    const newState = !subtitlesEnabled;
    const textTracks = videoRef.current.textTracks;

    if (textTracks && textTracks.length > 0) {
      for (let i = 0; i < textTracks.length; i++) {
        if (textTracks[i].kind === 'subtitles' || textTracks[i].kind === 'captions') {
          textTracks[i].mode = newState ? 'showing' : 'hidden';
        }
      }
    }
    setSubtitlesEnabled(newState);
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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setHeroImage(heroImages[randomIndex]);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      const textTracks = video.textTracks;
      if (textTracks && textTracks.length > 0) {
        for (let i = 0; i < textTracks.length; i++) {
          const track = textTracks[i];
          if (track.kind === 'subtitles' || track.kind === 'captions') {
            // Explicitly set to showing mode
            track.mode = 'showing';
            setSubtitlesEnabled(true);
          }
        }
      }
    };

    // Try to enable subtitles after a small delay to ensure tracks are loaded
    const timeoutId = setTimeout(() => {
      if (video.textTracks && video.textTracks.length > 0) {
        for (let i = 0; i < video.textTracks.length; i++) {
          if (video.textTracks[i].kind === 'subtitles' || video.textTracks[i].kind === 'captions') {
            video.textTracks[i].mode = 'showing';
          }
        }
      }
    }, 500);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      {/* FAQ Schema */}
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
      {/* Header */}
      <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-6 relative">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              <Link href="/about" className="nav-link">About</Link>
              <a href="#investment-offerings" className="nav-link">Offerings</a>
              <a href="#gallery" className="nav-link">Gallery</a>
              <a href="#stewardship-in-practice" className="nav-link">Stewardship</a>
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
                    href="#investment-offerings"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Offerings
                  </a>
                  <a
                    href="#gallery"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gallery
                  </a>
                  <a
                    href="#stewardship-in-practice"
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

      {/* Hero Section */}
      <main>
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
              <div className="max-w-[637px]">
                {/* Heading */}
                <h1 className="hero-title" style={{marginBottom: '17px'}}>
                  <div style={{fontSize: '41px', lineHeight: '45px'}}>
                    The Art That Matters<br />The Stewardship It Deserves
                  </div>
                </h1>

                {/* Subtitle */}
                <div className="hero-subtitle">
                  <p>
                    Art Investment Group Trust was established to acquire, hold, and steward artworks of cultural significance within a disciplined, governed framework.{" "}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[18px] mt-6 sm:mt-8">
                  <Link href="/request-access" className="cta-primary" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Request Access
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
              <div className="absolute inset-0">
                {heroImage && (
                  <Image
                    src={heroImage}
                    alt="Cultural artwork representing the trust's collection"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Decorative Elements - Positioned at bottom of image, above footer */}
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 242px)'}}></div>
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 242px)', height: '242px'}}></div>
        </div>

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

        {/* New Info Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
                <div className="max-w-[711px]">
                  <h2 className="governance-title">
                    Art Investment, Structured for the Long Term
                  </h2>
                  <p className="governance-description">
                    Art Investment Group Trust is a governed art investment platform focused on the acquisition, stewardship, and long term ownership of museum quality and culturally significant artworks for qualified participants.
                  </p>
                  <p className="governance-description">
                    Art Investment Group Trust operates art investment funds and stewardship platforms for those seeking long term exposure to fine art as an alternative asset class. Our approach prioritizes governance, custody, care, and cultural legitimacy over short term trading or speculation.
                  </p>
                </div>
              </div>

              {/* Video Embed */}
              <div
                className="video-container-wrapper"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.controls = true;
                  setIsVideoHovered(true);
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.controls = false;
                  setIsVideoHovered(false);
                }}
              >
                <video
                  ref={videoRef}
                  className="video-element"
                  width="100%"
                  height="100%"
                  autoPlay
                  muted
                  crossOrigin="anonymous"
                >
                  <source src="https://cdn.builder.io/o/assets%2F5031849ff5814a4cae6f958ac9f10229%2Ff3b28b352ad0461ba487be029ca85fa4?alt=media&token=96924fb3-b2c5-49c6-bb22-1ad36aba0d90&apiKey=5031849ff5814a4cae6f958ac9f10229" type="video/mp4" />
                  <track kind="subtitles" src="/aigt.vtt" srcLang="en" label="English" default />
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={toggleSubtitles}
                  className={`video-subtitles-button ${isVideoHovered ? 'video-subtitles-visible' : ''}`}
                  aria-label={subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'}
                  title={subtitlesEnabled ? 'Disable subtitles' : 'Enable subtitles'}
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="13" y2="14" />
                  </svg>
                  <span className="video-subtitles-label">{subtitlesEnabled ? 'CC On' : 'CC Off'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection Section */}
        <section className="w-full bg-white pt-0 pb-16 sm:pb-20 lg:pb-[104px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="section-heading">
              Featured Collection
            </h2>
          </div>

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
                {[...artworkData, ...artworkData].map((artwork, index) => (
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
          </div>

          {/* Slider Navigation Arrows */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] flex justify-center items-center gap-6 mt-12">
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
        </section>

        {/* Governance Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-24 flex flex-col">
                <div className="max-w-[579px]">
                  {/* Our Purpose */}
                  <div>
                    <h2 className="governance-title">
                      Our Purpose
                    </h2>
                    <p className="governance-description">
                      Art carries cultural weight long before it carries financial value. When important works are treated primarily as assets, their context, integrity, and long-term significance are often compromised.<br /><br />Art Investment Group Trust exists to address this imbalance. We provide structures designed to protect cultural importance, resist short-term pressures, and ensure that significant works are held with intention, care, and institutional discipline.<br /><br />This philosophy guides every acquisition, every governance decision, and every relationship we enter.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider-line my-12 lg:my-16"></div>

                <div className="max-w-[579px]">
                  {/* Our Approach */}
                  <div>
                    <h2 className="governance-title">
                      Stewardship Before Everything
                    </h2>
                    <p className="governance-description">
                      We approach art through the lens of stewardship rather than speculation. That means prioritizing long-horizon ownership, rigorous governance, and responsible custody over velocity or volume.<br /><br />Our structures are intentionally designed to slow the process, encourage patience, and align participants around preservation, context, and care. Liquidity is episodic. Cultural responsibility is continuous.<br /><br />This approach applies equally across all mediums.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative w-full h-full overflow-hidden min-h-[900px]">
                <button
                  onClick={() => openModal(governanceImage)}
                  className="governance-image-button"
                  aria-label="View full-size image of Contemporary Governance artwork"
                >
                  <div className="absolute inset-0">
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F409e962a5a31455bac419bcb11ccf171?format=webp&width=800"
                      alt="Contemporary artwork representing governance structure"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Two Funds Section */}
        <section id="investment-offerings" className="w-full bg-white py-12 sm:py-16 lg:py-[104px]">
          <div className="max-w-[1441px] mx-auto">
            <div className="flex flex-col items-center gap-20">
              {/* Top Content */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col items-center gap-4 max-w-full">
                <div className="flex flex-col items-center gap-4 max-w-[995px]">
                  <h2 className="funds-title">
                    Investment Offerings
                  </h2>
                  <h3 className="funds-subtitle">
                    Distinct Platforms.  One Philosophy
                  </h3>
                  <p className="funds-description">
                    Art Investment Group Trust operates multiple governed platforms, each designed to support different forms of cultural expression while adhering to the same standards of stewardship and oversight.
                  </p>
                </div>
              </div>

              {/* Fund Cards */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-[34px] w-full mt-16">
                  {/* Ethereum Art Fund Card */}
                  <div className="fund-card">
                    <div className="fund-card-content">
                      <h3 className="fund-card-title">Ethereum Art Fund</h3>
                      <p className="fund-card-description">
                        The Ethereum Art Fund extends the same stewardship philosophy to Ethereum native artworks. These works are approached not as speculative instruments, but as culturally relevant expressions native to a digital medium.<br /><br />Governance, custody, and long-term intent mirror those applied to traditional art, with optional structures introduced only where appropriate and permitted.
                      </p>
                      <Link href="/ethereum-art-fund" className="cta-primary" style={{textDecoration: 'none', width: 'fit-content', alignSelf: 'flex-start'}}>
                        Learn More
                      </Link>
                    </div>
                  </div>

                  {/* Blue Chip Art Fund Card */}
                  <div className="fund-card">
                    <div className="fund-card-content">
                      <h3 className="fund-card-title">Blue Chip Art Fund</h3>
                      <p className="fund-card-description">
                        Focused on established works with deep cultural and historical significance, the Blue Chip Art Fund acquires and stewards museum-quality artworks through long-horizon ownership and institutional governance.<br /><br />The emphasis is on preservation, context, and disciplined acquisition rather than transaction frequency or short-term outcomes.
                      </p>
                      <Link href="/blue-chip-art-fund" className="cta-primary" style={{textDecoration: 'none', width: 'fit-content', alignSelf: 'flex-start'}}>
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>

        {/* Decorative Bar - Above Stewardship */}
        <div className="w-full h-[36px] relative hidden lg:block">
          {/* Left portion - Gallery Plaster */}
          <div className="absolute left-0 top-0 h-full bg-gallery-plaster" style={{width: 'calc(60% - 32px)'}}></div>
          {/* Right portion - Ledger Stone */}
          <div className="absolute top-0 h-full bg-ledger-stone" style={{left: 'calc(60%)', right: '0'}}></div>
          {/* Dark green square at intersection */}
          <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{left: 'calc(60% - 32px)'}}></div>
        </div>

        {/* One Standard Across Mediums Section */}
        <section className="w-full py-12 sm:py-16 lg:py-24" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-0">
              {/* Image Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                <button
                  onClick={() => openModal(mediumsImage)}
                  className="mediums-image-button"
                  aria-label="View full-size image of One Standard Across Mediums artwork"
                >
                  <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F3005d3c962884059afa2392e3cdd27a7?format=webp&width=800"
                      alt="Contemporary artwork representing cultural significance across mediums"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 482px"
                    />
                  </div>
                </button>
              </div>

              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center pt-8 sm:pt-12 lg:pt-0">
                <div className="max-w-[579px]">
                  <h2 className="one-standard-title">
                    One Standard Across Mediums
                  </h2>
                  <h3 className="one-standard-subtitle">
                    Cultural Significance Is Medium Agnostic
                  </h3>
                  <p className="one-standard-description">
                    Whether a work exists on canvas or on chain, our standards do not change. Cultural relevance, provenance, context, and stewardship guide our decisions, not the medium itself.<br /><br />By applying the same governance framework across traditional and digital art, we aim to normalize contemporary forms of expression within an institutional and culturally legitimate context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Art and Artists Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-[138px]">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:pl-[115px] lg:pr-0 flex items-center">
                <div className="max-w-[579px]">
                  <h2 className="art-artists-title">
                    Art and Artists
                  </h2>
                  <h3 className="art-artists-subtitle">
                    The Works We Steward
                  </h3>
                  <p className="art-artists-description">
                    AIGT stewards a curated collection of culturally significant works, selected for their artistic relevance, historical importance, and long-term cultural contribution.<br /><br />In addition to fund held works, we also support the placement and stewardship of select individual artworks through private acquisition. These works are approached with the same care, discretion, and contextual consideration.<br /><br />Art is never treated as inventory. Each work is considered within its broader cultural and curatorial narrative.
                  </p>
                </div>
              </div>

              {/* Image Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                <button
                  onClick={() => openModal(artArtistsImage)}
                  className="art-artists-image-button"
                  aria-label="View full-size image of Art and Artists artwork"
                >
                  <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F191d1f3757b744a3bb4c98c59bd49eba?format=webp&width=800"
                      alt="Contemporary artwork representing artistic stewardship"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 482px"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stewardship in Practice Section */}
        <section id="stewardship-in-practice" className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20">
              <h2 className="stewardship-practice-title">
                Stewardship in Practice
              </h2>
              <p className="stewardship-practice-description">
                Structured governance and a long horizon perspective ensure each work is protected, contextualized, and allowed to mature culturally over time.
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-[1280px] mx-auto">
              {/* Governance and Care Card */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Governance and Care</h3>
                  <h4 className="practice-card-subtitle">Responsibility Requires Structure</h4>
                  <p className="practice-card-description">
                    Stewardship without governance is fragile. Art Investment Trust Group operates with centralized oversight, clear separation between economic participation and control, and institutional standards for custody, insurance, conservation, and compliance.<br /><br />The governance framework exists to protect the artwork first, ensuring decisions are made with long term cultural responsibility rather than short term incentives.
                  </p>
                </div>
              </div>

              {/* Perspective Card */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Perspective</h3>
                  <h4 className="practice-card-subtitle">Art Requires Time</h4>
                  <p className="practice-card-description">
                    The value of important art unfolds over years, not quarters. Cultural relevance is shaped through context, exhibition, scholarship, and preservation.<br /><br />The structures are designed to reflect this reality. Outcomes are not rushed, liquidity is not forced, and art is not framed through performance metrics. Time is allowed to do its work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-9 sm:py-12 lg:py-18" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20 max-w-[995px] mx-auto">
              <h2 className="section-heading text-center">
                Art Investment and Stewardship FAQs
              </h2>
            </div>

            {/* FAQ Accordion Items */}
            <div className="max-w-[900px] mx-auto space-y-4 lg:space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full text-left p-6 lg:p-8 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                    aria-expanded={expandedFAQ === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="governance-subtitle m-0">
                      {item.question}
                    </h3>
                    <svg
                      className={`flex-shrink-0 w-6 h-6 text-archive-slate transition-transform duration-300 mt-1 ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {expandedFAQ === index && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 lg:px-8 pt-6 lg:pt-8 pb-6 lg:pb-8 border-t border-gallery-plaster"
                    >
                      <p className="governance-description">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
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
    </div>
  );
}
