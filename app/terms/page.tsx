'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Main Content */}
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <h1 className="mb-12">Terms of Use</h1>

          <div className="space-y-10">
            <section>
              <h2 className="mb-4">Acceptance of Terms</h2>
              <p>
                By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, you should discontinue use of the website.
              </p>
            </section>

            <section>
              <h2 className="mb-4">Use of Website</h2>
              <p>
                This website is intended solely for informational purposes. You agree not to use the website for any unlawful, misleading, or unauthorized purpose, or in any manner that could impair its operation or integrity.
              </p>
            </section>

            <section>
              <h2 className="mb-4">No Reliance</h2>
              <p>
                Information provided on this website should not be relied upon as a basis for making investment or participation decisions. Any reliance on such information is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including text, design, graphics, and logos, is the property of Art Investment Group Trust or its licensors and is protected by applicable intellectual property laws. No content may be reproduced, distributed, or used without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-4">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Art Investment Group Trust disclaims all liability for any direct, indirect, incidental, or consequential damages arising out of or related to the use of this website.
              </p>
            </section>

            <section>
              <h2 className="mb-4">Governing Law</h2>
              <p>
                These Terms of Use are governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="mb-4">Modifications</h2>
              <p>
                Art Investment Group Trust reserves the right to modify these Terms of Use at any time. Continued use of the website following any modification constitutes acceptance of the updated terms.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
