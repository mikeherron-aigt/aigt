"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

const extractCollectionFromSku = (sku: string): string | null => {
  const match = sku.match(/^\d{4}-[A-Z]+-([A-Z]+)-\d+$/);
  return match ? match[1] : null;
};

type HeroImageProps = {
  images: string[];
  links?: (string | null)[];
  skus: string[];
  className?: string;
  alt?: string;
};

const heroAltText = "Cultural artwork representing the trust's collection";

export function HeroImage({
  images,
  links,
  skus,
  className = "",
  alt = heroAltText,
}: HeroImageProps) {
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

  // Pick a random image after mount to avoid SSR hydration mismatches.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (normalizedItems.length === 0) return;

    let recentHistory: string[] = [];
    try {
      const stored = window.sessionStorage.getItem("hero_history");
      if (stored) recentHistory = JSON.parse(stored);
    } catch {
      // Ignore storage errors
    }

    const previousCollection =
      recentHistory.length > 0 ? extractCollectionFromSku(recentHistory[0]) : null;

    const availableIndices: number[] = [];
    skus.forEach((sku, index) => {
      if (index < normalizedItems.length) {
        if (recentHistory.includes(sku)) return;
        const collection = extractCollectionFromSku(sku);
        if (collection && collection === previousCollection) return;
        availableIndices.push(index);
      }
    });

    const indicesToUse =
      availableIndices.length > 0
        ? availableIndices
        : skus
            .map((sku, index) => {
              if (recentHistory.length > 0 && sku === recentHistory[0]) return -1;
              return index < normalizedItems.length ? index : -1;
            })
            .filter((i) => i >= 0);

    const picked =
      indicesToUse.length > 0
        ? indicesToUse[Math.floor(Math.random() * indicesToUse.length)]
        : 0;

    setSelectedIndex(picked);

    if (picked < skus.length) {
      try {
        const selectedSku = skus[picked];
        if (recentHistory[0] !== selectedSku) {
          const updatedHistory = [selectedSku, ...recentHistory].slice(0, 6);
          window.sessionStorage.setItem("hero_history", JSON.stringify(updatedHistory));
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [normalizedItems.length, skus]);

  if (normalizedItems.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gallery-plaster" />
      </div>
    );
  }

  if (selectedIndex === null) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gallery-plaster" />
      </div>
    );
  }

  const item = normalizedItems[selectedIndex] ?? normalizedItems[0];
  const image = (
    <ProtectedImage
      src={item.src}
      alt={alt}
      fill
      className="object-cover object-center"
      priority
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gallery-plaster" />
      {item.href ? (
        <Link
          href={item.href}
          aria-label={`View details for ${alt}`}
          className="absolute inset-0"
        >
          {image}
        </Link>
      ) : (
        <div className="absolute inset-0">{image}</div>
      )}
    </div>
  );
}
