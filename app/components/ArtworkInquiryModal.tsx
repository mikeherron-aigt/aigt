"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getApiUrl } from "../lib/apiUrl";

type InquiryFormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: InquiryFormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ArtworkInquiryModal({
  artworkTitle,
  artworkCollection,
  artworkCollectionId,
  artworkHref,
}: {
  artworkTitle: string;
  artworkCollection: string;
  artworkCollectionId: number | string;
  artworkHref?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(getApiUrl("/api/artwork-inquiry"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          artworkTitle,
          artworkCollection,
          artworkCollectionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "Failed to send inquiry.");
      }

      setStatus("success");
      setFormState(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send inquiry."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <>
      <button className="cta-secondary" type="button" onClick={() => setIsOpen(true)}>
        Inquire
      </button>

      {isOpen && (
        <div
          className="image-modal-backdrop inquiry-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Artwork inquiry form"
        >
          <div
            className="image-modal-content inquiry-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={closeModal}
              aria-label="Close inquiry form"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="inquiry-modal-body">
              <h2 className="inquiry-modal-title">Inquire</h2>
              <p className="inquiry-modal-subtitle">{artworkTitle}</p>

              {status === "success" ? (
                <p className="inquiry-modal-success">
                  Thanks for your inquiry. We will be in touch shortly.
                </p>
              ) : (
                <form className="inquiry-form" onSubmit={handleSubmit}>
                  <input
                    className="inquiry-input"
                    name="fullName"
                    placeholder="Name"
                    value={formState.fullName}
                    onChange={handleChange}
                    required
                  />
                  <div className="inquiry-row">
                    <input
                      className="inquiry-input"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      className="inquiry-input"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      value={formState.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inquiry-row">
                    {artworkHref ? (
                      <Link
                        className="inquiry-input"
                        href={artworkHref}
                        aria-label={`View details for ${artworkTitle}`}
                        style={{ display: "block", textDecoration: "none", cursor: "pointer" }}
                        onClick={closeModal}
                      >
                        {artworkTitle}
                      </Link>
                    ) : (
                      <input
                        className="inquiry-input"
                        value={artworkTitle}
                        readOnly
                        aria-label="Artwork title"
                      />
                    )}
                    <input
                      className="inquiry-input"
                      value={artworkCollection}
                      readOnly
                      aria-label="Artwork collection"
                    />
                  </div>
                  <input
                    className="inquiry-input"
                    value={artworkCollectionId}
                    readOnly
                    aria-label="Artwork collection ID"
                  />
                  <textarea
                    className="inquiry-textarea"
                    name="message"
                    placeholder="Message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                  {status === "error" ? (
                    <p className="inquiry-modal-error">
                      {errorMessage || "Failed to send inquiry. Please try again."}
                    </p>
                  ) : null}
                  <button className="btn-primary inquiry-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
