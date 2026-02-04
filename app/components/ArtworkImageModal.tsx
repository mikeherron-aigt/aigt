"use client";

import { useEffect, useState } from "react";

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

  if (!src) {
    return (
      <div className="artwork-detail-image-placeholder" aria-hidden="true" />
    );
  }

  return (
    <>
      <button
        type="button"
        className="artwork-detail-image-button"
        onClick={() => setIsOpen(true)}
        aria-label={`View full-size image of ${title}`}
      >
        <img
          src={src}
          alt={alt}
          className="artwork-detail-image"
          loading="eager"
          decoding="async"
        />
      </button>

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
              <img src={src} alt={alt} className="object-contain" />
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
