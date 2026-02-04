'use client';

import Image from "next/image";
import Link from "next/link";
import { useArtworks } from "@/app/hooks/useArtworks";

export default function CollectionPage() {
  const { artworks, loading, error, refetch } = useArtworks();
  const collectionArtworks = artworks.filter((artwork) =>
    artwork.collection_name?.toLowerCase().includes("cosmic dreams")
  );
  const displayedArtworks =
    collectionArtworks.length > 0 ? collectionArtworks : artworks;
  const gridArtworks = displayedArtworks.slice(0, 24);
  const heroArtwork = displayedArtworks[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-24 flex flex-col">
                <div className="max-w-[579px]">
                  <h1 className="hero-title">Cosmic Dreams</h1>
                  <p className="hero-description">
                    Something about the collection, what is being explored and thought about
                    while these pieces were created.
                  </p>
                  <p className="governance-description">
                    The platform is designed to protect the work, preserve provenance, and
                    govern participation through clear authority, disciplined process, and
                    controlled access.
                  </p>
                  <p className="governance-description" style={{ marginBottom: 0 }}>
                    Quote for the John might be nice
                  </p>
                </div>
              </div>

              <div className="relative w-full h-full overflow-hidden min-h-[520px]">
                {heroArtwork?.image_url ? (
                  <button
                    className="governance-image-button"
                    aria-label="Featured artwork from the Cosmic Dreams collection"
                    type="button"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={heroArtwork.image_url}
                        alt={heroArtwork.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </button>
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: "var(--gallery-plaster)" }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-white pt-12 pb-16 sm:pb-20 lg:pb-[104px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="section-heading">Other Artworks</h2>
            {loading ? (
              <div className="mt-8">
                <p className="governance-description">Loading artworks...</p>
              </div>
            ) : error ? (
              <div className="mt-8">
                <p className="governance-description">{error}</p>
                <button className="cta-secondary" type="button" onClick={refetch}>
                  Try Again
                </button>
              </div>
            ) : gridArtworks.length === 0 ? (
              <div className="mt-8">
                <p className="governance-description">
                  No artworks available at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
                {gridArtworks.map((artwork) => (
                  <article key={artwork.artwork_id} className="artwork-card" style={{ width: "100%" }}>
                    <button
                      className="artwork-card-button"
                      aria-label={`View details for ${artwork.title}`}
                      type="button"
                    >
                      <div className="artwork-image-wrapper" style={{ aspectRatio: "247 / 206" }}>
                        {artwork.image_url ? (
                          <Image
                            src={artwork.image_url}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: "var(--gallery-plaster)" }}
                          />
                        )}
                      </div>
                    </button>
                    <div className="artwork-info">
                      <h3 className="artwork-title">{artwork.title}</h3>
                      <p className="artwork-details">
                        {artwork.artist}<br />{artwork.collection_name}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="w-full py-12 sm:py-16 lg:py-[80px]" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="footer-tagline">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>
              <div className="private-conversations text-center flex flex-col items-center">
                <h3 className="private-conversations-title">
                  Private Conversations
                </h3>
                <p className="private-conversations-text max-w-[789px]">
                  Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct, considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not transactions.
                </p>
                <p className="private-conversations-text max-w-[789px]">
                  These conversations are exploratory by design. They allow space to discuss long-term intent, governance alignment, and the role each participant seeks to play in preserving cultural value across generations.
                </p>
              </div>
              <div className="flex justify-center">
                <Link href="/request-access" className="footer-cta-primary" style={{ textDecoration: "none", display: "inline-flex" }}>
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
