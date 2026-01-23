'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOfferingsOpen, setIsOfferingsOpen] = useState(false);

  return (
    <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
      <div className="max-w-[1440px] mx-auto py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1fr_40%] gap-0">
          {/* Left column - Logo and Nav */}
          <div className="px-4 sm:px-8 lg:px-[80px] flex items-center gap-6 relative">
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

            {/* Offerings Dropdown */}
            <div
              className="offerings-dropdown-wrapper"
              onMouseEnter={() => setIsOfferingsOpen(true)}
              onMouseLeave={() => {
                setTimeout(() => setIsOfferingsOpen(false), 150);
              }}
            >
              <button
                onClick={() => setIsOfferingsOpen(!isOfferingsOpen)}
                className="nav-link flex items-center gap-2"
              >
                Offerings
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${isOfferingsOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isOfferingsOpen && (
                <div className="offerings-dropdown" style={{marginTop: '10px'}}>
                  <Link href="/ethereum-art-fund" className="offerings-dropdown-item">
                    Ethereum Art Fund
                  </Link>
                  <Link href="/blue-chip-art-fund" className="offerings-dropdown-item">
                    Blue Chip Art Fund
                  </Link>
                </div>
              )}
            </div>

            <a href="/#gallery" className="nav-link">Gallery</a>
            <a href="/#stewardship-in-practice" className="nav-link">Stewardship</a>
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

                {/* Mobile Offerings Dropdown */}
                <div>
                  <button
                    onClick={() => setIsOfferingsOpen(!isOfferingsOpen)}
                    className="nav-link text-base w-full text-left flex items-center justify-between"
                  >
                    Offerings
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-transform ${isOfferingsOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isOfferingsOpen && (
                    <div className="flex flex-col gap-2 mt-2 pl-4 border-l border-gallery-plaster">
                      <Link
                        href="/ethereum-art-fund"
                        className="nav-link text-base"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsOfferingsOpen(false);
                        }}
                      >
                        Ethereum Art Fund
                      </Link>
                      <Link
                        href="/blue-chip-art-fund"
                        className="nav-link text-base"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsOfferingsOpen(false);
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
          {/* Right column - Empty for alignment */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </header>
  );
}
