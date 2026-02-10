"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProtectedImage } from "@/app/components/ProtectedImage";

interface HeroImageCarouselProps {
  images: string[];
  intervalMs?: number;
  transitionMs?: number;
  className?: string;
}

export function HeroImageCarousel({
  images,
  intervalMs = 6000,
  transitionMs = 1000,
  className = "",
}: HeroImageCarouselProps) {
  // Filter out empty/invalid images
  const validImages = images.filter((img) => img && img.length > 0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [preloadedIndices, setPreloadedIndices] = useState<Set<number>>(
    new Set([0])
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload an image and track when it's loaded
  const preloadImage = (index: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!validImages[index]) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => {
        setPreloadedIndices((prev) => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });
        resolve();
      };
      img.onerror = () => resolve();
      img.src = validImages[index];
    });
  };

  // Preload first two images on mount
  useEffect(() => {
    if (validImages.length > 0) {
      preloadImage(0);
    }
    if (validImages.length > 1) {
      preloadImage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validImages.length]);

  // Set up the cycling interval
  useEffect(() => {
    if (validImages.length <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(async () => {
        const nextIndex = (prevIndex: number) =>
          (prevIndex + 1) % validImages.length;

        setActiveIndex((prev) => {
          const next = nextIndex(prev);
          // Preload the image after next
          const afterNext = (next + 1) % validImages.length;
          preloadImage(afterNext);
          return next;
        });
      }, intervalMs);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validImages.length, intervalMs]);

  // Handle empty state
  if (validImages.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gallery-plaster" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Render all images stacked, only active one is visible */}
      {validImages.map((src, index) => (
        <div
          key={`hero-image-${index}`}
          className="absolute inset-0"
          style={{
            opacity: index === activeIndex ? 1 : 0,
            transition: `opacity ${transitionMs}ms ease-in-out`,
            zIndex: index === activeIndex ? 2 : 1,
          }}
        >
          <ProtectedImage
            src={src}
            alt="Cultural artwork representing the trust's collection"
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
