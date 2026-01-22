'use client';

import Image from "next/image";
import Header from "../components/Header";

export default function EthereumArtFundPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                <div className="max-w-[637px] w-full">
                  {/* Heading */}
                  <h1 className="hero-title" style={{marginBottom: '17px', textAlign: 'left'}}>
                    <div style={{fontSize: '41px', lineHeight: '45px'}}>
                      Ethereum Art Fund
                    </div>
                  </h1>

                  {/* Subtitle */}
                  <div className="hero-subtitle" style={{textAlign: 'left'}}>
                    <p>
                      Digital Art Stewardship for the Blockchain Era
                    </p>
                  </div>

                  {/* Body Copy */}
                  <div className="hero-description" style={{textAlign: 'left', marginTop: '24px'}}>
                    <p>
                      The Ethereum Art Fund is a specialized platform dedicated to acquiring, stewarding, and preserving digital and blockchain-native artworks within a governed framework.
                    </p>
                    <p style={{marginTop: '16px'}}>
                      Operating within the Art Investment Group Trust structure, the fund applies institutional standards of custody, provenance verification, and long-term stewardship to digital art and NFTs with cultural significance and artistic merit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Feafb8bb91b0e4cb4a3e057a625a6d313?format=webp&width=800"
                    alt="Digital gallery space representing the Ethereum Art Fund collection"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 242px)'}}></div>
            <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 242px)', height: '242px'}}></div>
          </div>
        </section>

        {/* Design Bar */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{width: 'calc(50vw + 112px)'}}></div>
          <div className="absolute top-0 h-full bg-ledger-stone" style={{left: 'calc(50vw + 105px)', right: '0'}}></div>
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{left: 'calc(60% - 32px)'}}></div>
          </div>
        </div>

        {/* Digital Stewardship Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="max-w-[711px]">
              <h2 className="governance-title">
                Institutional Standards for Digital Art
              </h2>
              <p className="governance-description">
                The Ethereum Art Fund brings institutional governance and stewardship to the digital art space. We focus on artworks with lasting cultural relevance and technological integrity.
              </p>
              <p className="governance-description">
                Our approach prioritizes authenticity verification, secure custody of digital assets, provenance documentation, and preservation standards for blockchain-native artworks—ensuring that digital creativity receives the same rigorous stewardship as traditional fine art.
              </p>
            </div>
          </div>
        </section>

        {/* Key Principles Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="governance-title" style={{marginBottom: '48px'}}>
              Fund Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-semibold text-lg mb-4">Provenance & Authenticity</h3>
                <p className="governance-description">
                  Rigorous verification of artwork origin, creator identity, and blockchain history for all acquisitions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Secure Custody</h3>
                <p className="governance-description">
                  Professional asset management and storage solutions that protect digital ownership and access.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Long-Term Preservation</h3>
                <p className="governance-description">
                  Commitment to maintaining digital art in perpetuity through institutional stewardship.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Cultural Impact</h3>
                <p className="governance-description">
                  Focus on artworks that contribute meaningfully to digital culture and artistic discourse.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
