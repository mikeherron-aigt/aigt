import Link from "next/link";
import { getCollectionArtworkPool, getCollections } from "@/app/lib/artApiServer";
import { slugify } from "@/app/lib/slug";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { ProtectedImage } from "@/app/components/ProtectedImage";
import { COLLECTION_IMAGES } from "@/app/lib/heroImageConfig";

// Use ISR (Incremental Static Regeneration) with a short revalidation time
// to balance fresh data with performance. This prevents hanging on slow API responses.
export const revalidate = 60; // Revalidate every 60 seconds

const collectionDescriptions: Record<string, string> = {
  // Add collection descriptions here, keyed by collection name.
};

const isValidArtwork = (title: string) => !title.toLowerCase().includes("untitled");

// Static hero image — no API call or randomization needed
const HERO_IMAGE_URL = "https://image.artigt.com/JD/DW/2025-JD-DW-0017/2025-JD-DW-0017__full__v02.webp";

/**
 * Get a random image from the collection's static image pool
 * If no custom images are configured, return null to fall back to dynamic
 */
const getCollectionFeaturedImage = (collectionName: string): string | null => {
  const images = COLLECTION_IMAGES[collectionName];
  if (!images || images.length === 0) return null;
  // Pick a random image from the pool for variety
  return images[Math.floor(Math.random() * images.length)];
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  // Fetch a small pool (max 24) per collection instead of the entire catalog
  // Use Promise.allSettled to prevent one failed collection from blocking others
  const results = await Promise.allSettled(
    collections.map(async (collection) => {
      // First, try to get a custom static image for this collection
      const staticImage = getCollectionFeaturedImage(collection.collection_name);

      if (staticImage) {
        // Use the custom static image
        return { ...collection, featuredImageUrl: staticImage };
      }

      // Fall back to dynamic image selection
      try {
        const pool = await getCollectionArtworkPool(collection.collection_name, 24);
        const valid = pool.filter((a) => isValidArtwork(a.title));
        // Pick a random artwork from the pool for visual variety on refresh
        const featured = valid.length > 0
          ? valid[Math.floor(Math.random() * valid.length)]
          : null;
        return { ...collection, featured, featuredImageUrl: featured?.image_url || null };
      } catch (error) {
        console.error(`Failed to fetch artworks for collection ${collection.collection_name}:`, error);
        return { ...collection, featured: null, featuredImageUrl: null };
      }
    })
  );

  const collectionsWithImages = results.map((r, idx) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`Collection ${collections[idx].collection_name} failed to load:`, r.reason);
    return { ...collections[idx], featured: null, featuredImageUrl: null };
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        <section className="w-full bg-white pt-12 pb-16 sm:pb-20 lg:pb-[104px] featured-collections-section">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="collection-hero-banner">
              <div className="absolute inset-0 overflow-hidden">
                <ProtectedImage
                  src={HERO_IMAGE_URL}
                  alt="Featured collections"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
              </div>

              <div className="collection-hero-card relative z-10">
                <h2 className="collection-hero-title">A Structured Body of Work</h2>
                <p className="collection-hero-text">
                  The collections below represent the primary pillars of John’s catalog. Each collection
                  is intentionally defined and stewarded as a distinct body of work. Together, they form
                  a coherent system rather than a series of isolated pieces.
                </p>
              </div>
            </div>

            <h2 className="section-heading">Featured Collections</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
              {collectionsWithImages.map((collection) => {
                const slug = slugify(collection.collection_name);
                const description = collectionDescriptions[collection.collection_name];
                const collectionHref = `/collections/${slug}`;

                return (
                  <article
                    key={collection.collection_id}
                    className="artwork-card collection-card"
                    style={{ width: "100%" }}
                  >
                    <Link
                      href={collectionHref}
                      className="artwork-card-button"
                      aria-label={`View ${collection.collection_name} collection`}
                    >
                      <div className="artwork-image-wrapper" style={{ aspectRatio: "247 / 206" }}>
                        {collection.featuredImageUrl ? (
                          <ProgressiveImage
                            src={collection.featuredImageUrl}
                            alt={`${collection.collection_name} collection`}
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
                    </Link>

                    <div className="artwork-info">
                      <h3 className="artwork-title">
                        <Link
                          href={collectionHref}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {collection.collection_name}
                        </Link>
                      </h3>
                      <p className="artwork-details">{collection.artwork_count} artworks</p>
                      {description ? (
                        <p className="collection-description">{description}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="w-full py-12 sm:py-16 lg:py-[80px]"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              <h2 className="footer-tagline">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              <div className="private-conversations text-center flex flex-col items-center">
                <h3 className="private-conversations-title">Private Conversations</h3>
                <p className="private-conversations-text max-w-[789px]">
                  Art Investment Group Trust engages with collectors, institutions, and qualified
                  participants through direct, considered dialogue. We believe the stewardship of
                  important art begins with thoughtful conversation, not transactions.
                </p>
                <p className="private-conversations-text max-w-[789px]">
                  These conversations are exploratory by design. They allow space to discuss long-term
                  intent, governance alignment, and the role each participant seeks to play in preserving
                  cultural value across generations.
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
