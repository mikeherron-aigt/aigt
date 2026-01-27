'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function DisclosuresPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>


      {/* Main Content */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <h1 className="governance-title mb-8">Disclosures</h1>
          <h2 className="governance-subtitle mb-12">Regulatory and Informational Disclosures</h2>

          <div className="space-y-8">
            <p className="governance-description">
              Art Investment Group Trust and its affiliated platforms are structured as governed stewardship vehicles for the long term holding and care of culturally significant artworks.
            </p>

            <p className="governance-description">
              The information presented on this website is provided for general informational purposes only. Nothing on this website constitutes an offer to sell, a solicitation of an offer to buy, or a recommendation regarding any security, investment product, or fund interest.
            </p>

            <p className="governance-description">
              Interests in any fund or platform sponsored by Art Investment Group Trust are offered only through definitive offering documents, including a private placement memorandum or similar materials, and only to eligible parties in jurisdictions where such offerings are lawful. Any such offering is made solely on the basis of those documents and subject to their terms and conditions.
            </p>

            <div className="mt-12">
              <h3 className="governance-subtitle mb-4">No Investment Advice</h3>
              <p className="governance-description">
                Art Investment Group Trust does not provide investment, legal, tax, or accounting advice. Prospective participants should consult their own advisors before making any investment or participation decision.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="governance-subtitle mb-4">Risk Considerations</h3>
              <p className="governance-description">
                Investments in artworks and art related vehicles involve a high degree of risk, including but not limited to illiquidity, valuation uncertainty, market volatility, regulatory considerations, and the potential loss of all or a substantial portion of invested capital. Art assets are inherently illiquid and may require extended holding periods.
              </p>
              <p className="governance-description mt-4">
                Past performance, whether of individual artworks, artists, or related markets, is not indicative of future results.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="governance-subtitle mb-4">Forward Looking Statements</h3>
              <p className="governance-description">
                Certain statements on this website may be forward looking in nature and are based on current expectations, assumptions, and beliefs. Actual outcomes may differ materially. Art Investment Group Trust undertakes no obligation to update any forward looking statements.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0">
          <div className="footer-content-box flex flex-col items-center gap-10">
            {/* Logo */}
            <div className="relative w-[180px] sm:w-[200px] lg:w-[205px] h-[45px] sm:h-[50px] lg:h-[52px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 205px"
              />
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-3">
              {/* Links */}
              <p className="footer-links">
                <Link href="/disclosures" className="hover:opacity-7">Disclosures</Link>
                <span className="px-2">|</span>
                <Link href="/privacy" className="hover:opacity-7">Privacy</Link>
                <span className="px-2">|</span>
                <Link href="/terms" className="hover:opacity-7">Terms</Link>
                <span className="px-2">|</span>
                <Link href="/request-access" className="hover:opacity-7">Contact</Link>
              </p>

              {/* Copyright */}
              <p className="footer-copyright">
                COPYRIGHT ©2026. ALL RIGHTS RESERVED.
              </p>

              {/* Disclaimer */}
              <p className="footer-disclaimer">
                Regulatory disclosures and offering materials are provided separately and only to eligible parties. This website is presented for informational purposes and does not constitute an offer or solicitation.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
