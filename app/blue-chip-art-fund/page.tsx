'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useArtworks } from "@/app/hooks/useArtworks";
import type { Artwork } from "@/app/lib/api";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { slugify } from "@/app/lib/slug";

interface ArtworkItem {
  id: string;
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const mapArtworkToItem = (artwork: Artwork): ArtworkItem => ({
  id: artwork.artwork_id.toString(),
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

export default function BlueChipArtFundPage() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroArtwork, setHeroArtwork] = useState<ArtworkItem | null>(null);
  const [focusArtwork, setFocusArtwork] = useState<ArtworkItem | null>(null);
  const { artworks } = useArtworks({ versions: "v02", limit: 60 });

  const featuredWorks = useMemo(() => {
    return artworks
      .filter((artwork) => !artwork.title.toLowerCase().includes("untitled"))
      .map(mapArtworkToItem);
  }, [artworks]);

  // Select random hero artworks on page load (changes only on refresh)
  // Cycles through all collections before repeating
  useEffect(() => {
    if (featuredWorks.length === 0) return;

    const ARTWORK_HISTORY_SIZE = 7;
    const COLLECTIONS_KEY = 'blue_chip_collections';
    const ARTWORK_HISTORY_KEY = 'blue_chip_artwork_history';

    // Group artworks by collection
    const collectionMap = new Map<string, ArtworkItem[]>();
    featuredWorks.forEach((artwork) => {
      const collection = artwork.collection || 'unknown';
      if (!collectionMap.has(collection)) {
        collectionMap.set(collection, []);
      }
      collectionMap.get(collection)!.push(artwork);
    });

    const collections = Array.from(collectionMap.keys());
    if (collections.length === 0) return;

    // Get artwork history to avoid repeating same artwork within 6-8 refreshes
    let artworkHistory: string[] = [];
    try {
      const stored = window.sessionStorage.getItem(ARTWORK_HISTORY_KEY);
      if (stored) artworkHistory = JSON.parse(stored);
    } catch {
      // Ignore errors
    }

    // Get shown collections from sessionStorage
    let shownCollections: string[] = [];
    try {
      const stored = window.sessionStorage.getItem(COLLECTIONS_KEY);
      if (stored) {
        shownCollections = JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }

    // Find collections that haven't been shown yet
    const availableCollections = collections.filter(c => !shownCollections.includes(c));

    // If all collections have been shown, reset
    const collectionsToUse = availableCollections.length > 0 ? availableCollections : collections;

    // Pick two different collections if possible
    const selectedCollection1 = collectionsToUse[Math.floor(Math.random() * collectionsToUse.length)];
    const remainingCollections = collectionsToUse.filter(c => c !== selectedCollection1);
    const selectedCollection2 = remainingCollections.length > 0
      ? remainingCollections[Math.floor(Math.random() * remainingCollections.length)]
      : selectedCollection1;

    const artworksInCollection1 = collectionMap.get(selectedCollection1)!;
    const artworksInCollection2 = collectionMap.get(selectedCollection2)!;

    // Filter out artworks that were recently shown from both collections
    const freshArtworks1 = artworksInCollection1.filter((a) => !artworkHistory.includes(a.id));
    const artworkPool1 = freshArtworks1.length > 0 ? freshArtworks1 : artworksInCollection1;

    const freshArtworks2 = artworksInCollection2.filter((a) => !artworkHistory.includes(a.id));
    const artworkPool2 = freshArtworks2.length > 0 ? freshArtworks2 : artworksInCollection2;

    const hero = artworkPool1[Math.floor(Math.random() * artworkPool1.length)];
    const focus = artworkPool2[Math.floor(Math.random() * artworkPool2.length)];

    setHeroArtwork(hero);
    setFocusArtwork(focus);

    // Save both artworks and collections to history
    try {
      // Update artwork history (keep last 7)
      const newHistory = [
        ...artworkHistory.filter((id) => id !== hero.id && id !== focus.id),
        hero.id,
        focus.id
      ].slice(-ARTWORK_HISTORY_SIZE);
      window.sessionStorage.setItem(ARTWORK_HISTORY_KEY, JSON.stringify(newHistory));

      // Update collection history
      const collectionsToAdd: string[] = [];
      if (hero?.collection && !shownCollections.includes(hero.collection)) {
        collectionsToAdd.push(hero.collection);
      }
      if (focus?.collection && !shownCollections.includes(focus.collection)) {
        collectionsToAdd.push(focus.collection);
      }

      const newShownCollections = [...shownCollections, ...collectionsToAdd];

      // Reset collection history if all collections have been shown
      const finalCollections =
        newShownCollections.length >= collections.length ? [] : newShownCollections;

      window.sessionStorage.setItem(COLLECTIONS_KEY, JSON.stringify(finalCollections));
    } catch {
      // Ignore errors
    }
  }, [featuredWorks]);

  const heroArtworkHref = heroArtwork ? getArtworkHref(heroArtwork) : null;
  const focusArtworkHref = focusArtwork ? getArtworkHref(focusArtwork) : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest("button")) return;

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

  const handleMouseUp = () => setIsDragging(false);

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

  const handleTouchEnd = () => setIsDragging(false);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = 350;
    const newScrollLeft =
      direction === "left"
        ? sliderRef.current.scrollLeft - scrollAmount
        : sliderRef.current.scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const openModal = (artwork: ArtworkItem) => {
    setSelectedImage(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (!isModalOpen) return;

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center py-12 lg:py-0">
                <div className="max-w-[711px] w-full">
                  <h1 style={{ marginBottom: "17px", textAlign: "left" }}>
                    Blue Chip Art Fund
                  </h1>

                  <div className="hero-subtitle" style={{ textAlign: "left" }}>
                    <p>Long-Term Stewardship of Historically Significant Works</p>
                  </div>

                  <div style={{ textAlign: "left", marginTop: "24px" }}>
                    <p>
                      The Blue Chip Art Fund is a governed platform established to acquire, hold, and steward culturally and
                      historically significant artworks within a long-duration ownership framework.
                    </p>
                    <p style={{ marginTop: "16px" }}>
                      Operating within the Art Investment Group Trust structure, the fund prioritizes preservation, provenance
                      integrity, and continuity over liquidity or short-term market dynamics.
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
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none"
              style={{ top: 0, height: "calc(100% - 242px)" }}
            />
            <div
              className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none"
              style={{ top: "calc(100% - 242px)", height: "242px" }}
            />
          </div>
        </section>

        {/* Design Bar */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{ width: "calc(50vw + 112px)" }} />
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(50vw + 105px)", right: 0 }} />
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }} />
          </div>
        </div>

        {/* Two Column Content Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Left Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
                <div className="max-w-[579px]">
                  <h2 className="governance-title" style={{ marginBottom: "24px" }}>
                    Institutional Stewardship for Established Art
                  </h2>
                  <p className="governance-description">
                    The Blue Chip Art Fund is designed for artworks with established cultural significance and enduring historical
                    relevance.
                  </p>
                  <p className="governance-description">
                    The fund applies institutional governance, professional custody standards, and long-horizon ownership to works
                    that warrant preservation across generations rather than participation in evolving market structures.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="px-4 sm:px-8 lg:p-[80px_40px]" style={{ backgroundColor: "#f5f5f5" }}>
                <h3 className="governance-title" style={{ marginBottom: "24px", fontSize: "28px", lineHeight: "36px" }}>
                  Preservation-First Stewardship
                </h3>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Prioritizing long-duration ownership over liquidity
                </p>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Maintaining museum-quality custody and care standards
                </p>
                <p className="governance-description" style={{ marginBottom: "16px" }}>
                  Preserving provenance, context, and historical integrity
                </p>
                <p className="governance-description">Minimizing turnover to support long-term cultural value</p>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">A Distinct Mandate</h2>
              <p className="governance-subtitle text-center max-w-[735px]">
                The Blue Chip Art Fund is differentiated by its preservation-first mandate and long-term ownership horizon.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The Blue Chip Art Fund operates with the explicit objective of long-term stewardship. It prioritizes permanence,
                stability, and cultural continuity over liquidity or market responsiveness.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                Acquisitions are made with the expectation of extended holding periods, limited turnover, and careful custodial
                management designed to preserve both physical condition and historical context.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Long-Horizon Ownership</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Preservation-First Stewardship</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Selective and Infrequent Acquisition</h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">Institutional Custody and Care</h3>
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
                <div className="relative w-full max-w-[417px] aspect-square overflow-hidden">
                  {focusArtwork?.src ? (
                    focusArtworkHref ? (
                      <Link
                        href={focusArtworkHref}
                        aria-label={`View details for ${focusArtwork.title}`}
                        className="block w-full h-full"
                      >
                        <ProgressiveImage
                          src={focusArtwork.src}
                          alt={focusArtwork.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 417px"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full">
                        <ProgressiveImage
                          src={focusArtwork.src}
                          alt={focusArtwork.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 417px"
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

              {/* Right: Content */}
              <div className="max-w-[579px] w-full lg:pl-0">
                <h2 className="governance-title" style={{ marginBottom: "24px" }}>
                  Curatorial and Acquisition Focus
                </h2>
                <p className="governance-description">
                  The Blue Chip Art Fund is focused on the acquisition and long-term stewardship of artworks with established
                  cultural, historical, and institutional significance.
                </p>
                <p className="governance-description">
                  Works are selected based on enduring relevance, provenance integrity, and suitability for extended custodial care.
                  The fund prioritizes pieces that have demonstrated lasting influence within art history rather than short-term
                  market momentum.
                </p>
                <p className="governance-description">
                  Acquisition activity remains selective and deliberate, with an emphasis on quality, context, and preservation over
                  volume.
                </p>
                <p className="governance-description">Areas of focus to include:</p>
                <ul className="governance-description" style={{ paddingLeft: "20px", listStyle: "disc", marginTop: "8px" }}>
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
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">How the Blue Chip Art Fund Operates</h2>
              <p className="governance-subtitle text-center max-w-[817px]">
                An overview of stewardship priorities, acquisition discipline, and long-term custodial care.
              </p>
              <p className="governance-description text-center max-w-[995px]">
                The Blue Chip Art Fund operates through selective acquisition, long-duration ownership, institutional custody
                standards, and governance designed to minimize turnover while preserving cultural value.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Long-Term Ownership</h3>
                  <p className="practice-card-description">
                    The fund is designed for extended holding periods, with no expectation of short-term liquidity.
                  </p>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Lower Risk Profile</h3>
                  <p className="practice-card-description">
                    By focusing on historically established works, the fund emphasizes stability over market volatility.
                  </p>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Selective Acquisition</h3>
                  <p className="practice-card-description">
                    Growth occurs infrequently and only when works meet strict cultural and custodial criteria.
                  </p>
                </div>
              </div>

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
            <h2 className="governance-title" style={{ marginBottom: "16px" }}>
              Participation and Alignment
            </h2>
            <p className="governance-description max-w-[1038px]" style={{ marginBottom: "48px" }}>
              Participation in the Blue Chip Art Fund is designed for those aligned with long-term stewardship and
              preservation-first ownership.
            </p>

            <div className="flex flex-col gap-6">
              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  For Long-Term Stewards
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  Participation in the Blue Chip Art Fund is designed for individuals and institutions aligned with long-duration
                  ownership and cultural stewardship.
                </p>
                <p className="stewardship-card-description">
                  The fund is intended for those who value continuity, preservation, and measured decision-making over short-term
                  market responsiveness.
                </p>
              </div>

              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  Preservation, Not Liquidity
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  The Blue Chip Art Fund is not structured to prioritize liquidity, frequent transactions, or short-term price
                  discovery.
                </p>
                <p className="stewardship-card-description">
                  Acquisitions are made with the expectation of extended holding periods, minimal turnover, and stewardship
                  practices designed to preserve artistic, historical, and cultural integrity across generations.
                </p>
              </div>

              <div
                className="stewardship-card"
                style={{
                  padding: "40px",
                  width: "100%",
                  maxWidth: "1199px",
                  minHeight: "auto",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 0,
                }}
              >
                <h3 className="stewardship-card-title" style={{ textAlign: "left", width: "100%" }}>
                  Deliberate Engagement
                </h3>
                <p className="stewardship-card-description" style={{ marginTop: "16px" }}>
                  Art Investment Group Trust engages prospective participants through direct, considered discussion.
                </p>
                <p className="stewardship-card-description">
                  Participation begins with alignment around intent, stewardship philosophy, and long-term commitment rather than
                  transaction-driven timelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Private Conversations Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              <div className="text-center flex flex-col items-center gap-4">
                <h3 className="text-center">Private Conversations</h3>
                <p className="text-center max-w-[789px] mx-auto">
                  Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct,
                  considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not
                  transactions.
                </p>
                <p className="text-center max-w-[789px] mx-auto">
                  These conversations are exploratory by design. They allow space to discuss long-term intent, governance
                  alignment, and the role each participant seeks to play in preserving cultural value across generations.
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/request-access"
                  className="footer-cta-primary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
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
            <button className="image-modal-close" onClick={closeModal} aria-label="Close image viewer">
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="image-modal-image-container">
              <ProtectedImage src={selectedImage.src} alt={selectedImage.title} fill className="object-contain" sizes="90vw" />
            </div>

            <div className="image-modal-info">
              <h2 className="image-modal-title">{selectedImage.title}</h2>
              <p className="image-modal-artist">
                {selectedImage.artist}, {selectedImage.year}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
