"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

type ArtworkImageModalProps = {
  src?: string;
  alt: string;
  title: string;
  artist?: string;
  year?: string | number;
};

export default function ArtworkImageModal({
  src,
  alt,
  title,
  artist,
  year,
}: ArtworkImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const ZOOM_SCALE = 2.5;
  const LENS_SIZE = 150; // Size of the lens indicator in pixels

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        document.body.style.overflow = "unset";
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: hover)");
    const updateHover = () => setCanHover(media.matches);
    updateHover();
    media.addEventListener("change", updateHover);
    return () => media.removeEventListener("change", updateHover);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Calculate position relative to the image, not the container
    const imageOffsetX = imageRect.left - containerRect.left;
    const imageOffsetY = imageRect.top - containerRect.top;

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    // Check if mouse is over the actual image
    const isOverImage =
      mouseX >= imageOffsetX &&
      mouseX <= imageOffsetX + imageRect.width &&
      mouseY >= imageOffsetY &&
      mouseY <= imageOffsetY + imageRect.height;

    if (!isOverImage) {
      setIsZooming(false);
      return;
    }

    setIsZooming(true);
    setImageDimensions({ width: imageRect.width, height: imageRect.height });

    // Calculate percentage position within the image
    const xPercent = ((mouseX - imageOffsetX) / imageRect.width) * 100;
    const yPercent = ((mouseY - imageOffsetY) / imageRect.height) * 100;

    // Calculate lens position (centered on mouse, clamped to image bounds)
    const lensX = Math.max(0, Math.min(mouseX - imageOffsetX - LENS_SIZE / 2, imageRect.width - LENS_SIZE));
    const lensY = Math.max(0, Math.min(mouseY - imageOffsetY - LENS_SIZE / 2, imageRect.height - LENS_SIZE));

    setZoomPosition({ x: xPercent, y: yPercent });
    setLensPosition({ x: lensX + imageOffsetX, y: lensY + imageOffsetY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  if (!src) {
    return (
      <div className="artwork-detail-image-placeholder" aria-hidden="true" />
    );
  }

  // Route images through the same-origin proxy to avoid CORS issues
  // for raw <img> tags and CSS background-image usage.
  const proxiedImageUrl = (url: string, width?: number) => {
    const canonical = normalizeArtworkImageUrl(url);
    const params = new URLSearchParams({ url: canonical });
    if (width) params.set("w", String(width));
    return `/api/img?${params.toString()}`;
  };

  const smallImageUrl = proxiedImageUrl(src, 1200);
  const largeImageUrl = proxiedImageUrl(src, 2400);
  const imageAlt = alt || title;

  // Calculate zoom panel size based on image dimensions
  const zoomPanelWidth = Math.min(400, imageDimensions.width || 400);
  const zoomPanelHeight = Math.min(400, imageDimensions.height || 400);

  return (
    <>
      <div className="artwork-image-zoom-wrapper" style={{ position: "relative" }}>
        <button
          type="button"
          className="artwork-detail-image-button"
          onClick={() => setIsOpen(true)}
          aria-label={`View full-size image of ${title}`}
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        >
          {canHover ? (
            <div
              ref={containerRef}
              className="artwork-zoom-container"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: "relative",
                width: "100%",
                overflow: "visible",
                cursor: "crosshair",
              }}
            >
              {imageError ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxHeight: "72vh",
                    minHeight: "300px",
                    width: "100%",
                    color: "#8a8a8a",
                    fontSize: "14px",
                  }}
                >
                  Image unavailable
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={smallImageUrl}
                  alt={imageAlt}
                  className="artwork-detail-image aigt-protected-image"
                  draggable={false}
                  onError={() => setImageError(true)}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "72vh",
                    width: "auto",
                    height: "auto",
                    margin: "0 auto",
                  }}
                />
              )}
              {/* Lens indicator - shows what area is being magnified */}
              {isZooming && (
                <div
                  className="artwork-zoom-lens"
                  style={{
                    position: "absolute",
                    left: lensPosition.x,
                    top: lensPosition.y,
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    border: "2px solid rgba(0, 0, 0, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    pointerEvents: "none",
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.15)",
                  }}
                />
              )}
              {!isZooming && canHover && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: "6px 12px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                  }}
                >
                  Hover to zoom
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "60vh",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {imageError ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color: "#8a8a8a",
                    fontSize: "14px",
                  }}
                >
                  Image unavailable
                </div>
              ) : (
                <img
                  src={smallImageUrl}
                  alt={imageAlt}
                  className="artwork-detail-image aigt-protected-image"
                  draggable={false}
                  onError={() => setImageError(true)}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
            </div>
          )}
        </button>

        {/* Zoomed image panel - appears to the right */}
        {isZooming && canHover && (
          <div
            className="artwork-zoom-result"
            style={{
              position: "absolute",
              left: "calc(100% + 20px)",
              top: 0,
              width: zoomPanelWidth,
              height: zoomPanelHeight,
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              backgroundImage: `url(${largeImageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${(imageDimensions.width || 400) * ZOOM_SCALE}px ${(imageDimensions.height || 400) * ZOOM_SCALE}px`,
              backgroundPosition: `${-zoomPosition.x * (imageDimensions.width || 400) * ZOOM_SCALE / 100 + zoomPanelWidth / 2}px ${-zoomPosition.y * (imageDimensions.height || 400) * ZOOM_SCALE / 100 + zoomPanelHeight / 2}px`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {isOpen ? (
        <div
          className="image-modal-backdrop"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size artwork viewer"
        >
          <div
            className="image-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="image-modal-image-container">
              <ProtectedImage
                src={src}
                alt={alt}
                className="object-contain"
                fill
                sizes="100vw"
                priority
              />
            </div>
            <div className="image-modal-info">
              <h2 className="image-modal-title">{title}</h2>
              <p className="image-modal-artist">
                {artist ? `${artist}${year ? `, ${year}` : ""}` : year}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
