"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { slugify } from "@/app/lib/slug";

export interface ArtworkItem {
  src: string;
  title: string;
  artist: string;
  year: string;
  collection?: string;
}

function getArtworkHref(artwork: { title: string; collection?: string }): string | null {
  if (!artwork.collection) return null;
  return `/collections/${slugify(artwork.collection)}/${slugify(artwork.title)}`;
}

type FeaturedCollectionSliderProps = {
  artworks: ArtworkItem[];
};

export function FeaturedCollectionSlider({ artworks }: FeaturedCollectionSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Double the items so right-scrolling loops infinitely
  const tripled = [...artworks, ...artworks];

  // On mount, start at the beginning (left edge)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollLeft = 0;
  }, [artworks.length]);

  // Silently jump back when approaching the end of the first set
  const handleScroll = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const oneSetWidth = slider.scrollWidth / 2;
    if (slider.scrollLeft >= oneSetWidth) {
      slider.scrollLeft -= oneSetWidth;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
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
    if ((e.target as HTMLElement).closest("a")) return;
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
    sliderRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  if (artworks.length === 0) {
    return (
      <div className="slider-wrapper">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <p className="governance-description">No artworks available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="slider-wrapper">
        <div className="slider-container">
          <div
            ref={sliderRef}
            className="artwork-slider"
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
          >
            {tripled.map((artwork, index) => {
              const artworkHref = getArtworkHref(artwork);
              const isCopy = index < artworks.length || index >= artworks.length * 2;

              const imageContent = (
                <div className="artwork-image-wrapper">
                  {artwork.src ? (
                    <ProgressiveImage
                      src={artwork.src}
                      alt={artwork.title}
                      fill
                      eager={index < 3}
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: "var(--gallery-plaster)" }}
                    />
                  )}
                </div>
              );

              return (
                <div
                  key={`${artwork.title}-${index}`}
                  className="artwork-card"
                  aria-hidden={isCopy ? "true" : undefined}
                >
                  {artworkHref ? (
                    <Link
                      href={artworkHref}
                      className="artwork-card-button"
                      aria-label={`View details for ${artwork.title}`}
                      tabIndex={isCopy ? -1 : undefined}
                    >
                      {imageContent}
                    </Link>
                  ) : (
                    <div className="artwork-card-button">{imageContent}</div>
                  )}
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
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] flex justify-center items-center gap-6 mt-12">
        <button
          onClick={() => scrollSlider("left")}
          className="slider-nav-arrow slider-nav-arrow-left"
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={() => scrollSlider("right")}
          className="slider-nav-arrow slider-nav-arrow-right"
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </>
  );
}
