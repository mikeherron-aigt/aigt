"use client";

import { useRef } from "react";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { useImageResolution } from "@/app/hooks/useImageResolution";

type ImageWithResolutionBadgeProps = {
  src: string;
  alt: string;
  className?: string;
  showBadge?: boolean;
  fill?: boolean;
  sizes?: string;
};

/**
 * Example component that displays an image with a high-resolution badge
 * This demonstrates how to use the resolution detection utilities
 */
export function ImageWithResolutionBadge({
  src,
  alt,
  className = "",
  showBadge = true,
  fill = false,
  sizes,
}: ImageWithResolutionBadgeProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { resolutionInfo, isHighRes, isLoaded } = useImageResolution(imgRef, src);

  return (
    <div className="relative">
      <ProtectedImage
        ref={imgRef}
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
      />

      {/* Optional badge showing resolution status */}
      {showBadge && isLoaded && resolutionInfo && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: isHighRes ? "#22c55e" : "#94a3b8",
            color: "white",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {isHighRes ? "HIGH RES" : "STANDARD"}
          <span style={{ marginLeft: 4, opacity: 0.8 }}>
            {resolutionInfo.megapixels}MP
          </span>
        </div>
      )}
    </div>
  );
}
