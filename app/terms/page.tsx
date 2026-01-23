'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      <Header />

      {/* Main Content */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <h1 className="governance-title mb-12">Terms of Use</h1>

          <div className="space-y-8">
            <div>
              <h2 className="governance-subtitle mb-4">Acceptance of Terms</h2>
              <p className="governance-description">
                By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, you should discontinue use of the website.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Use of Website</h2>
              <p className="governance-description">
                This website is intended solely for informational purposes. You agree not to use the website for any unlawful, misleading, or unauthorized purpose, or in any manner that could impair its operation or integrity.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">No Reliance</h2>
              <p className="governance-description">
                Information provided on this website should not be relied upon as a basis for making investment or participation decisions. Any reliance on such information is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Intellectual Property</h2>
              <p className="governance-description">
                All content on this website, including text, design, graphics, and logos, is the property of Art Investment Group Trust or its licensors and is protected by applicable intellectual property laws. No content may be reproduced, distributed, or used without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Limitation of Liability</h2>
              <p className="governance-description">
                To the fullest extent permitted by law, Art Investment Group Trust disclaims all liability for any direct, indirect, incidental, or consequential damages arising out of or related to the use of this website.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Governing Law</h2>
              <p className="governance-description">
                These Terms of Use are governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Modifications</h2>
              <p className="governance-description">
                Art Investment Group Trust reserves the right to modify these Terms of Use at any time. Continued use of the website following any modification constitutes acceptance of the updated terms.
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
