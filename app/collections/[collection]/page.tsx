import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionArtworks, getCollections, type Artwork } from "@/app/lib/artApiServer";
import { slugify } from "@/app/lib/slug";
import { ProgressiveImage } from "@/app/components/ProgressiveImage";
import { ProtectedImage } from "@/app/components/ProtectedImage";

const PAGE_SIZE = 16;

const isValidArtwork = (title: string) =>
  !title.toLowerCase().includes("untitled");

const sortOptions = [
  { value: "year-desc", label: "Date (Newest)" },
  { value: "year-asc", label: "Date (Oldest)" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

const compareNumbers = (a: number, b: number) => a - b;
const compareStrings = (a: string, b: string) => a.localeCompare(b);

const collectionHeroParagraphs: Record<string, string> = {
  "A Miracle in the Making":
    "A Miracle in the Making explores transformation in motion. Each work begins as an original photograph, then evolves through layered design, color, and form, capturing the moment where reality gives way to imagination. The result is immersive and expressive, turning lived experience into something elevated, symbolic, and quietly powerful.",
  "American Graffiti":
    "American Graffiti is bold, kinetic, and unapologetically modern. Drawing from the language of the street, these works pulse with movement, rhythm, and controlled chaos, blending raw energy with intentional structure. It is a collection that feels alive, built for collectors drawn to intensity, momentum, and cultural edge.",
  "Cosmic Dreams":
    "Cosmic Dreams invites viewers into a fully imagined universe. Rooted in classical technique yet driven by futuristic vision, these works feel cinematic and timeless, weaving mythology, symbolism, and surreal narrative into a single evolving world. Each piece stands as both artwork and chapter, offering collectors entry into a much larger story.",
  "Dreams and Wonders":
    "Dreams and Wonders is the purest expression of the studio practice. Each painting is a one of one, created without repetition and never revisited. These works are intimate, painterly, and singular, designed for collectors who value originality, craftsmanship, and the quiet power of owning something that exists nowhere else.",
};

const getPageRange = (current: number, total: number) => {
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ sort?: string; page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const collectionSlug = resolvedParams.collection;
  const collections = await getCollections();
  const matchedCollection = collections.find(
    (collection) => slugify(collection.collection_name) === collectionSlug
  );

  if (!matchedCollection) {
    notFound();
  }

  const collectionName = matchedCollection.collection_name;
  const sort = resolvedSearchParams?.sort || "year-desc";
  const page = Math.max(1, Number(resolvedSearchParams?.page || 1));

  let artworks: Artwork[] = [];
  try {
    artworks = await getCollectionArtworks(collectionName, "v02");
  } catch {
    notFound();
  }
  const filtered = artworks.filter((artwork) => isValidArtwork(artwork.title));

  if (!artworks.length) {
    notFound();
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "year-asc") {
      return compareNumbers(a.year_created || 0, b.year_created || 0);
    }
    if (sort === "year-desc") {
      return compareNumbers(b.year_created || 0, a.year_created || 0);
    }
    if (sort === "title-desc") {
      return compareStrings(b.title, a.title);
    }
    return compareStrings(a.title, b.title);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);
  const heroArtwork = sorted[0];
  const heroArtworkHref = heroArtwork
    ? `/collections/${collectionSlug}/${slugify(heroArtwork.title)}`
    : null;
  const pageRange = getPageRange(currentPage, totalPages);
  const heroParagraph = collectionHeroParagraphs[collectionName];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        <section className="w-full" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-24 flex flex-col">
                <div className="max-w-[579px]">
                  <h1 className="hero-title">{collectionName}</h1>
                  {heroParagraph ? (
                    <p className="governance-description">{heroParagraph}</p>
                  ) : null}
                </div>
              </div>

              <div className="relative w-full h-full overflow-hidden min-h-[520px]">
                {heroArtwork?.image_url ? (
                  heroArtworkHref ? (
                    <Link
                      href={heroArtworkHref}
                      aria-label={`View details for ${heroArtwork.title}`}
                      className="absolute inset-0"
                    >
                      <ProtectedImage
                        src={heroArtwork.image_url}
                        alt={heroArtwork.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </Link>
                  ) : (
                    <div className="absolute inset-0">
                      <ProtectedImage
                        src={heroArtwork.image_url}
                        alt={heroArtwork.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  )
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
            <div className="collection-toolbar">
              <form className="collection-sort" method="get">
                <label htmlFor="sort" className="collection-sort-label">
                  Sort By:
                </label>
                <select id="sort" name="sort" className="collection-sort-select" defaultValue={sort}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="page" value="1" />
                <button className="collection-sort-button" type="submit">
                  Apply
                </button>
              </form>
            </div>

            {sorted.length === 0 ? (
              <div className="mt-8">
                <p className="governance-description">
                  No artworks match the current filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
                  {pageItems.map((artwork) => (
                    <article key={artwork.artwork_id} className="artwork-card" style={{ width: "100%" }}>
                      <Link
                        href={`/collections/${collectionSlug}/${slugify(artwork.title)}`}
                        className="artwork-card-button"
                        aria-label={`View details for ${artwork.title}`}
                      >
                        <div className="artwork-image-wrapper" style={{ aspectRatio: "247 / 206" }}>
                          {artwork.image_url ? (
                            <ProgressiveImage
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
                      </Link>
                      <div className="artwork-info">
                        <h3 className="artwork-title">{artwork.title}</h3>
                        <p className="artwork-details">
                          {artwork.artist}<br />{artwork.collection_name}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="collection-pagination">
                  <Link
                    className={`collection-page-link ${currentPage === 1 ? "is-disabled" : ""}`}
                    href={`?sort=${sort}&page=${Math.max(1, currentPage - 1)}`}
                    aria-disabled={currentPage === 1}
                  >
                    &lt; Previous
                  </Link>
                  <div className="collection-page-numbers">
                    {pageRange.map((pageNumber, index) => {
                      const previousPage = pageRange[index - 1];
                      const showEllipsis = previousPage && pageNumber - previousPage > 1;

                      return (
                        <span key={pageNumber} className="collection-page-group">
                          {showEllipsis ? (
                            <span className="collection-page-ellipsis">...</span>
                          ) : null}
                          <Link
                            href={`?sort=${sort}&page=${pageNumber}`}
                            className={`collection-page-link ${
                              pageNumber === currentPage ? "is-active" : ""
                            }`}
                          >
                            {pageNumber}
                          </Link>
                        </span>
                      );
                    })}
                  </div>
                  <Link
                    className={`collection-page-link ${currentPage === totalPages ? "is-disabled" : ""}`}
                    href={`?sort=${sort}&page=${Math.min(totalPages, currentPage + 1)}`}
                    aria-disabled={currentPage === totalPages}
                  >
                    Next &gt;
                  </Link>
                </div>
              </>
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
