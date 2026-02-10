"use client";

import React, { forwardRef, useCallback } from "react";
import Image from "next/image";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

type ProtectedImageProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  src: string;
  alt: string;
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
      sizes,
      width,
      height,
      ...props
    },
    ref
  ) {
    if (!src) return null;

    const normalizedSrc =
      typeof src === "string" ? normalizeArtworkImageUrl(src) : src;

    const handleLoad = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        onLoad?.(event as any);
      },
      [onLoad]
    );

    const handleError = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        onError?.(event as any);
      },
      [onError]
    );

    const mergedClassName = [className, "aigt-protected-image"]
      .filter(Boolean)
      .join(" ");

    const mergedStyle: React.CSSProperties = {
      WebkitTouchCallout: disableContextMenu ? "none" : undefined,
      ...style,
    };

    const resolvedLoading = priority ? loading ?? "eager" : loading;

    return (
      <Image
        {...props}
        // Next/Image does not type ref as HTMLImageElement cleanly, so we cast.
        ref={ref as any}
        src={normalizedSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        loading={resolvedLoading as any}
        className={mergedClassName}
        style={mergedStyle}
        draggable={disableDrag ? false : draggable}
        onContextMenu={(event) => {
          if (disableContextMenu) event.preventDefault();
          onContextMenu?.(event as any);
        }}
        onDragStart={(event) => {
          if (disableDrag) event.preventDefault();
          onDragStart?.(event as any);
        }}
        onLoad={handleLoad as any}
        onError={handleError as any}
      />
    );
  }
);
