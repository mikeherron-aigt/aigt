'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOfferingsDropdownOpen, setIsOfferingsDropdownOpen] = useState(false);
  const offeringsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (offeringsRef.current && !offeringsRef.current.contains(e.target as Node)) {
        setIsOfferingsDropdownOpen(false);
      }
    };

    if (isOfferingsDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOfferingsDropdownOpen]);

  return (
    <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-6 sm:py-8 lg:py-12">
        <div className="flex items-center gap-6 relative">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
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
            <Link href="/about" className="nav-link">About</Link>
            
            {/* Offerings Dropdown - Desktop */}
            <div className="relative" ref={offeringsRef}>
              <button
                onClick={() => setIsOfferingsDropdownOpen(!isOfferingsDropdownOpen)}
                className="nav-link flex items-center gap-1"
                aria-expanded={isOfferingsDropdownOpen}
              >
                Offerings
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${isOfferingsDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="1 1 6 6 11 1"></polyline>
                </svg>
              </button>

              {isOfferingsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gallery-plaster shadow-lg rounded-sm z-50 min-w-[200px]">
                  <Link
                    href="/ethereum-art-fund"
                    className="block px-4 py-3 nav-link hover:bg-gallery-plaster transition-colors"
                    onClick={() => setIsOfferingsDropdownOpen(false)}
                  >
                    Ethereum Art Fund
                  </Link>
                  <Link
                    href="/blue-chip-art-fund"
                    className="block px-4 py-3 nav-link hover:bg-gallery-plaster transition-colors border-t border-gallery-plaster"
                    onClick={() => setIsOfferingsDropdownOpen(false)}
                  >
                    Blue Chip Art Fund
                  </Link>
                </div>
              )}
            </div>

            <a href="/#gallery" className="nav-link">Gallery</a>
            <a href="/#stewardship-in-practice" className="nav-link">Stewardship</a>
            <span className="nav-separator">|</span>
            <Link href="/request-access" className="btn-primary">Request Access</Link>
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

          {/* Mobile/Tablet Dropdown Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden absolute top-full right-0 left-0 bg-white border-t border-gallery-plaster shadow-md mt-2 z-50">
              <div className="flex flex-col p-4 sm:p-6 gap-6">
                <Link
                  href="/about"
                  className="nav-link text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>

                {/* Offerings Dropdown - Mobile */}
                <div>
                  <button
                    onClick={() => setIsOfferingsDropdownOpen(!isOfferingsDropdownOpen)}
                    className="nav-link text-base w-full text-left flex items-center justify-between"
                    aria-expanded={isOfferingsDropdownOpen}
                  >
                    Offerings
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${isOfferingsDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="1 1 6 6 11 1"></polyline>
                    </svg>
                  </button>
                  {isOfferingsDropdownOpen && (
                    <div className="flex flex-col pl-4 gap-3 mt-2">
                      <Link
                        href="/ethereum-art-fund"
                        className="nav-link text-base"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsOfferingsDropdownOpen(false);
                        }}
                      >
                        Ethereum Art Fund
                      </Link>
                      <Link
                        href="/blue-chip-art-fund"
                        className="nav-link text-base"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsOfferingsDropdownOpen(false);
                        }}
                      >
                        Blue Chip Art Fund
                      </Link>
                    </div>
                  )}
                </div>

                <a
                  href="/#gallery"
                  className="nav-link text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </a>
                <a
                  href="/#stewardship-in-practice"
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
          )}
        </div>
      </div>
    </header>
  );
}
