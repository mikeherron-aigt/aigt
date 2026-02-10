"use client";

import React, { forwardRef, useCallback } from "react";
import { normalizeArtworkImageUrl, analyzeImageResolution } from "@/app/lib/imageUrl";

type ProtectedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  disableContextMenu?: boolean;
  disableDrag?: boolean;
  fill?: boolean;
  priority?: boolean;
};

export const ProtectedImage = forwardRef<HTMLImageElement, ProtectedImageProps>(
  function ProtectedImage(
    {
      disableContextMenu = true,
      disableDrag = true,
      onContextMenu,
      onDragStart,
      onError,
      onLoad,
      draggable,
      fill = false,
      priority = false,
      className,
      style,
      loading,
      src,
      alt,
      ...props
    },
    ref
  ) {
    const normalizedSrc = typeof src === "string" ? normalizeArtworkImageUrl(src) : src;

    const handleLoad = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Call original onLoad handler if provided
        onLoad?.(event);
      },
      [onLoad]
    );

    const handleError = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Do not fall back to v01 - only use v02 images
        // Call original onError handler if provided
        onError?.(event);
      },
      [onError]
    );

    const mergedClassName = [className, "aigt-protected-image"].filter(Boolean).join(" ");
    const mergedStyle: React.CSSProperties = {
      ...(fill
        ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
        : null),
      WebkitTouchCallout: disableContextMenu ? "none" : undefined,
      ...style,
    };
    const resolvedLoading = priority ? loading ?? "eager" : loading;

    return (
      <img
        ref={ref}
        {...props}
        src={normalizedSrc}
        alt={alt}
        className={mergedClassName}
        style={mergedStyle}
        loading={resolvedLoading}
        draggable={disableDrag ? false : draggable}
        onContextMenu={(event) => {
          if (disableContextMenu) event.preventDefault();
          onContextMenu?.(event);
        }}
        onDragStart={(event) => {
          if (disableDrag) event.preventDefault();
          onDragStart?.(event);
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }
);
