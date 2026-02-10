"use client";

import { useCallback, useRef, useState } from "react";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { analyzeImageResolution } from "@/app/lib/imageUrl";

type ProgressiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

export function ProgressiveImage({
  src,
  alt,
  className = "",
  eager = false,
  fill = false,
  sizes,
  width,
  height,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const currentSrcRef = useRef(src);

  // Reset state when src prop changes
  if (currentSrcRef.current !== src) {
    currentSrcRef.current = src;
    setIsLoaded(false);
    setHasError(false);
  }

  // Callback ref to check if image is already loaded (cached) when element mounts
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0 && !isLoaded && !hasError) {
      // Analyze resolution for cached images
      const resInfo = analyzeImageResolution(img);
      if (resInfo) {
        console.log(
          `[Image] ${alt}: ${resInfo.width}x${resInfo.height} (${resInfo.megapixels}MP) - ${resInfo.estimatedQuality} quality - ${resInfo.isHighRes ? "HIGH RES" : "STANDARD"}`
        );
      }
      setIsLoaded(true);
    }
  }, [isLoaded, hasError, alt]);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Analyze resolution when image loads
    const img = e.currentTarget;
    const resInfo = analyzeImageResolution(img);
    if (resInfo) {
      console.log(
        `[Image] ${alt}: ${resInfo.width}x${resInfo.height} (${resInfo.megapixels}MP) - ${resInfo.estimatedQuality} quality - ${resInfo.isHighRes ? "HIGH RES" : "STANDARD"}`
      );
    }
    setIsLoaded(true);
  }, [alt]);

  const handleError = useCallback(() => {
    // Do not fall back to v01 - only use v02 images
    console.log(`[Image] v02 image failed to load: ${src}`);
    setHasError(true);
    setIsLoaded(true);
  }, [src]);

  return (
    <>
      <ProtectedImage
        ref={imgRef}
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        priority={eager}
        className={`${className} transition-all duration-300 ${
          isLoaded ? "blur-0 scale-100 opacity-100" : "blur-sm scale-105 opacity-70"
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {!isLoaded && !hasError ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(245, 245, 245, 0.8)",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              border: "4px solid #d6d6d6",
              borderTopColor: "#7a7a7a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </span>
      ) : null}

      {hasError ? (
        <span
          role="img"
          aria-label="Image unavailable"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f0f0",
            color: "#8a8a8a",
            fontSize: 12,
            textAlign: "center",
            padding: 12,
          }}
        >
          Image unavailable
        </span>
      ) : null}
    </>
  );
}
