import Link from "next/link";
import Script from "next/script";
import { getHomePageData, type Artwork } from "@/app/lib/artApiServer";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { HeroImage } from "@/app/components/HeroImage";
import { FeaturedCollectionSlider, type ArtworkItem } from "@/app/components/FeaturedCollectionSlider";
import { FAQSection } from "@/app/components/FAQSection";
import { VideoSection } from "@/app/components/VideoSection";
import { slugify } from "@/app/lib/slug";

// Force dynamic rendering to avoid build-time API calls that return 403
export const dynamic = 'force-dynamic';

const HERO_SKUS = [
  "2025-JD-DW-0007",
  "2024-JD-MM-0009",
  "2025-JD-DW-0008",
  "2025-JD-CD-0347",
  "2024-JD-AG-0020",
  "2025-JD-CD-0091",
  "2025-JD-MM-0018",
];
const GOVERNANCE_SKU = "2025-JD-DW-0019";
const MEDIUMS_SKU = "2024-JD-AG-0025";
const ART_ARTISTS_SKU = "2025-JD-CD-0361";

const mapArtworkToItem = (artwork: Artwork): ArtworkItem => ({
  src: artwork.image_url,
  title: artwork.title,
  artist: artwork.artist,
  year: artwork.year_created ? artwork.year_created.toString() : "",
  collection: artwork.collection_name,
});

const getArtworkHref = (artwork: Artwork): string | null => {
  if (!artwork.collection_name) return null;
  return `/collections/${slugify(artwork.collection_name)}/${slugify(artwork.title)}`;
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an art investment fund?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An art investment fund is a structured vehicle that acquires and holds artworks as long term assets, typically emphasizing governance, custody, and preservation rather than short term buying and selling.",
      },
    },
    {
      "@type": "Question",
      name: "How does institutional art investment work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Institutional art investment applies governance frameworks, professional custody standards, and long horizon ownership principles to the acquisition and stewardship of fine art.",
      },
    },
    {
      "@type": "Question",
      name: "Who can invest in art through Art Investment Group Trust?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Participation is limited to qualified purchasers, institutions, family offices, and approved partners through private conversations and governed access.",
      },
    },
  ],
};

export default async function Home() {
  const allSkus = [...HERO_SKUS, GOVERNANCE_SKU, MEDIUMS_SKU, ART_ARTISTS_SKU];
  const data = await getHomePageData(allSkus);

  const heroArtworks = HERO_SKUS.map((sku) => data.bySkus[sku]).filter(
    (a): a is Artwork => Boolean(a)
  );
  const governanceArtwork = data.bySkus[GOVERNANCE_SKU] ?? null;
  const mediumsArtwork = data.bySkus[MEDIUMS_SKU] ?? null;
  const artArtistsArtwork = data.bySkus[ART_ARTISTS_SKU] ?? null;

  const heroImages = heroArtworks.map((a) => a.image_url);
  const heroLinks = heroArtworks.map((a) => getArtworkHref(a));

  const featuredArtworkItems = data.featuredArtworks
    .filter((a) => !a.title.toLowerCase().includes("untitled"))
    .map(mapArtworkToItem);

  const governanceImage = governanceArtwork ? mapArtworkToItem(governanceArtwork) : null;
  const mediumsImage = mediumsArtwork ? mapArtworkToItem(mediumsArtwork) : null;
  const artArtistsImage = artArtistsArtwork ? mapArtworkToItem(artArtistsArtwork) : null;
  const governanceHref = governanceArtwork ? getArtworkHref(governanceArtwork) : null;
  const mediumsHref = mediumsArtwork ? getArtworkHref(mediumsArtwork) : null;
  const artArtistsHref = artArtistsArtwork ? getArtworkHref(artArtistsArtwork) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      {/* FAQ Schema */}
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <main>
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[80px] pt-0 pb-12 sm:pb-16 lg:pb-24 flex items-center">
              <div className="max-w-[637px]">
                <h1 style={{ marginBottom: "17px" }}>
                  The Art That Matters<br />The Stewardship It Deserves
                </h1>
                <div className="hero-subtitle">
                  <p>
                    Art Investment Group Trust was established to acquire, hold, and steward artworks of cultural significance within a disciplined, governed framework.{" "}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[18px] mt-6 sm:mt-8">
                  <Link
                    href="/request-access"
                    className="cta-primary"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Request Access
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <HeroImage
              images={heroImages}
              links={heroLinks}
              skus={HERO_SKUS}
              className="h-[400px] sm:h-[500px] lg:h-[680px] bg-gallery-plaster"
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{ top: "0", height: "calc(100% - 242px)" }}></div>
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{ top: "calc(100% - 242px)", height: "242px" }}></div>
        </div>

        {/* Design Bar */}
        <div className="w-full h-[36px] relative hidden lg:flex lg:justify-center">
          <div className="absolute top-0 left-0 h-full bg-gallery-plaster" style={{ width: "calc(50vw + 112px)" }}></div>
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(50vw + 105px)", right: "0" }}></div>
          <div className="max-w-[1440px] w-full h-full relative">
            <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }}></div>
          </div>
        </div>

        {/* Info Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center">
                <div className="max-w-[711px]">
                  <h2>Art Investment, Structured for the Long Term</h2>
                  <p>
                    Art Investment Group Trust is a governed art investment platform focused on the acquisition, stewardship, and long term ownership of museum quality and culturally significant artworks for qualified participants.
                  </p>
                  <p>
                    Art Investment Group Trust operates art investment funds and stewardship platforms for those seeking long term exposure to fine art as an alternative asset class. Our approach prioritizes governance, custody, care, and cultural legitimacy over short term trading or speculation.
                  </p>
                </div>
              </div>
              <VideoSection />
            </div>
          </div>
        </section>

        {/* Featured Collection Section */}
        <section className="w-full bg-white pt-0 pb-16 sm:pb-20 lg:pb-[104px] featured-collection-section">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2>Featured Collection</h2>
          </div>
          <FeaturedCollectionSlider artworks={featuredArtworkItems} />
        </section>

        {/* Governance Section */}
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-24 flex flex-col">
                <div className="max-w-[579px]">
                  <div>
                    <h2>Our Purpose</h2>
                    <p>
                      Art carries cultural weight long before it carries financial value. When important works are treated primarily as assets, their context, integrity, and long-term significance are often compromised.<br /><br />Art Investment Group Trust exists to address this imbalance. We provide structures designed to protect cultural importance, resist short-term pressures, and ensure that significant works are held with intention, care, and institutional discipline.<br /><br />This philosophy guides every acquisition, every governance decision, and every relationship we enter.
                    </p>
                  </div>
                </div>
                <div className="divider-line my-12 lg:my-16"></div>
                <div className="max-w-[579px]">
                  <div>
                    <h2>Stewardship Before Everything</h2>
                    <p>
                      We approach art through the lens of stewardship rather than speculation. That means prioritizing long-horizon ownership, rigorous governance, and responsible custody over velocity or volume.<br /><br />Our structures are intentionally designed to slow the process, encourage patience, and align participants around preservation, context, and care. Liquidity is episodic. Cultural responsibility is continuous.<br /><br />This approach applies equally across all mediums.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-full overflow-hidden min-h-[900px]">
                {governanceImage?.src ? (
                  governanceHref ? (
                    <Link
                      href={governanceHref}
                      className="governance-image-button"
                      aria-label={`View details for ${governanceImage.title}`}
                    >
                      <div className="absolute inset-0">
                        <ProtectedImage
                          src={governanceImage.src}
                          alt={governanceImage.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="governance-image-button">
                      <div className="absolute inset-0">
                        <ProtectedImage
                          src={governanceImage.src}
                          alt={governanceImage.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: "var(--gallery-plaster)" }} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Two Funds Section */}
        <section id="investment-offerings" className="w-full bg-white py-12 sm:py-16 lg:py-24" style={{ scrollMarginTop: "-100px" }}>
          <div className="max-w-[1441px] mx-auto">
            <div className="flex flex-col items-center gap-12">
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col items-center gap-4 max-w-full">
                <div className="flex flex-col items-center gap-4 max-w-[995px]">
                  <h2 className="text-center">Investment Offerings</h2>
                  <h3 className="text-center">Distinct Platforms.  One Philosophy</h3>
                  <p className="text-center">
                    Art Investment Group Trust operates multiple governed platforms, each designed to support different forms of cultural expression while adhering to the same standards of stewardship and oversight.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-[34px] w-full">
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3>Ethereum Art Fund</h3>
                    <p>
                      The Ethereum Art Fund extends the same stewardship philosophy to Ethereum native artworks. These works are approached not as speculative instruments, but as culturally relevant expressions native to a digital medium.<br /><br />Governance, custody, and long-term intent mirror those applied to traditional art, with optional structures introduced only where appropriate and permitted.
                    </p>
                    <Link href="/ethereum-art-fund" className="cta-primary" style={{ textDecoration: "none", width: "fit-content", alignSelf: "flex-start" }}>
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="fund-card">
                  <div className="fund-card-content">
                    <h3>Blue Chip Art Fund</h3>
                    <p>
                      Focused on established works with deep cultural and historical significance, the Blue Chip Art Fund acquires and stewards museum-quality artworks through long-horizon ownership and institutional governance.<br /><br />The emphasis is on preservation, context, and disciplined acquisition rather than transaction frequency or short-term outcomes.
                    </p>
                    <Link href="/blue-chip-art-fund" className="cta-primary" style={{ textDecoration: "none", width: "fit-content", alignSelf: "flex-start" }}>
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Bar */}
        <div className="w-full h-[36px] relative hidden lg:block">
          <div className="absolute left-0 top-0 h-full bg-gallery-plaster" style={{ width: "calc(60% - 32px)" }}></div>
          <div className="absolute top-0 h-full bg-ledger-stone" style={{ left: "calc(60%)", right: "0" }}></div>
          <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{ left: "calc(60% - 32px)" }}></div>
        </div>

        {/* One Standard Across Mediums Section */}
        <section className="w-full py-12 sm:py-16 lg:py-24" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-0">
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                {mediumsImage?.src ? (
                  mediumsHref ? (
                    <Link
                      href={mediumsHref}
                      className="mediums-image-button"
                      aria-label={`View details for ${mediumsImage.title}`}
                    >
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: "482 / 612" }}>
                        <ProtectedImage
                          src={mediumsImage.src}
                          alt={mediumsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="mediums-image-button">
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: "482 / 612" }}>
                        <ProtectedImage
                          src={mediumsImage.src}
                          alt={mediumsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: "var(--gallery-plaster)" }} />
                )}
              </div>
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center pt-8 sm:pt-12 lg:pt-0">
                <div className="max-w-[579px]">
                  <h2>One Standard Across Mediums</h2>
                  <h3>Cultural Significance Is Medium Agnostic</h3>
                  <p>
                    Whether a work exists on canvas or on chain, our standards do not change. Cultural relevance, provenance, context, and stewardship guide our decisions, not the medium itself.<br /><br />By applying the same governance framework across traditional and digital art, we aim to normalize contemporary forms of expression within an institutional and culturally legitimate context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Art and Artists Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-[138px]">
              <div className="px-4 sm:px-8 lg:pl-[115px] lg:pr-0 flex items-center">
                <div className="max-w-[579px]">
                  <h2>Art and Artists</h2>
                  <h3>The Works We Steward</h3>
                  <p>
                    AIGT stewards a curated collection of culturally significant works, selected for their artistic relevance, historical importance, and long-term cultural contribution.<br /><br />In addition to fund held works, we also support the placement and stewardship of select individual artworks through private acquisition. These works are approached with the same care, discretion, and contextual consideration.<br /><br />Art is never treated as inventory. Each work is considered within its broader cultural and curatorial narrative.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-8 lg:px-[80px] flex items-center justify-center">
                {artArtistsImage?.src ? (
                  artArtistsHref ? (
                    <Link
                      href={artArtistsHref}
                      className="art-artists-image-button"
                      aria-label={`View details for ${artArtistsImage.title}`}
                    >
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: "482 / 612" }}>
                        <ProtectedImage
                          src={artArtistsImage.src}
                          alt={artArtistsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="art-artists-image-button">
                      <div className="relative w-full max-w-[482px]" style={{ aspectRatio: "482 / 612" }}>
                        <ProtectedImage
                          src={artArtistsImage.src}
                          alt={artArtistsImage.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 482px"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: "var(--gallery-plaster)" }} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stewardship in Practice Section */}
        <section id="stewardship-in-practice" className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24">
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-center">Stewardship in Practice</h2>
              <p className="text-center max-w-[789px]">
                Structured governance and a long horizon perspective ensure each work is protected, contextualized, and allowed to mature culturally over time.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-[1280px] mx-auto">
              <div className="practice-card">
                <div className="practice-card-content">
                  <h2>Governance and Care</h2>
                  <h3>Responsibility Requires Structure</h3>
                  <p>
                    Stewardship without governance is fragile. Art Investment Trust Group operates with centralized oversight, clear separation between economic participation and control, and institutional standards for custody, insurance, conservation, and compliance.<br /><br />The governance framework exists to protect the artwork first, ensuring decisions are made with long term cultural responsibility rather than short term incentives.
                  </p>
                </div>
              </div>
              <div className="practice-card">
                <div className="practice-card-content">
                  <h2>Perspective</h2>
                  <h3>Art Requires Time</h3>
                  <p>
                    The value of important art unfolds over years, not quarters. Cultural relevance is shaped through context, exhibition, scholarship, and preservation.<br /><br />The structures are designed to reflect this reality. Outcomes are not rushed, liquidity is not forced, and art is not framed through performance metrics. Time is allowed to do its work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-9 sm:py-12 lg:py-18" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20 max-w-[995px] mx-auto">
              <h2 className="text-center">Art Investment and Stewardship FAQs</h2>
            </div>
            <FAQSection />
          </div>
        </section>

        {/* Private Conversations Section */}
        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="text-center max-w-[912px] mx-auto">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>
              <div className="text-center flex flex-col items-center">
                <h3 className="text-center">Private Conversations</h3>
                <p className="text-center max-w-[789px] mx-auto">
                  Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct, considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not transactions.
                </p>
                <p className="text-center max-w-[789px] mx-auto">
                  These conversations are exploratory by design. They allow space to discuss long-term intent, governance alignment, and the role each participant seeks to play in preserving cultural value across generations.
                </p>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/request-access"
                  className="footer-cta-primary"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  Schedule a Discussion
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
