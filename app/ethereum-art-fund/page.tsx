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
                      Tokenized Access to Ethereum-Native Cultural Assets
                    </p>
                  </div>

                  {/* Body Copy */}
                  <div className="hero-description" style={{textAlign: 'left', marginTop: '24px'}}>
                    <p>
                      The Ethereum Art Fund is a governed platform designed to explore structured ownership, fractionalization, and tokenized access to culturally significant, Ethereum-native artworks.
                    </p>
                    <p style={{marginTop: '16px'}}>
                      Operating within the Art Investment Group Trust framework, EAF applies institutional governance to an emerging asset model that blends art stewardship with evolving blockchain-based ownership structures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
                <div className="absolute inset-0">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F4d26843c35db4d8b9045503586fe91bd?format=webp&width=800"
                    alt="Abstract colorful digital art representing Ethereum-native cultural assets"
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

        {/* Two Column Content Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-[80px]">
              {/* Left Column */}
              <div className="max-w-[711px]">
                <h2 className="governance-title" style={{marginBottom: '24px'}}>
                  Institutional Discipline for an Experimental Medium
                </h2>
                <p className="governance-description">
                  Ethereum-native art represents one of the most important cultural developments of the digital era. It also introduces new forms of ownership, liquidity, and risk.
                </p>
                <p className="governance-description">
                  Ethereum Art Fund is specifically designed to absorb a higher risk profile and a shorter expected time horizon than other ART platforms.
                </p>
              </div>

              {/* Right Column */}
              <div className="max-w-[600px]">
                <h3 className="governance-title" style={{marginBottom: '24px', fontSize: '24px', lineHeight: '36px'}}>
                  Structured Exposure to Innovation
                </h3>
                <ul style={{margin: '0', paddingLeft: '20px', listStyle: 'disc'}}>
                  <li className="governance-description" style={{marginBottom: '16px'}}>
                    Applying governance to tokenized art ownership
                  </li>
                  <li className="governance-description" style={{marginBottom: '16px'}}>
                    Exploring fractional participation structures
                  </li>
                  <li className="governance-description" style={{marginBottom: '16px'}}>
                    Establishing standards for custody, documentation, and access
                  </li>
                  <li className="governance-description">
                    Creating controlled exposure to an evolving market
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
