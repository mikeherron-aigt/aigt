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

    // Note:
    // Next/Image will serve images from your own origin via /_next/image by default.
    // That usually eliminates browser-side CORS issues and dramatically improves performance.
    return (
      <Image
        {...props}
        // @ts-expect-error - Next Image does not accept HTMLImageElement ref typing cleanly
        ref={ref}
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
