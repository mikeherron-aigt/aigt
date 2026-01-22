'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOfferingsDropdownOpen, setIsOfferingsDropdownOpen] = useState(false);
  const [focusedDropdownItem, setFocusedDropdownItem] = useState<number | null>(null);
  const offeringsRef = useRef<HTMLDivElement>(null);
  const offeringsButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const offerings = [
    { label: 'Ethereum Art Fund', href: '/eaf' },
    { label: 'Blue Chip Art Fund', href: '/bcaf' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (offeringsRef.current && !offeringsRef.current.contains(e.target as Node)) {
        setIsOfferingsDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOfferingsDropdownOpen(false);
        offeringsButtonRef.current?.focus();
      }
    };

    if (isOfferingsDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOfferingsDropdownOpen]);

  const handleOfferingsKeyDown = (e: React.KeyboardEvent) => {
    if (!isOfferingsDropdownOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOfferingsDropdownOpen(true);
        setFocusedDropdownItem(0);
      }
    } else {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedDropdownItem(prev =>
          prev === null ? 0 : Math.min(prev + 1, offerings.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedDropdownItem(prev =>
          prev === null ? offerings.length - 1 : Math.max(prev - 1, 0)
        );
      }
    }
  };

  const isOfferingActive = (href: string) => {
    return pathname === href || pathname === href.replace('/eaf', '/ethereum-art-fund').replace('/bcaf', '/blue-chip-art-fund');
  };

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
            <div className="offerings-dropdown-wrapper" ref={offeringsRef}>
              <button
                ref={offeringsButtonRef}
                onClick={() => setIsOfferingsDropdownOpen(!isOfferingsDropdownOpen)}
                onKeyDown={handleOfferingsKeyDown}
                className="nav-link flex items-center gap-1"
                aria-expanded={isOfferingsDropdownOpen}
                aria-haspopup="menu"
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
                  className={`transition-transform duration-200 ${isOfferingsDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="1 1 6 6 11 1"></polyline>
                </svg>
              </button>

              {isOfferingsDropdownOpen && (
                <div className="offerings-dropdown" role="menu">
                  {offerings.map((item, index) => {
                    const isActive = isOfferingActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`offerings-dropdown-item ${isActive ? 'offerings-dropdown-item-active' : ''}`}
                        onClick={() => setIsOfferingsDropdownOpen(false)}
                        role="menuitem"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsOfferingsDropdownOpen(false);
                          }
                        }}
                        tabIndex={focusedDropdownItem === index ? 0 : -1}
                      >
                        <span className={`${isActive ? 'font-semibold' : 'font-normal'}`}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="offerings-dropdown-indicator"></span>
                        )}
                      </Link>
                    );
                  })}
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
                    aria-haspopup="menu"
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
                      className={`transition-transform duration-200 ${isOfferingsDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="1 1 6 6 11 1"></polyline>
                    </svg>
                  </button>
                  {isOfferingsDropdownOpen && (
                    <div className="flex flex-col pl-4 gap-3 mt-2" role="menu">
                      {offerings.map((item) => {
                        const isActive = isOfferingActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link text-base ${isActive ? 'font-semibold' : 'font-normal'}`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsOfferingsDropdownOpen(false);
                            }}
                            role="menuitem"
                          >
                            {item.label}
                          </Link>
                        );
                      })}
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
