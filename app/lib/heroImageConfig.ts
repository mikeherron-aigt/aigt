/**
 * Static hero image configuration for pages
 */

export interface HeroImageItem {
  url: string;
  collection: string; // Collection code extracted from URL (AG, DW, MM, CD)
}

/**
 * Extract collection code from image URL
 * Example: https://image.artigt.com/JD/AG/2024-JD-AG-0009/... -> "AG"
 */
const extractCollectionFromUrl = (url: string): string => {
  const match = url.match(/\/JD\/([A-Z]+)\//);
  return match ? match[1] : 'unknown';
};

/**
 * Create hero image items from URLs
 */
const createHeroImages = (urls: string[]): HeroImageItem[] => {
  return urls.map(url => ({
    url,
    collection: extractCollectionFromUrl(url),
  }));
};

/**
 * Shared pool of hero images for About, Ethereum Art Fund, and Blue Chip Art Fund pages
 */
const HERO_IMAGE_URLS = [
  "https://image.artigt.com/JD/AG/2024-JD-AG-0009/2024-JD-AG-0009__full__v02.webp",
  "https://image.artigt.com/JD/AG/2024-JD-AG-0009/2024-JD-AG-0009__full__v02.webp",
  "https://image.artigt.com/JD/AG/2024-JD-AG-0025/2024-JD-AG-0025__full__v02.webp",
  "https://image.artigt.com/JD/AG/2024-JD-AG-0037/2024-JD-AG-0037__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0002/2025-JD-DW-0002__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0001/2025-JD-DW-0001__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0010/2025-JD-DW-0010__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0016/2025-JD-DW-0016__full__v02.webp",
  "https://image.artigt.com/JD/MM/2024-JD-MM-0008/2024-JD-MM-0008__full__v02.webp",
  "https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp",
  "https://image.artigt.com/JD/MM/2024-JD-MM-0018/2024-JD-MM-0018__full__v02.webp",
  "https://image.artigt.com/JD/MM/2024-JD-MM-0004/2024-JD-MM-0004__full__v02.webp",
  "https://image.artigt.com/JD/CD/2025-JD-CD-0111/2025-JD-CD-0111__full__v02.webp",
  "https://image.artigt.com/JD/CD/2025-JD-CD-0139/2025-JD-CD-0139__full__v02.webp",
  "https://image.artigt.com/JD/CD/2025-JD-CD-0300/2025-JD-CD-0300__full__v02.webp",
  "https://image.artigt.com/JD/CD/2025-JD-CD-0350/2025-JD-CD-0350__full__v02.webp",
];

export const HERO_IMAGES = createHeroImages(HERO_IMAGE_URLS);

/**
 * Collection-specific image pools for individual collection pages
 */
const DREAMS_AND_WONDERS_IMAGES = [
  "https://image.artigt.com/JD/DW/2025-JD-DW-0002/2025-JD-DW-0002__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0001/2025-JD-DW-0001__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0010/2025-JD-DW-0010__full__v02.webp",
  "https://image.artigt.com/JD/DW/2025-JD-DW-0016/2025-JD-DW-0016__full__v02.webp",
];

export const COLLECTION_IMAGES: Record<string, string[]> = {
  "A Miracle in the Making": [
    "https://image.artigt.com/JD/MM/2024-JD-MM-0008/2024-JD-MM-0008__full__v02.webp",
    "https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp",
    "https://image.artigt.com/JD/MM/2024-JD-MM-0018/2024-JD-MM-0018__full__v02.webp",
    "https://image.artigt.com/JD/MM/2024-JD-MM-0004/2024-JD-MM-0004__full__v02.webp",
  ],
  "American Graffiti": [
    "https://image.artigt.com/JD/AG/2024-JD-AG-0009/2024-JD-AG-0009__full__v02.webp",
    "https://image.artigt.com/JD/AG/2024-JD-AG-0009/2024-JD-AG-0009__full__v02.webp",
    "https://image.artigt.com/JD/AG/2024-JD-AG-0025/2024-JD-AG-0025__full__v02.webp",
    "https://image.artigt.com/JD/AG/2024-JD-AG-0037/2024-JD-AG-0037__full__v02.webp",
  ],
  "Dreams and Wonders": DREAMS_AND_WONDERS_IMAGES,
  "Dreams & Wonders": DREAMS_AND_WONDERS_IMAGES, // Support both naming variations
  "Cosmic Dreams": [
    "https://image.artigt.com/JD/CD/2025-JD-CD-0111/2025-JD-CD-0111__full__v02.webp",
    "https://image.artigt.com/JD/CD/2025-JD-CD-0139/2025-JD-CD-0139__full__v02.webp",
    "https://image.artigt.com/JD/CD/2025-JD-CD-0300/2025-JD-CD-0300__full__v02.webp",
    "https://image.artigt.com/JD/CD/2025-JD-CD-0350/2025-JD-CD-0350__full__v02.webp",
  ],
};
