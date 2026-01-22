'use client';

import Header from "../components/Header";

export default function EthereumArtFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Header />

      <main>
        {/* Hero */}
        <section className="w-full" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-[900px]">
              <h1
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '41px',
                  lineHeight: '45px',
                  marginBottom: '14px',
                  color: 'var(--deep-patina, #0f2b23)',
                }}
              >
                Ethereum Art Fund
              </h1>

              <h2
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '22px',
                  lineHeight: '28px',
                  marginBottom: '18px',
                  color: 'var(--archive-slate, #555)',
                }}
              >
                Tokenized Access to Ethereum-Native Cultural Assets
              </h2>

              <div style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px' }}>
                <p style={{ marginBottom: 14 }}>
                  The Ethereum Art Fund is a governed platform designed to explore structured ownership,
                  fractionalization, and tokenized access to culturally significant, Ethereum-native artworks.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Operating within the Art Investment Group Trust framework, Ethereum Art Fund applies institutional
                  governance to an emerging asset model that blends art stewardship with evolving blockchain-based
                  ownership structures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider bar (optional visual rhythm similar to your site) */}
        <div className="w-full h-[1px]" style={{ backgroundColor: 'var(--gallery-plaster, #e6e1d8)' }} />

        {/* Operations */}
        <section className="w-full bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
            <div className="max-w-[1000px]">
              <h2
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '28px',
                  lineHeight: '34px',
                  marginBottom: '8px',
                  color: 'var(--deep-patina, #0f2b23)',
                }}
              >
                How the Ethereum Art Fund Operates
              </h2>

              <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 22 }}>
                An overview of participation mechanics, risk profile, and operating discipline.
              </p>

              <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 26 }}>
                The Ethereum Art Fund operates through selective acquisition, experimental ownership structures,
                higher risk tolerance, and governance designed to explore emerging models while maintaining
                institutional discipline.
              </p>

              {/* Section blocks */}
              <div style={{ display: 'grid', gap: 22 }}>
                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Fractionalized Participation
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 10 }}>
                    Ethereum Art Fund is designed to enable fractional exposure to curated bodies of work rather than sole
                    ownership of individual pieces.
                  </p>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 10 }}>
                    Participation structures may include:
                  </p>
                  <ul style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', paddingLeft: 18, margin: 0 }}>
                    <li>Tokenized representations of pooled artworks</li>
                    <li>Fractional economic interests</li>
                    <li>Defined governance and transfer parameters</li>
                    <li>Clear disclosures around risk and liquidity constraints</li>
                  </ul>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginTop: 10, marginBottom: 0 }}>
                    These structures are subject to regulatory considerations and are implemented conservatively.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Higher Risk. Shorter Horizon
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 10 }}>
                    The Ethereum Art Fund carries a higher risk profile than the long-horizon stewardship Blue Chip Art Fund platform
                  </p>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 10 }}>
                    Risk factors include:
                  </p>
                  <ul style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', paddingLeft: 18, margin: 0 }}>
                    <li>Market volatility</li>
                    <li>Regulatory evolution</li>
                    <li>Technological change</li>
                    <li>Liquidity uncertainty</li>
                    <li>Novel ownership structures</li>
                  </ul>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginTop: 10, marginBottom: 0 }}>
                    Ethereum Art Fund is intended for participants who understand and accept these dynamics as part of exposure to an emerging asset class.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Selective and Disciplined Growth
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 0 }}>
                    While the Dowling catalog serves as the foundation, Ethereum Art Fund may expand to include additional Ethereum-native works that meet the fund&apos;s acquisition and governance criteria.
                    <br /><br />
                    Expansion remains selective and committee-driven, with a focus on cultural relevance and suitability for tokenized participation models.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Governance in a Digital Context
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 10 }}>
                    Despite its experimental mandate, Ethereum Art Fund maintains institutional custody and control standards, including:
                  </p>
                  <ul style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', paddingLeft: 18, margin: 0 }}>
                    <li>Secure digital asset custody</li>
                    <li>Redundant access management</li>
                    <li>Documentation and provenance continuity</li>
                    <li>Ongoing technical review</li>
                  </ul>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginTop: 10, marginBottom: 0 }}>
                    Innovation does not replace discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Participation and Alignment */}
        <section className="w-full" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-20">
            <div className="max-w-[1000px]">
              <h2
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '28px',
                  lineHeight: '34px',
                  marginBottom: 14,
                  color: 'var(--deep-patina, #0f2b23)',
                }}
              >
                Participation and Alignment
              </h2>

              <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 22 }}>
                Participation in the Ethereum Art Fund is intentionally structured. The following considerations outline who the platform is designed for, how it differs from other stewardship platforms, and the expectations around engagement, risk, and alignment.
              </p>

              <div style={{ display: 'grid', gap: 22 }}>
                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    For Informed and Qualified Participants
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 0 }}>
                    Participation in the Ethereum Art Fund is offered through private placement to qualified participants who understand the experimental nature of tokenized art structures.
                    <br /><br />
                    Ethereum Art Fund is not positioned as a preservation-only vehicle, nor as a trading product. It occupies a defined middle ground between stewardship and innovation.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Complementary, Not Substitutable
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 0 }}>
                    Ethereum Art Fund operates alongside Art Investment Group Trust&apos;s long-horizon, lower-risk stewardship Blue Chip Art Fund platform. Participants seeking permanent ownership, minimal turnover, and preservation-first mandates may find those platforms more appropriate. Participants seeking structured exposure to tokenized art ownership and emerging market dynamics may find alignment with Ethereum Art Fund.
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '20px',
                      lineHeight: '26px',
                      marginBottom: 10,
                      color: 'var(--deep-patina, #0f2b23)',
                    }}
                  >
                    Informed Dialogue Required
                  </h3>
                  <p style={{ color: 'var(--archive-slate, #555)', fontSize: '16px', lineHeight: '26px', marginBottom: 0 }}>
                    Art Investment Group Trust engages prospective participants through direct, considered discussion. Understanding intent, risk tolerance, and time horizon is essential before participation. Request access to begin a private conversation about the Ethereum Art Fund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
