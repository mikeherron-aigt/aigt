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

async function fetchServer<T>(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return (await response.json()) as T;
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
  return fetchServer<Artwork[]>(
    `/collections/${encodedName}/artworks${query}`
  );
}

export interface ArtworkFilters {
  version?: string;
  collection?: string;
  year?: number;
  limit?: number;
  offset?: number;
  sku?: string;
}

function buildQueryString(filters?: ArtworkFilters): string {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.version) params.append("version", filters.version);
  if (filters.collection) params.append("collection", filters.collection);
  if (filters.year) params.append("year", filters.year.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.offset) params.append("offset", filters.offset.toString());
  if (filters.sku) params.append("sku", filters.sku);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getArtworks(filters?: ArtworkFilters): Promise<Artwork[]> {
  const queryString = buildQueryString(filters);
  return fetchServer<Artwork[]>(`/artworks${queryString}`);
}

export async function getArtwork(id: number): Promise<Artwork> {
  return fetchServer<Artwork>(`/artworks/${id}`);
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
