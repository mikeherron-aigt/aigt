import { useState, useEffect } from 'react';
import type { HeroImageItem } from '@/app/lib/heroImageConfig';

interface UseStaticHeroImageOptions {
  images: HeroImageItem[];
  storageKey: string; // Unique key for each page (e.g., 'about_hero', 'eth_fund_hero')
  historySize?: number; // How many images to remember (default: 7)
}

/**
 * Hook to select a hero image with cycling logic that:
 * 1. Cycles through all images before repeating
 * 2. Avoids showing the same collection within 3-4 refreshes
 */
export function useStaticHeroImage({
  images,
  storageKey,
  historySize = 7,
}: UseStaticHeroImageOptions): string | null {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (images.length === 0) return;

    const COLLECTIONS_KEY = `${storageKey}_collections`;
    const IMAGE_HISTORY_KEY = `${storageKey}_image_history`;

    // Get image history to avoid repeating same image within historySize refreshes
    let imageHistory: string[] = [];
    try {
      const stored = window.sessionStorage.getItem(IMAGE_HISTORY_KEY);
      if (stored) imageHistory = JSON.parse(stored);
    } catch {
      // ignore
    }

    // Get shown collections to cycle through collections
    let shownCollections: string[] = [];
    try {
      const stored = window.sessionStorage.getItem(COLLECTIONS_KEY);
      if (stored) shownCollections = JSON.parse(stored);
    } catch {
      // ignore
    }

    // Group images by collection
    const collectionMap = new Map<string, HeroImageItem[]>();
    images.forEach((image) => {
      const collection = image.collection;
      if (!collectionMap.has(collection)) {
        collectionMap.set(collection, []);
      }
      collectionMap.get(collection)!.push(image);
    });

    const collections = Array.from(collectionMap.keys());
    if (collections.length === 0) return;

    // Find collections that haven't been shown yet
    const availableCollections = collections.filter((c) => !shownCollections.includes(c));
    const collectionsToUse = availableCollections.length > 0 ? availableCollections : collections;

    // Pick a random collection from available ones
    const selectedCollection = collectionsToUse[Math.floor(Math.random() * collectionsToUse.length)];
    const imagesInCollection = collectionMap.get(selectedCollection)!;

    // Filter out images that were recently shown
    const freshImages = imagesInCollection.filter((img) => !imageHistory.includes(img.url));
    const imagePool = freshImages.length > 0 ? freshImages : imagesInCollection;

    // Select a random image from the pool
    const selected = imagePool[Math.floor(Math.random() * imagePool.length)];
    setSelectedImageUrl(selected.url);

    // Update storage
    try {
      // Update image history (keep last historySize)
      const newHistory = [...imageHistory.filter((url) => url !== selected.url), selected.url].slice(
        -historySize
      );
      window.sessionStorage.setItem(IMAGE_HISTORY_KEY, JSON.stringify(newHistory));

      // Update collection history
      const newShownCollections = shownCollections.includes(selectedCollection)
        ? shownCollections
        : [...shownCollections, selectedCollection];

      // Reset collection history if all collections have been shown
      const finalCollections =
        newShownCollections.length >= collections.length ? [] : newShownCollections;

      window.sessionStorage.setItem(COLLECTIONS_KEY, JSON.stringify(finalCollections));
    } catch {
      // ignore
    }
  }, [images, storageKey, historySize]);

  return selectedImageUrl;
}
