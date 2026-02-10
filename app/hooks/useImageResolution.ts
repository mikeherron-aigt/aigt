"use client";

import { useEffect, useState } from "react";
import type { ImageResolutionInfo } from "@/app/lib/imageUrl";
import { analyzeImageResolution, isHighResolutionUrl } from "@/app/lib/imageUrl";

/**
 * Hook to detect and monitor image resolution
 * Returns resolution info once the image loads
 */
export function useImageResolution(
  imgRef: React.RefObject<HTMLImageElement> | HTMLImageElement | null,
  src?: string
) {
  const [resolutionInfo, setResolutionInfo] = useState<ImageResolutionInfo | null>(
    null
  );
  const [isHighResUrl, setIsHighResUrl] = useState(false);

  // Check URL pattern immediately
  useEffect(() => {
    if (src) {
      setIsHighResUrl(isHighResolutionUrl(src));
    }
  }, [src]);

  // Analyze actual image dimensions once loaded
  useEffect(() => {
    const img =
      imgRef && "current" in imgRef ? imgRef.current : (imgRef as HTMLImageElement);

    if (!img) return;

    const analyzeImage = () => {
      const info = analyzeImageResolution(img);
      if (info) {
        setResolutionInfo(info);
        console.log(
          `[Image Resolution] ${info.width}x${info.height} (${info.megapixels}MP) - ${info.resolution} quality - ${info.isHighRes ? "HIGH RES" : "STANDARD"}`
        );
      }
    };

    // Check immediately if already loaded
    if (img.complete && img.naturalWidth > 0) {
      analyzeImage();
    } else {
      // Wait for load event
      img.addEventListener("load", analyzeImage);
      return () => img.removeEventListener("load", analyzeImage);
    }
  }, [imgRef]);

  return {
    resolutionInfo,
    isHighResUrl,
    isHighRes: resolutionInfo?.isHighRes ?? isHighResUrl,
    isLoaded: resolutionInfo !== null,
  };
}
