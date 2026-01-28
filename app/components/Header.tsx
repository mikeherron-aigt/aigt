'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isOfferingsOpen, setIsOfferingsOpen] = useState(false);
  const offeringsRef = useRef<HTMLDivElement | null>(null);

  // NEW: Stewardship dropdown state + ref
  const [isStewardshipOpen, setIsStewardshipOpen] = useState(false);
  const stewardshipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // Close Offerings if click outside
      if (offeringsRef.current && !offeringsRef.current.contains(e.target as Node)) {
        setIsOfferingsOpen(false);
      }

      // NEW: Close Stewardship if click outside
      if (stewardshipRef.current && !stewardshipRef.current.contains(e.target as Node)) {
        setIsStewardshipOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOfferingsOpen(false);
        setIsStewardshipOpen(false); // NEW
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="w-full sticky top-0 z-[9999]" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:pl-[80px] lg:pr-0 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center w-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]"
            aria-label="Art Investment Group Trust home"
          >
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
              alt="Art Investment Group Trust Logo"
              fill
              className="object-contain object-left"
              priority
              sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto">
            <Link href="/about" className="nav-link">
              About
            </Link>

            {/* Offerings Dropdown */}
            <div className="relative" ref={offeringsRef}>
              <button
                type="button"
                className="nav-link flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={isOfferingsOpen}
                onClick={() => {
                  setIsOfferingsOpen((v) => !v);
                  setIsStewardshipOpen(false); // NEW: keep only one dropdown open
                }}
                onMouseEnter={() => {
                  setIsOfferingsOpen(true);
                  setIsStewardshipOpen(false); // NEW
                }}
              >
                Offerings
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isOfferingsOpen ? "rotate-180" : ""} transition-transform duration-200`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOfferingsOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-[320px] bg-white border border-gallery-plaster shadow-md z-[9999]"
                  role="menu"
                  onMouseLeave={() => setIsOfferingsOpen(false)}
                >
                  <div className="p-4 flex flex-col gap-2">
                    <Link
                      href="/ethereum-art-fund"
                      className="nav-link text-base"
                      role="menuitem"
                      onClick={() => setIsOfferingsOpen(false)}
                    >
                      Ethereum Art Fund
                    </Link>

                    <Link
                      href="/blue-chip-art-fund"
                      className="nav-link text-base"
                      role="menuitem"
                      onClick={() => setIsOfferingsOpen(false)}
                    >
                      Blue Chip Art Fund
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <a href="/#gallery" className="nav-link">
              Gallery
            </a>

            {/* NEW: Stewardship Dropdown */}
            <div className="relative" ref={stewardshipRef}>
              <button
                type="button"
                className="nav-link flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={isStewardshipOpen}
                onClick={() => {
                  setIsStewardshipOpen((v) => !v);
                  setIsOfferingsOpen(false); // keep only one open
                }}
                onMouseEnter={() => {
                  setIsStewardshipOpen(true);
                  setIsOfferingsOpen(false);
                }}
              >
                Stewardship
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isStewardshipOpen ? "rotate-180" : ""} transition-transform duration-200`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isStewardshipOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-[320px] bg-white border border-gallery-plaster shadow-md z-[9999]"
                  role="menu"
                  onMouseLeave={() => setIsStewardshipOpen(false)}
                >
                  <div className="p-4 flex flex-col gap-2">
                    <Link
                      href="/museum"
                      className="nav-link text-base"
                      role="menuitem"
                      onClick={() => setIsStewardshipOpen(false)}
                    >
                      Museum
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/request-access" className="btn-primary">
              Request Access
            </Link>
          </nav>

          {/* Mobile/Tablet Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden ml-auto p-2 text-archive-slate hover:opacity-70 transition-opacity"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Mobile overlay + dropdown */}
          {isMenuOpen && (
            <>
              <button
                aria-label="Close menu overlay"
                className="fixed inset-0 bg-black/20 z-[9998] lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />

              <nav className="lg:hidden absolute top-full right-0 left-0 bg-white border-t border-gallery-plaster shadow-md mt-2 z-[9999]">
                <div className="flex flex-col p-4 sm:p-6 gap-6">
                  <Link
                    href="/about"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>

                  <div className="flex flex-col gap-3">
                    <span className="nav-link text-base" style={{ opacity: 0.9 }}>
                      Offerings
                    </span>
                    <div className="pl-4 flex flex-col gap-3">
                      <Link
                        href="/ethereum-art-fund"
                        className="nav-link text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Ethereum Art Fund
                      </Link>
                      <Link
                        href="/blue-chip-art-fund"
                        className="nav-link text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Blue Chip Art Fund
                      </Link>
                    </div>
                  </div>

                  <a
                    href="/#gallery"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gallery
                  </a>

                  {/* Mobile Stewardship stays simple as requested */}
                  <a
                    href="/museum"
                    className="nav-link text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Stewardship
                  </a>

                  <div className="border-t border-gallery-plaster pt-4">
                    <Link
                      href="/request-access"
                      className="btn-primary mobile-menu-button w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Request Access
                    </Link>
                  </div>
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
