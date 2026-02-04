import Image from "next/image";

const artworkCards = [
  {
    title: "Cosmic Dreams",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F270bfbf622d44bb58da3863d2d4a1416?format=webp&width=800",
  },
  {
    title: "America In The Making",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F0b223e89165544369065645eb9e01981?format=webp&width=800",
  },
  {
    title: "American Graffiti",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F412947b95d6b487f8e94d9db43269338?format=webp&width=800",
  },
  {
    title: "Dreams and Wonders",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2F41a3331c307447f9a770facf2b3f3f7b?format=webp&width=800",
  },
];

const artworkGrid = Array.from({ length: 24 }, (_, index) => ({
  ...artworkCards[index % artworkCards.length],
  id: index + 1,
}));

export default function CollectionPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <main>
        <section className="collection-hero">
          <div className="collection-hero-inner">
            <div className="collection-hero-copy">
              <h1 className="collection-hero-title">Cosmic Dreams</h1>
              <p className="collection-hero-lede">
                Something about the collection, what is being explored and thought about
                while these pieces were created.
              </p>
              <p className="collection-hero-body">
                The platform is designed to protect the work, preserve provenance, and
                govern participation through clear authority, disciplined process, and
                controlled access.
              </p>
              <p className="collection-hero-quote">
                Quote for the John might be nice
              </p>
            </div>
          </div>
        </section>

        <section className="collection-grid-section">
          <div className="collection-grid-toolbar">
            <div className="collection-sort">
              <span>Sort By:</span>
              <button className="collection-sort-button" type="button">
                Date
                <span className="collection-sort-caret" />
              </button>
            </div>
            <div className="collection-view-toggle" role="group" aria-label="View options">
              <button className="collection-view-button is-active" type="button" aria-label="Grid view">
                <span className="collection-icon-grid" />
              </button>
              <button className="collection-view-button" type="button" aria-label="List view">
                <span className="collection-icon-list" />
              </button>
            </div>
          </div>

          <div className="collection-grid">
            {artworkGrid.map((artwork) => (
              <article key={artwork.id} className="collection-card">
                <div className="collection-card-image">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    width={320}
                    height={240}
                    className="collection-card-img"
                  />
                </div>
                <p className="collection-card-title">{artwork.title}</p>
              </article>
            ))}
          </div>

          <div className="collection-pagination">
            <button className="collection-page-nav" type="button">
              &lt; Previous
            </button>
            <div className="collection-page-numbers">
              <span className="collection-page-number">1</span>
              <span className="collection-page-number">2</span>
              <span className="collection-page-number">3</span>
              <span className="collection-page-number">4</span>
              <span className="collection-page-ellipsis">...</span>
              <span className="collection-page-number">36</span>
            </div>
            <button className="collection-page-nav" type="button">
              Next &gt;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
