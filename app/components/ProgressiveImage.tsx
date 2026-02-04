"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        priority={eager}
        className={`${className} transition-all duration-500 ${
          isLoaded ? "blur-0 scale-100 opacity-100" : "blur-sm scale-105 opacity-70"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
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
