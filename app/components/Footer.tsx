'use client';

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 lg:py-16">
        {/* Footer Content - All Centered */}
        <div className="flex flex-col items-center gap-8">
          {/* Logo - Centered */}
          <Link href="/" className="block">
            <div className="relative w-[180px] sm:w-[200px] lg:w-[238px] h-[45px] sm:h-[50px] lg:h-[60px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 238px"
              />
            </div>
          </Link>

          {/* Footer Links - Centered */}
          <nav className="flex flex-wrap justify-center items-center gap-2 text-sm" style={{ color: "#252e3a" }}>
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

          {/* Copyright - Centered */}
          <div className="text-center">
            <p className="mb-3 font-semibold text-sm" style={{ color: "#252e3a" }}>
              COPYRIGHT ©2026. ALL RIGHTS RESERVED.
            </p>
            {/* Disclaimer - Centered */}
            <p className="text-xs leading-relaxed max-w-4xl" style={{ color: "#252e3a" }}>
              Regulatory disclosures and offering materials are provided separately and only to eligible parties. 
              This website is presented for informational purposes and does not constitute an offer or solicitation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
