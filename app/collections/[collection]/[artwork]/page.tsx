import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionArtworks, getCollections, type Artwork } from "@/app/lib/artApiServer";
import { slugify } from "@/app/lib/slug";
import ArtworkInquiryModal from "@/app/components/ArtworkInquiryModal";
import ArtworkImageModal from "@/app/components/ArtworkImageModal";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";

const isValidArtwork = (title: string) =>
  !title.toLowerCase().includes("untitled");

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ collection: string; artwork: string }>;
}) {
  const resolvedParams = await params;
  const collectionSlug = resolvedParams.collection;
  const artworkSlug = resolvedParams.artwork;
  const collections = await getCollections();
  const matchedCollection = collections.find(
    (collection) => slugify(collection.collection_name) === collectionSlug
  );

  if (!matchedCollection) {
    notFound();
  }

  const collectionName = matchedCollection.collection_name;

  let artworks: Artwork[] = [];
  try {
    artworks = await getCollectionArtworks(collectionName, "v02");
  } catch {
    notFound();
  }
  const filtered = artworks.filter((artwork) => isValidArtwork(artwork.title));
  const artwork = filtered.find(
    (item) => slugify(item.title) === artworkSlug
  );

  if (!artwork) {
    notFound();
  }

  const ordered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  const currentIndex = ordered.findIndex(
    (item) => item.artwork_id === artwork.artwork_id
  );
  const otherArtworks = ordered.length > 1
    ? Array.from({ length: Math.min(4, ordered.length - 1) }, (_, index) => {
        const item = ordered[(currentIndex + index + 1) % ordered.length];
        return item;
      })
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        <section className="w-full bg-white pt-12 pb-16 sm:pb-20 lg:pb-[104px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start">
              <div className="artwork-detail-image-container">
                <ArtworkImageModal
                  src={artwork.image_url}
                  alt={artwork.title}
                  title={artwork.title}
                  artist={artwork.artist}
                  year={artwork.year_created}
                />
              </div>

              <div className="flex flex-col gap-4 lg:sticky lg:top-8">
                <h1 className="hero-title">{artwork.title}</h1>
                <p className="governance-description" style={{ marginBottom: 0 }}>
                  {artwork.artist}
                </p>
                <div className="artwork-detail-meta">
                  <p className="artwork-details">
                    Date Painted<br />{artwork.year_created || "Not specified"}
                  </p>
                  <p className="artwork-details">
                    Collection<br />{artwork.collection_name}
                  </p>
                </div>
                <ArtworkInquiryModal
                  artworkTitle={artwork.title}
                  artworkArtist={artwork.artist}
                  artworkCollection={artwork.collection_name}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-white pt-0 pb-16 sm:pb-20 lg:pb-[104px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="section-heading text-center">Other Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
              {otherArtworks.map((item) => (
                <article key={item.artwork_id} className="artwork-card" style={{ width: "100%" }}>
                  <Link
                    href={`/collections/${collectionSlug}/${slugify(item.title)}`}
                    className="artwork-card-button"
                    aria-label={`View details for ${item.title}`}
                  >
                    <div className="artwork-image-wrapper" style={{ aspectRatio: "247 / 206" }}>
                      {item.image_url ? (
                        <ProgressiveImage
                          src={item.image_url}
                          alt={item.title}
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
                    <h3 className="artwork-title">{item.title}</h3>
                    <p className="artwork-details">
                      {item.artist}<br />{item.collection_name}
                    </p>
                  </div>
                </article>
              ))}
            </div>
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
