'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    year: "Contemporary",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0b223e89165544369065645eb9e01981?format=webp&width=800",
    title: "80s Series #25",
    artist: "John Dowling Jr.",
    year: "Contemporary",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F412947b95d6b487f8e94d9db43269338?format=webp&width=800",
    title: "80s Series #14",
    artist: "John Dowling Jr.",
    year: "Contemporary",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F41a3331c307447f9a770facf2b3f3f7b?format=webp&width=800",
    title: "80s Series #53",
    artist: "John Dowling Jr.",
    year: "Contemporary",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F08edb5409851472b964e3c762012ec12?format=webp&width=800",
    title: "80s Series #38",
    artist: "John Dowling Jr.",
    year: "Contemporary",
  },
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

        {/* ...everything else unchanged... */}

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
              <Image src={selectedImage.src} alt={selectedImage.title} fill className="object-contain" sizes="90vw" />
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
