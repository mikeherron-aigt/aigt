'use client';

import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect, useMemo, useCallback, type CSSProperties } from "react";
import { useArtworks } from "@/app/hooks/useArtworks";
import { getArtworkBySku, type Artwork } from "@/app/lib/api";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";
import { slugify } from "@/app/lib/slug";


interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

const HERO_SKUS = [
  "2025-JD-DW-0007",
  "2024-JD-MM-0009",
  "2025-JD-DW-0008",
  "2025-JD-CD-0347",
  "2024-JD-AG-0020",
];
const GOVERNANCE_SKU = "2025-JD-DW-0019";
const MEDIUMS_SKU = "2024-JD-AG-0025";
const ART_ARTISTS_SKU = "2025-JD-CD-0361";

const mapArtworkToItem = (artwork: Artwork): ArtworkItem => ({
  src: artwork.image_url,
  title: artwork.title,
  artist: artwork.artist,
  year: artwork.year_created ? artwork.year_created.toString() : "",
  collection: artwork.collection_name,
});

const getArtworkHref = (artwork: { title: string; collection?: string; collection_name?: string }) => {
  const collectionName = artwork.collection ?? artwork.collection_name;
  if (!collectionName) return null;
  return `/collections/${slugify(collectionName)}/${slugify(artwork.title)}`;
};

type HeroImageRotatorProps = {
  images: string[];
  links?: (string | null)[];
  intervalMs?: number;
  transitionMs?: number;
  className?: string;
  alt?: string;
};

const heroAltText = "Cultural artwork representing the trust's collection";

function HeroImageRotator({
  images,
  links,
  intervalMs = 9000,
  transitionMs = 1200,
  className = "",
  alt = heroAltText,
}: HeroImageRotatorProps) {
  const normalizedItems = useMemo(
    () =>
      images
        .map((src, index) => {
          const normalized = normalizeArtworkImageUrl(src);
          if (!normalized) return null;
          return {
            src: normalized,
            href: links?.[index] ?? null,
          };
        })
        .filter((item): item is { src: string; href: string | null } => Boolean(item?.src)),
    [images, links]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const loadStatusRef = useRef(new Map<string, "loaded" | "failed">());
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);

  const preload = useCallback(
    (index: number) =>
      new Promise<void>((resolve) => {
        const src = normalizedItems[index]?.src;
        if (!src) {
          resolve();
          return;
        }

        const status = loadStatusRef.current.get(src);
        if (status === "loaded" || status === "failed") {
          resolve();
          return;
        }

        let settled = false;
        const finalize = (nextStatus: "loaded" | "failed") => {
          if (settled) return;
          settled = true;
          loadStatusRef.current.set(src, nextStatus);
          resolve();
        };

        const img = new Image();
        img.onload = () => finalize("loaded");
        img.onerror = () => finalize("failed");
        img.src = src;

        if ("decode" in img) {
          img.decode().then(
            () => finalize("loaded"),
            () => finalize("failed")
          );
        }
      }),
    [normalizedItems]
  );

  useEffect(() => {
    isMountedRef.current = true;
    setActiveIndex(0);
    setIsReady(false);

    if (intervalRef.current) window.clearTimeout(intervalRef.current);

    if (normalizedItems.length === 0) {
      return () => {
        isMountedRef.current = false;
      };
    }

    const scheduleNext = (currentIndex: number) => {
      if (!isMountedRef.current || normalizedItems.length <= 1) return;

      intervalRef.current = window.setTimeout(async () => {
        const nextIndex = (currentIndex + 1) % normalizedItems.length;
        await preload(nextIndex);
        if (!isMountedRef.current) return;
        setActiveIndex(nextIndex);
        scheduleNext(nextIndex);
      }, intervalMs);
    };

    const start = async () => {
      await preload(0);
      if (!isMountedRef.current) return;
      setIsReady(true);
      if (normalizedItems.length > 1) {
        scheduleNext(0);
      }
    };

    start();

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) window.clearTimeout(intervalRef.current);
    };
  }, [normalizedItems, intervalMs, preload]);

  if (normalizedItems.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gallery-plaster" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gallery-plaster" />
      {normalizedItems.map((item, index) => {
        const wrapperStyle: CSSProperties = {
          opacity: index === activeIndex ? 1 : 0,
          transition: `opacity ${transitionMs}ms ease-in-out`,
          zIndex: index === activeIndex ? 2 : 1,
          willChange: "opacity",
          pointerEvents: index === activeIndex ? "auto" : "none",
        };

        const image = (
          <ProtectedImage
            src={item.src}
            alt={alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        );

        return item.href ? (
          <Link
            key={`${item.src}-${index}`}
            href={item.href}
            aria-label={`View details for ${alt}`}
            className="absolute inset-0"
            style={wrapperStyle}
          >
            {image}
          </Link>
        ) : (
          <div
            key={`${item.src}-${index}`}
            className="absolute inset-0"
            style={wrapperStyle}
          >
            {image}
          </div>
        );
      })}
      {!isReady && (
        <div className="absolute inset-0 bg-gallery-plaster" />
      )}
    </div>
  );
}

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const { artworks, loading: artworksLoading, error: artworksError, refetch: refetchArtworks } = useArtworks(
    {
      version: "v02",
    }
  );
  const [backupArtworks, setBackupArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = window.localStorage.getItem("aigt_artwork_backup_v02");
      if (cached) {
        setBackupArtworks(JSON.parse(cached));
      }
    } catch {
      setBackupArtworks([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (artworks.length > 0) {
      try {
        window.localStorage.setItem(
          "aigt_artwork_backup_v02",
          JSON.stringify(artworks)
        );
      } catch {
        // Ignore storage failures.
      }
    }
  }, [artworks]);

  const isValidTitle = (title: string) =>
    !title.toLowerCase().includes("untitled");
  const validArtworks = artworks.filter((artwork) => isValidTitle(artwork.title));
  const backupFiltered = backupArtworks.filter((artwork) =>
    isValidTitle(artwork.title)
  );
  const sourceArtworks = validArtworks.length > 0 ? validArtworks : backupFiltered;

  // Shuffle function using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    // Simple seeded random number generator
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(seededRandom() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    return shuffled;
  };

  // Use a seed based on the current date so it changes daily but is consistent within a session
  const dailySeed = useMemo(() => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }, []);

  // Shuffle source artworks and then pick diverse collection representation
  const shuffledArtworks = useMemo(() => {
    if (sourceArtworks.length === 0) return [];
    return shuffleArray(sourceArtworks, dailySeed);
  }, [sourceArtworks, dailySeed]);

  // Pick one random artwork from each collection, then fill remaining slots
  const featuredArtworks = useMemo(() => {
    if (shuffledArtworks.length === 0) return [];

    const collectionMap = new Map<string, Artwork>();
    shuffledArtworks.forEach((artwork) => {
      if (!collectionMap.has(artwork.collection_name)) {
        collectionMap.set(artwork.collection_name, artwork);
      }
    });

    const uniqueByCollection = Array.from(collectionMap.values());
    const remaining = shuffledArtworks.filter((artwork) => {
      const firstForCollection = collectionMap.get(artwork.collection_name);
      return firstForCollection && firstForCollection.artwork_id !== artwork.artwork_id;
    });

    // Combine unique collection picks with shuffled remaining
    const combined = [...uniqueByCollection, ...remaining];
    return combined.slice(0, 12).map(mapArtworkToItem);
  }, [shuffledArtworks]);

  const [heroArtworks, setHeroArtworks] = useState<Artwork[]>([]);
  const [governanceArtwork, setGovernanceArtwork] = useState<Artwork | null>(null);
  const [mediumsArtwork, setMediumsArtwork] = useState<Artwork | null>(null);
  const [artArtistsArtwork, setArtArtistsArtwork] = useState<Artwork | null>(null);

  const modalArtworks = featuredArtworks;
  const governanceImage = governanceArtwork
    ? mapArtworkToItem(governanceArtwork)
    : undefined;
  const mediumsImage = mediumsArtwork
    ? mapArtworkToItem(mediumsArtwork)
    : undefined;
  const artArtistsImage = artArtistsArtwork
    ? mapArtworkToItem(artArtistsArtwork)
    : undefined;
  const governanceHref = governanceArtwork ? getArtworkHref(governanceArtwork) : null;
  const mediumsHref = mediumsArtwork ? getArtworkHref(mediumsArtwork) : null;
  const artArtistsHref = artArtistsArtwork ? getArtworkHref(artArtistsArtwork) : null;

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
    // Don't start dragging if clicking on interactive elements
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
    if (!artwork.src) return;
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
    const resolveSkus = async () => {
      try {
        const [heroList, governance, mediums, artArtists] = await Promise.all([
          HERO_SKUS.length > 0
            ? Promise.all(HERO_SKUS.map((sku) => getArtworkBySku(sku)))
            : Promise.resolve([]),
          GOVERNANCE_SKU ? getArtworkBySku(GOVERNANCE_SKU) : Promise.resolve(null),
          MEDIUMS_SKU ? getArtworkBySku(MEDIUMS_SKU) : Promise.resolve(null),
          ART_ARTISTS_SKU ? getArtworkBySku(ART_ARTISTS_SKU) : Promise.resolve(null),
        ]);

        setHeroArtworks(
          heroList.filter((item): item is Artwork => Boolean(item))
        );
        setGovernanceArtwork(governance);
        setMediumsArtwork(mediums);
        setArtArtistsArtwork(artArtists);
      } catch {
        setHeroArtworks([]);
        setGovernanceArtwork(null);
        setMediumsArtwork(null);
        setArtArtistsArtwork(null);
      }
    };

    resolveSkus();
  }, []);

  // Compute the hero image list
  const heroImageList = useMemo(() => {
    const heroSources = heroArtworks.map((artwork) => artwork.image_url);
    return heroSources.length > 0 ? heroSources : [];
  }, [heroArtworks]);

  const heroImageLinks = useMemo(
    () => heroArtworks.map((artwork) => getArtworkHref(artwork)),
    [heroArtworks]
  );

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
  

      {/* Hero Section */}
      <main>
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
              <div className="max-w-[637px]">
                {/* Heading */}
                <h1 style={{marginBottom: '17px'}}>
                  The Art That Matters<br />The Stewardship It Deserves
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
            <HeroImageRotator
              images={heroImageList}
              links={heroImageLinks}
              intervalMs={7000}
              transitionMs={1200}
              className="h-[400px] sm:h-[500px] lg:h-[680px] bg-gallery-plaster"
            />
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
                  <h2>
                    Art Investment, Structured for the Long Term
                  </h2>
                  <p>
                    Art Investment Group Trust is a governed art investment platform focused on the acquisition, stewardship, and long term ownership of museum quality and culturally significant artworks for qualified participants.
                  </p>
                  <p>
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
        <section className="w-full bg-white pt-0 pb-16 sm:pb-20 lg:pb-[104px] featured-collection-section">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2>
              Featured Collection
            </h2>
          </div>

          {artworksLoading ? (
            <div className="slider-wrapper">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
                <p className="governance-description">Loading artworks...</p>
              </div>
            </div>
          ) : artworksError ? (
            <div className="slider-wrapper">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
                <p className="governance-description">{artworksError}</p>
                <button className="cta-secondary" type="button" onClick={refetchArtworks}>
                  Try Again
                </button>
              </div>
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="slider-wrapper">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
                <p className="governance-description">No artworks available at this time.</p>
              </div>
            </div>
          ) : (
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
                  {[...featuredArtworks, ...featuredArtworks].map((artwork, index) => (
                    <div key={`${artwork.title}-${index}`} className="artwork-card">
                      {(() => {
                        const artworkHref = getArtworkHref(artwork);
                        const imageContent = (
                          <div className="artwork-image-wrapper">
                            {artwork.src ? (
                              <ProgressiveImage
                                src={artwork.src}
                                alt={artwork.title}
                                fill
                                eager={index < 3}
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{ backgroundColor: "var(--gallery-plaster)" }}
                              />
                            )}
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
                        <h3 className="artwork-title">{artwork.title}</h3>
                        <p className="artwork-details">
                          {artwork.artist}
                          {artwork.collection ? (
                            <>
                              <br />
                              {artwork.collection}
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!artworksLoading && !artworksError && featuredArtworks.length > 0 && (
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
          )}
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
                    <h2>
                      Our Purpose
                    </h2>
                    <p>
                      Art carries cultural weight long before it carries financial value. When important works are treated primarily as assets, their context, integrity, and long-term significance are often compromised.<br /><br />Art Investment Group Trust exists to address this imbalance. We provide structures designed to protect cultural importance, resist short-term pressures, and ensure that significant works are held with intention, care, and institutional discipline.<br /><br />This philosophy guides every acquisition, every governance decision, and every relationship we enter.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider-line my-12 lg:my-16"></div>

                <div className="max-w-[579px]">
                  {/* Our Approach */}
                  <div>
                    <h2>
                      Stewardship Before Everything
                    </h2>
                    <p>
                      We approach art through the lens of stewardship rather than speculation. That means prioritizing long-horizon ownership, rigorous governance, and responsible custody over velocity or volume.<br /><br />Our structures are intentionally designed to slow the process, encourage patience, and align participants around preservation, context, and care. Liquidity is episodic. Cultural responsibility is continuous.<br /><br />This approach applies equally across all mediums.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative w-full h-full overflow-hidden min-h-[900px]">
                {governanceImage?.src ? (
                  governanceHref ? (
                    <Link
                      href={governanceHref}
                      className="governance-image-button"
                      aria-label={`View details for ${governanceImage.title}`}
                    >
                      <div className="absolute inset-0">
                        <ProtectedImage
                          src={governanceImage.src}
                          alt={governanceImage.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="governance-image-button">
                      <div className="absolute inset-0">
                        <ProtectedImage
                          src={governanceImage.src}
                          alt={governanceImage.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
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
        </section>

        {/* Two Funds Section */}
        <section id="investment-offerings" className="w-full bg-white py-12 sm:py-16 lg:py-24" style={{scrollMarginTop: '-100px'}}>
          <div className="max-w-[1441px] mx-auto">
            <div className="flex flex-col items-center gap-12">
              {/* Top Content */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col items-center gap-4 max-w-full">
                <div className="flex flex-col items-center gap-4 max-w-[995px]">
                  <h2 className="text-center">
                    Investment Offerings
                  </h2>
                  <h3 className="text-center">
                    Distinct Platforms.  One Philosophy
                  </h3>
                  <p className="text-center">
                    Art Investment Group Trust operates multiple governed platforms, each designed to support different forms of cultural expression while adhering to the same standards of stewardship and oversight.
                  </p>
                </div>
              </div>

              {/* Fund Cards */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-[34px] w-full">
                  {/* Ethereum Art Fund Card */}
                  <div className="fund-card">
                    <div className="fund-card-content">
                      <h3>Ethereum Art Fund</h3>
                      <p>
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
                      <h3>Blue Chip Art Fund</h3>
                      <p>
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
                {mediumsImage?.src ? (
                  mediumsHref ? (
                    <Link
                      href={mediumsHref}
                      className="mediums-image-button"
                      aria-label={`View details for ${mediumsImage.title}`}
                    >
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                        <ProtectedImage
                          src={mediumsImage.src}
                          alt={mediumsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="mediums-image-button">
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                        <ProtectedImage
                          src={mediumsImage.src}
                          alt={mediumsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: "var(--gallery-plaster)" }}
                  />
                )}
              </div>

              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center pt-8 sm:pt-12 lg:pt-0">
                <div className="max-w-[579px]">
                  <h2>
                    One Standard Across Mediums
                  </h2>
                  <h3>
                    Cultural Significance Is Medium Agnostic
                  </h3>
                  <p>
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
                  <h2>
                    Art and Artists
                  </h2>
                  <h3>
                    The Works We Steward
                  </h3>
                  <p>
                    AIGT stewards a curated collection of culturally significant works, selected for their artistic relevance, historical importance, and long-term cultural contribution.<br /><br />In addition to fund held works, we also support the placement and stewardship of select individual artworks through private acquisition. These works are approached with the same care, discretion, and contextual consideration.<br /><br />Art is never treated as inventory. Each work is considered within its broader cultural and curatorial narrative.
                  </p>
                </div>
              </div>

              {/* Image Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                {artArtistsImage?.src ? (
                  artArtistsHref ? (
                    <Link
                      href={artArtistsHref}
                      className="art-artists-image-button"
                      aria-label={`View details for ${artArtistsImage.title}`}
                    >
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                        <ProtectedImage
                          src={artArtistsImage.src}
                          alt={artArtistsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="art-artists-image-button">
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: '482 / 612' }}>
                        <ProtectedImage
                          src={artArtistsImage.src}
                          alt={artArtistsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
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
        </section>

        {/* Stewardship in Practice Section */}
        <section id="stewardship-in-practice" className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-center">
                Stewardship in Practice
              </h2>
              <p className="text-center max-w-[789px]">
                Structured governance and a long horizon perspective ensure each work is protected, contextualized, and allowed to mature culturally over time.
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-[1280px] mx-auto">
              {/* Governance and Care Card */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h2>Governance and Care</h2>
                  <h3>Responsibility Requires Structure</h3>
                  <p>
                    Stewardship without governance is fragile. Art Investment Trust Group operates with centralized oversight, clear separation between economic participation and control, and institutional standards for custody, insurance, conservation, and compliance.<br /><br />The governance framework exists to protect the artwork first, ensuring decisions are made with long term cultural responsibility rather than short term incentives.
                  </p>
                </div>
              </div>

              {/* Perspective Card */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h2>Perspective</h2>
                  <h3>Art Requires Time</h3>
                  <p>
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
              <h2 className="text-center">
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
                    <h3 className="m-0">
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
                      <p>
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
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              {/* Private Conversations Section */}
              <div className="text-center flex flex-col items-center">
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