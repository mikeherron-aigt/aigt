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
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center py-12 lg:py-0">
                <div className="max-w-[711px] w-full">
                  {/* Heading */}
                  <h1 className="hero-title" style={{marginBottom: '17px', textAlign: 'left'}}>
                    Ethereum Art Fund
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
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F5a13615e39cb4a898e26aab1d64089af?format=webp&width=800"
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
            <div className="grid lg:grid-cols-[1fr_40%] gap-12 lg:gap-[80px]">
              {/* Left Column */}
              <div className="max-w-[579px]">
                <h2 className="governance-title" style={{marginBottom: '24px'}}>
                  Institutional Discipline for an Experimental Medium
                </h2>
                <p className="governance-description">
                  Ethereum-native art represents one of the most important cultural developments of the digital era. It also introduces new forms of ownership, liquidity, and risk.
                </p>
                <p className="governance-description">
                  Ethereum Art Fund is intentionally designed to operate with a higher risk profile and a shorter expected time horizon than other AIGT platforms.
                </p>
              </div>

              {/* Right Column */}
              <div className="max-w-[502px] p-10 lg:p-[80px_40px]" style={{backgroundColor: '#f5f5f5'}}>
                <h3 className="governance-title" style={{marginBottom: '24px', fontSize: '28px', lineHeight: '36px'}}>
                  Structured Exposure to Innovation
                </h3>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Applying governance to tokenized art ownership
                </p>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Exploring fractional participation structures
                </p>
                <p className="governance-description" style={{marginBottom: '16px'}}>
                  Establishing standards for custody, documentation, and access
                </p>
                <p className="governance-description">
                  Creating controlled exposure to an evolving market
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Distinct Mandate Section */}
        <section className="w-full py-12 sm:py-16 lg:py-20" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">
                A Distinct Mandate
              </h2>
              <p className="governance-subtitle text-center max-w-[735px]">
                The Ethereum Art Fund is differentiated from other Art Investment Group Trust stewardship platforms by its mandate.
              </p>
            </div>

            {/* Four Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Tokenization and Fractional Ownership Structures
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Emerging Market Infrastructure
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Innovation in Access and Participation
                </h3>
              </div>
              <div className="stewardship-card">
                <h3 className="stewardship-card-title text-center">
                  Measured Engagement with Liquidity Dynamics
                </h3>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="max-w-[1022px] mx-auto mt-16 text-center">
              <p className="governance-description">
                The Ethereum Art Fund was established with a clearly defined mandate. It operates at the intersection of cultural stewardship and evolving ownership models, engaging selectively with tokenization and fractional participation while maintaining institutional governance. This flexibility introduces additional risk and shorter time horizons, which are acknowledged and managed through structure rather than avoided.
              </p>
            </div>
          </div>
        </section>

        {/* The Catalog of John Dowling Jr. Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[278px_1fr] gap-12 lg:gap-[120px] items-start">
              {/* Left: Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-[278px] h-[278px] rounded-full overflow-hidden">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F2a84950d36374b0fbc5643367302bc6a?format=webp&width=620"
                    alt="John Dowling Jr."
                    fill
                    className="object-cover"
                    sizes="278px"
                  />
                </div>
              </div>

              {/* Right: Content */}
              <div className="max-w-[579px]">
                <h2 className="governance-title" style={{marginBottom: '24px'}}>
                  The Catalog of John Dowling Jr.
                </h2>
                <p className="governance-description">
                  The fund launched with the complete Ethereum-native catalog of John Dowling Jr. as its foundational body of work.
                </p>
                <p className="governance-description">
                  Dowling's on-chain practice represents a cohesive and historically significant contribution to early Ethereum-native art. The catalog provides a structured and well-documented foundation suitable for experimentation with fractional ownership models under governance.
                </p>
                <p className="governance-description">
                  The collection offers:
                </p>
                <ul className="governance-description" style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                  <li>Clear provenance</li>
                  <li>Cohesive artistic narrative</li>
                  <li>Sufficient scale for structured participation</li>
                  <li>Alignment with Ethereum-native principles</li>
                </ul>
              </div>
            </div>

            {/* Featured Works */}
            <div className="mt-16">
              <h3 className="governance-title" style={{marginBottom: '32px', fontSize: '28px'}}>
                Featured Works
              </h3>
              
              {/* Artwork Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  {
                    src: 'https://api.builder.io/api/v1/image/assets/TEMP/bf1425734f332533a074c41067eab96904592547?width=539',
                    title: 'Artwork Painting Title',
                    artist: 'Artist Name, Year Painting 1995'
                  },
                  {
                    src: 'https://api.builder.io/api/v1/image/assets/TEMP/c449ed6d6c50481da77fcd400331fe03b0bd186f?width=539',
                    title: 'Artwork Painting Title',
                    artist: 'Artist Name, Year Painting 1995'
                  },
                  {
                    src: 'https://api.builder.io/api/v1/image/assets/TEMP/35d9e20b231328fe15361b6f6b89e3dc2744cfce?width=539',
                    title: 'Artwork Painting Title',
                    artist: 'Artist Name, Year Painting 1995'
                  },
                  {
                    src: 'https://api.builder.io/api/v1/image/assets/TEMP/6054acc63d39b4b9f9397cb08da9efd2770dc874?width=539',
                    title: 'Artwork Painting Title',
                    artist: 'Artist Name, Year Painting 1995'
                  },
                  {
                    src: 'https://api.builder.io/api/v1/image/assets/TEMP/e44fc8c56a4ca0c1eaae9adcf85aa3a3d8c7f4f3?width=539',
                    title: 'Artwork Painting Title',
                    artist: 'Artist Name, Year Painting 1995'
                  },
                ].map((artwork, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="relative w-full aspect-[247/206] overflow-hidden bg-gallery-plaster">
                      <Image
                        src={artwork.src}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                    <div>
                      <p className="artwork-title">{artwork.title}</p>
                      <p className="artwork-details">{artwork.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the Ethereum Art Fund Operates */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16 max-w-[995px] mx-auto">
              <h2 className="governance-title text-center">
                How the Ethereum Art Fund Operates
              </h2>
              <p className="governance-subtitle text-center max-w-[817px]">
                An overview of participation mechanics, risk profile, and operating discipline.
              </p>
            </div>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Fractionalized Participation */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Fractionalized Participation</h3>
                  <p className="practice-card-description">
                    Ethereum Art Fund is designed to enable fractional exposure to curated bodies of work rather than sole ownership of individual pieces.
                  </p>
                  <p className="practice-card-description">
                    Participation structures may include:
                  </p>
                  <ul className="practice-card-description" style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Tokenized representations of pooled artworks</li>
                    <li>Fractional economic interests</li>
                    <li>Defined governance and transfer parameters</li>
                    <li>Clear disclosures around risk and liquidity constraints</li>
                  </ul>
                  <p className="practice-card-description">
                    These structures are subject to regulatory considerations and are implemented conservatively.
                  </p>
                </div>
              </div>

              {/* Higher Risk. Shorter Horizon */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Higher Risk. Shorter Horizon</h3>
                  <p className="practice-card-description">
                    The Ethereum Art Fund carries a higher risk profile than the long-horizon stewardship Blue Chip Art Fund platform
                  </p>
                  <p className="practice-card-description">
                    Risk factors include:
                  </p>
                  <ul className="practice-card-description" style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Market volatility</li>
                    <li>Regulatory evolution</li>
                    <li>Technological change</li>
                    <li>Liquidity uncertainty</li>
                    <li>Novel ownership structures</li>
                  </ul>
                  <p className="practice-card-description">
                    Ethereum Art Fund is intended for participants who understand and accept these dynamics as part of exposure to an emerging asset class.
                  </p>
                </div>
              </div>

              {/* Selective and Disciplined Growth */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Selective and Disciplined Growth</h3>
                  <p className="practice-card-description">
                    While the Dowling catalog serves as the foundation, EAF may expand to include additional Ethereum-native works that meet the fund's acquisition and governance criteria.
                  </p>
                  <p className="practice-card-description">
                    Expansion remains selective and committee-driven, with a focus on cultural relevance and suitability for tokenized participation models.
                  </p>
                </div>
              </div>

              {/* Governance in a Digital Context */}
              <div className="practice-card">
                <div className="practice-card-content">
                  <h3 className="practice-card-title">Governance in a Digital Context</h3>
                  <p className="practice-card-description">
                    Despite its experimental mandate, EAF maintains institutional custody and control standards, including:
                  </p>
                  <ul className="practice-card-description" style={{paddingLeft: '20px', listStyle: 'disc', marginTop: '8px'}}>
                    <li>Secure digital asset custody</li>
                    <li>Redundant access management</li>
                    <li>Documentation and provenance continuity</li>
                    <li>Ongoing technical review</li>
                  </ul>
                  <p className="practice-card-description">
                    Innovation does not replace discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="governance-title" style={{marginBottom: '16px'}}>
              Participation and Alignment
            </h2>
            <p className="governance-description max-w-[1038px]" style={{marginBottom: '48px'}}>
              Participation in the Ethereum Art Fund is intentionally structured. The following considerations outline who the platform is designed for, how it differs from other stewardship platforms, and the expectations around engagement, risk, and alignment.
            </p>

            {/* Three Grey Boxes */}
            <div className="flex flex-col gap-6">
              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px'}}>
                <h3 className="stewardship-card-title">For Informed and Qualified Participants</h3>
                <p className="stewardship-card-description">
                  Participation in the Ethereum Art Fund is offered through private placement to qualified participants who understand the experimental nature of tokenized art structures.
                </p>
                <p className="stewardship-card-description">
                  Ethereum Art Fund is not positioned as a preservation-only vehicle, nor as a trading product. It occupies a defined middle ground between stewardship and innovation.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px'}}>
                <h3 className="stewardship-card-title">Complementary, Not Substitutable</h3>
                <p className="stewardship-card-description">
                  Ethereum Art Fund operates alongside Art Investment Group Trust's long-horizon, lower-risk stewardship Blue Chip Art Fund platform. Participants seeking permanent ownership, minimal turnover, and preservation-first mandates may find those platforms more appropriate. Participants seeking structured exposure to tokenized art ownership and emerging market dynamics may find alignment with Ethereum Art Fund.
                </p>
              </div>

              <div className="stewardship-card" style={{padding: '40px', width: '100%', maxWidth: '1199px'}}>
                <h3 className="stewardship-card-title">Informed Dialogue Required</h3>
                <p className="stewardship-card-description">
                  Art Investment Group Trust engages prospective participants through direct, considered discussion. Understanding intent, risk tolerance, and time horizon is essential before participation. Request access to begin a private conversation about the Ethereum Art Fund.
                </p>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="max-w-[1022px] mx-auto mt-16 text-center">
              <p className="governance-description">
                The Ethereum Art Fund operates through defined ownership structures, measured engagement with risk, selective and committee-driven growth, and institutional governance applied consistently across participation and custody.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
