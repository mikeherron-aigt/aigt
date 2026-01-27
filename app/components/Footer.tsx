'use client';

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 lg:py-16">
        {/* Footer Content */}
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
              alt="Art Investment Group Trust Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
            />
          </div>

          {/* Footer Links */}
          <nav className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "#252e3a" }}>
            <Link 
              href="/disclosures" 
              className="hover:opacity-70 transition-opacity"
            >
              Disclosures
            </Link>
            <span>|</span>
            <Link 
              href="/privacy" 
              className="hover:opacity-70 transition-opacity"
            >
              Privacy
            </Link>
            <span>|</span>
            <Link 
              href="/terms" 
              className="hover:opacity-70 transition-opacity"
            >
              Terms
            </Link>
            <span>|</span>
            <Link 
              href="/request-access" 
              className="hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs" style={{ color: "#252e3a" }}>
            <p className="mb-3 font-semibold">COPYRIGHT ©2026. ALL RIGHTS RESERVED.</p>
            <p className="text-xs leading-relaxed" style={{ color: "#a1a69d" }}>
              Regulatory disclosures and offering materials are provided separately and only to eligible parties. 
              This website is presented for informational purposes and does not constitute an offer or solicitation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
