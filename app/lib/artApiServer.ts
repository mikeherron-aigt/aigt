import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

const API_BASE_URL =
  process.env.ART_API_BASE_URL || "https://art.artigt.com/api/public";

export interface Artwork {
  artwork_id: number;
  sku: string;
  title: string;
  artist: string;
  short_description: string | null;
  review: string | null;
  year_created: number;
  collection_name: string;
  image_url: string;
  version?: string;
}

export interface Collection {
  collection_id: number;
  collection_name: string;
  collection_code: string;
  artwork_count: number;
}

const normalizeArtwork = (artwork: Artwork): Artwork => ({
  ...artwork,
  image_url: normalizeArtworkImageUrl(artwork.image_url),
});

const normalizeArtworks = (artworks: Artwork[]): Artwork[] =>
  artworks.map(normalizeArtwork);

async function fetchServer<T>(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}\nURL: ${url}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export async function getCollections(): Promise<Collection[]> {
  return fetchServer<Collection[]>("/collections");
}

export async function getCollectionArtworks(
  collectionName: string,
  version?: string
): Promise<Artwork[]> {
  const encodedName = encodeURIComponent(collectionName);
  const query = version ? `?version=${encodeURIComponent(version)}` : "";
  const data = await fetchServer<Artwork[]>(
    `/collections/${encodedName}/artworks${query}`
  );
  return normalizeArtworks(data);
}

/**
 * Fetch a small pool of artworks from a collection for display purposes.
 * Instead of loading the entire collection (which can be 2000+ items),
 * this returns at most `poolSize` artworks, enabling lightweight random
 * selection on the caller side.
 */
export async function getCollectionArtworkPool(
  collectionName: string,
  poolSize: number = 24
): Promise<Artwork[]> {
  const all = await getCollectionArtworks(collectionName, "v02");
  return all.slice(0, poolSize);
}

export interface ArtworkFilters {
  versions?: string;
  collection?: string;
  year?: number;
  limit?: number;
  offset?: number;
  sku?: string;
}

function buildQueryString(filters?: ArtworkFilters): string {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.versions) params.append("versions", filters.versions);
  if (filters.collection) params.append("collection", filters.collection);
  if (filters.year) params.append("year", filters.year.toString());
  if (filters.sku) params.append("sku", filters.sku);
  // Note: limit and offset are not supported by the upstream API
  // They are applied after fetching in getArtworks()

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getArtworks(filters?: ArtworkFilters): Promise<Artwork[]> {
  const queryString = buildQueryString(filters);
  let data = await fetchServer<Artwork[]>(`/artworks${queryString}`);

  // Apply limit/offset on the application side since the upstream API doesn't support them
  if (filters) {
    const start = filters.offset ?? 0;
    if (filters.limit != null) {
      data = data.slice(start, start + filters.limit);
    } else if (start > 0) {
      data = data.slice(start);
    }
  }

  return normalizeArtworks(data);
}

export async function getArtwork(id: number): Promise<Artwork> {
  const data = await fetchServer<Artwork>(`/artworks/${id}`);
  return normalizeArtwork(data);
}

const FEATURED_COLLECTION_CODES = ["AG", "CD", "MM", "DW"] as const;
const ARTWORKS_PER_COLLECTION = 3;

function extractCollectionCode(sku: string): string | null {
  const match = sku.match(/^\d{4}-[A-Z]+-([A-Z]+)-\d+$/);
  return match ? match[1] : null;
}

export interface HomePageData {
  bySkus: Record<string, Artwork | null>;
  featuredArtworks: Artwork[];
}

/**
 * Fetches all data needed for the homepage in two parallel upstream requests:
 * 1. All artworks (unfiltered) — for specific SKU lookup (hero, governance, etc.)
 * 2. v02 artworks — grouped by collection, 10 from each of AG, CD, MM, DW
 */
export async function getHomePageData(skus: string[]): Promise<HomePageData> {
  const [allArtworks, v02Artworks] = await Promise.all([
    fetchServer<Artwork[]>("/artworks"),
    fetchServer<Artwork[]>("/artworks?versions=v02"),
  ]);

  // Build SKU lookup from the unfiltered list
  const skuSet = new Set(skus);
  const bySkus: Record<string, Artwork | null> = {};
  for (const sku of skus) bySkus[sku] = null;
  for (const artwork of allArtworks) {
    if (skuSet.has(artwork.sku)) {
      bySkus[artwork.sku] = normalizeArtwork(artwork);
    }
  }

  // Featured artworks: up to 3 per collection from AG, CD, MM, DW, shuffled
  const byCollection = new Map<string, Artwork[]>();
  for (const code of FEATURED_COLLECTION_CODES) {
    byCollection.set(code, []);
  }
  for (const artwork of normalizeArtworks(v02Artworks)) {
    const code = extractCollectionCode(artwork.sku);
    if (code && byCollection.has(code)) {
      const list = byCollection.get(code)!;
      if (list.length < ARTWORKS_PER_COLLECTION) list.push(artwork);
    }
  }
  const featuredArtworks = Array.from(byCollection.values()).flat();
  for (let i = featuredArtworks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [featuredArtworks[i], featuredArtworks[j]] = [featuredArtworks[j], featuredArtworks[i]];
  }

  return { bySkus, featuredArtworks };
}

export async function getArtworkBySku(sku: string): Promise<Artwork | null> {
  try {
    // Try fetching with SKU filter first
    const results = await getArtworks({ sku, limit: 1 });

    // Check if the backend properly filtered by SKU
    if (results.length > 0 && results[0].sku === sku) {
      return results[0];
    }

    // Fallback: Backend doesn't support SKU filtering, fetch all and filter server-side
    console.warn(`Backend API not filtering by SKU. Fetching all artworks and filtering server-side for SKU: ${sku}`);
    const allArtworks = await getArtworks({ limit: 3000 }); // Fetch a large batch
    const match = allArtworks.find(artwork => artwork.sku === sku);
    return match || null;
  } catch (error) {
    console.error(`Error fetching artwork with SKU ${sku}:`, error);
    return null;
  }
}
