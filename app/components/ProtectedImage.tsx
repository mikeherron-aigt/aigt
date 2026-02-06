"use client";

import React, { forwardRef } from "react";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

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
      draggable,
      fill = false,
      priority = false,
      className,
      style,
      loading,
      src,
      ...props
    },
    ref
  ) {
    const normalizedSrc = typeof src === "string" ? normalizeArtworkImageUrl(src) : src;
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
      />
    );
  }
);
