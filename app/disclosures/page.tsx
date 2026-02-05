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
          <h1 className="mb-8">Disclosures</h1>
          <h2 className="mb-12">Regulatory and Informational Disclosures</h2>
          
          <div className="space-y-8">
            <p>
              Art Investment Group Trust and its affiliated platforms are structured as governed stewardship vehicles for the long term holding and care of culturally significant artworks.
            </p>
            
            <p>
              The information presented on this website is provided for general informational purposes only. Nothing on this website constitutes an offer to sell, a solicitation of an offer to buy, or a recommendation regarding any security, investment product, or fund interest.
            </p>
            
            <p>
              Interests in any fund or platform sponsored by Art Investment Group Trust are offered only through definitive offering documents, including a private placement memorandum or similar materials, and only to eligible parties in jurisdictions where such offerings are lawful. Any such offering is made solely on the basis of those documents and subject to their terms and conditions.
            </p>
            
            <div className="mt-12">
              <h3 className="mb-4">No Investment Advice</h3>
              <p>
                Art Investment Group Trust does not provide investment, legal, tax, or accounting advice. Prospective participants should consult their own advisors before making any investment or participation decision.
              </p>
            </div>
            
            <div className="mt-12">
              <h3 className="mb-4">Risk Considerations</h3>
              <p>
                Investments in artworks and art related vehicles involve a high degree of risk, including but not limited to illiquidity, valuation uncertainty, market volatility, regulatory considerations, and the potential loss of all or a substantial portion of invested capital. Art assets are inherently illiquid and may require extended holding periods.
              </p>
              <p className="mt-4">
                Past performance, whether of individual artworks, artists, or related markets, is not indicative of future results.
              </p>
            </div>
            
            <div className="mt-12">
              <h3 className="mb-4">Forward Looking Statements</h3>
              <p>
                Certain statements on this website may be forward looking in nature and are based on current expectations, assumptions, and beliefs. Actual outcomes may differ materially. Art Investment Group Trust undertakes no obligation to update any forward looking statements.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
