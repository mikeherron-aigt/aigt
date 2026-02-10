const IMAGE_BASE_URL = "https://image.artigt.com";

const ensureAbsoluteImageUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  return `${IMAGE_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

export function normalizeArtworkImageUrl(url: string): string {
  console.log('[IMAGE URL] CALLED with:', url?.substring(0, 100));
  if (!url) return url;

  const originalUrl = url;
  let wasProxyUrl = false;

  // If the URL is using the image-proxy pattern, extract the actual image URL
  // This handles URLs like: https://art.artigt.com/api/public/image-proxy?url=https://image.artigt.com/...
  if (url.includes('/image-proxy?url=') || url.includes('/image-proxy%3Furl=')) {
    wasProxyUrl = true;
    console.log('[IMAGE URL] Processing proxy URL:', url);
    try {
      // Handle both regular and already-encoded URLs
      const decodedUrl = decodeURIComponent(url);
      const urlObj = new URL(decodedUrl);
      const actualImageUrl = urlObj.searchParams.get('url');
      if (actualImageUrl) {
        console.log('[IMAGE URL] Unwrapped to:', actualImageUrl);
        url = actualImageUrl;
      } else {
        console.warn('[IMAGE URL] No url parameter found in:', decodedUrl);
      }
    } catch (e) {
      // If URL parsing fails, try a simpler extraction method
      console.warn('[IMAGE URL] URL parsing failed:', e);
      const match = url.match(/[?&]url=([^&]+)/);
      if (match) {
        try {
          const extractedUrl = decodeURIComponent(match[1]);
          console.log('[IMAGE URL] Extracted via regex:', extractedUrl);
          url = extractedUrl;
        } catch (decodeError) {
          console.error('[IMAGE URL] Decode failed:', decodeError);
        }
      } else {
        console.error('[IMAGE URL] Regex match failed');
      }
    }
  }

  const [withoutHash, hash = ""] = url.split("#");
  const [base, query = ""] = withoutHash.split("?");

  const lastSlash = base.lastIndexOf("/");
  const prefix = lastSlash >= 0 ? base.slice(0, lastSlash + 1) : "";
  let filename = lastSlash >= 0 ? base.slice(lastSlash + 1) : base;

  const looksLikeArtwork =
    /__v\d+\b/i.test(filename) || /__primary__/i.test(filename) || /__full__/i.test(filename);

  if (!looksLikeArtwork) {
    if (wasProxyUrl) {
      console.warn('[IMAGE URL] Unwrapped proxy but not artwork pattern:', url);
    }
    return url;
  }

  if (/__v01\b/i.test(filename)) {
    filename = filename.replace(/__v01\b/gi, "__v02");
  }

  if (/primary/i.test(filename)) {
    filename = filename.replace(/primary/gi, "full");
  }

  if (/\.(png|tiff?|jpe?g)$/i.test(filename)) {
    filename = filename.replace(/\.(png|tiff?|jpe?g)$/i, ".webp");
  }

  const updated = `${prefix}${filename}`;

  // Strip image optimization query params (format, width) so URLs are
  // canonical. Resizing is handled by Next.js Image or the /api/img proxy.
  const cleanedQuery = query
    ? new URLSearchParams(query)
    : new URLSearchParams();
  cleanedQuery.delete("format");
  cleanedQuery.delete("width");
  const remaining = cleanedQuery.toString();
  const querySuffix = remaining ? `?${remaining}` : "";
  const hashSuffix = hash ? `#${hash}` : "";

  const finalUrl = ensureAbsoluteImageUrl(`${updated}${querySuffix}${hashSuffix}`);

  // Log transformation for debugging
  if (wasProxyUrl || originalUrl !== finalUrl) {
    console.log('[IMAGE URL] Final:', originalUrl, '->', finalUrl);
  }

  return finalUrl;
}

/**
 * Generate a fallback URL that reverts v02 back to v01
 * Used when v02 image fails to load
 */
export function getImageFallbackUrl(url: string): string | null {
  if (!url) return null;

  // Only provide fallback for v02 images that might have v01 versions
  if (!/__v02\b/i.test(url)) {
    return null;
  }

  // Revert v02 back to v01
  return url.replace(/__v02\b/gi, "__v01");
}

/**
 * Image resolution type based on dimensions
 */
export type ImageResolution = "thumbnail" | "standard" | "high" | "ultra" | "unknown";

/**
 * Image resolution metadata
 */
export interface ImageResolutionInfo {
  isHighRes: boolean;
  resolution: ImageResolution;
  width: number;
  height: number;
  megapixels: number;
  estimatedQuality: "low" | "medium" | "high" | "ultra";
}

/**
 * Detect if an image URL suggests high resolution based on naming patterns
 * This is a quick check before the image loads
 */
export function isHighResolutionUrl(url: string): boolean {
  if (!url) return false;

  const lowerUrl = url.toLowerCase();

  // Check for explicit high-res indicators in the URL
  if (
    /__full__/i.test(url) ||
    /__large__/i.test(url) ||
    /__hd__/i.test(url) ||
    /__4k__/i.test(url) ||
    /full/i.test(lowerUrl) ||
    /large/i.test(lowerUrl) ||
    /hd/i.test(lowerUrl)
  ) {
    return true;
  }

  // Check for low-res indicators (if present, it's NOT high-res)
  if (
    /__thumb__/i.test(url) ||
    /__thumbnail__/i.test(url) ||
    /__small__/i.test(url) ||
    /__preview__/i.test(url) ||
    /thumb/i.test(lowerUrl) ||
    /thumbnail/i.test(lowerUrl) ||
    /small/i.test(lowerUrl)
  ) {
    return false;
  }

  // Default to unknown (assume high-res for artwork images)
  return /__v\d+\b/i.test(url);
}

/**
 * Get image resolution category based on dimensions
 */
export function getImageResolution(width: number, height: number): ImageResolution {
  const maxDimension = Math.max(width, height);

  if (maxDimension < 500) return "thumbnail";
  if (maxDimension < 1920) return "standard";
  if (maxDimension < 3840) return "high";
  return "ultra";
}

/**
 * Analyze loaded image and return detailed resolution information
 */
export function analyzeImageResolution(
  img: HTMLImageElement
): ImageResolutionInfo | null {
  if (!img.complete || !img.naturalWidth || !img.naturalHeight) {
    return null;
  }

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const megapixels = (width * height) / 1000000;
  const resolution = getImageResolution(width, height);

  // Determine if it's considered high-res
  // High-res threshold: > 1920px in either dimension or > 2MP
  const isHighRes = Math.max(width, height) > 1920 || megapixels > 2;

  // Estimate quality based on megapixels
  let estimatedQuality: "low" | "medium" | "high" | "ultra";
  if (megapixels < 1) estimatedQuality = "low";
  else if (megapixels < 3) estimatedQuality = "medium";
  else if (megapixels < 12) estimatedQuality = "high";
  else estimatedQuality = "ultra";

  return {
    isHighRes,
    resolution,
    width,
    height,
    megapixels: parseFloat(megapixels.toFixed(2)),
    estimatedQuality,
  };
}
