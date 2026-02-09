import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";
import { getApiUrl } from "@/app/lib/apiUrl";

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
}

export interface Collection {
  collection_id: number;
  collection_name: string;
  collection_code: string;
  artwork_count: number;
}

export interface ArtworkFilters {
  version?: string;
  collection?: string;
  year?: number;
  limit?: number;
  offset?: number;
  sku?: string;
}

const normalizeArtwork = (artwork: Artwork): Artwork => ({
  ...artwork,
  image_url: normalizeArtworkImageUrl(artwork.image_url),
});

const normalizeArtworks = (artworks: Artwork[]): Artwork[] =>
  artworks.map(normalizeArtwork);

export class APIError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS) {
  responseCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

async function fetchAPI<T>(
  endpoint: string,
  ttlMs = DEFAULT_TTL_MS,
  retries = 2
): Promise<T> {
  const url = getApiUrl(`/api${endpoint}`);
  const cached = getCached<T>(url);
  if (cached) return cached;

  if (pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }

  const requestPromise = (async () => {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        console.log(`[API] Fetching: ${url} (attempt ${attempt + 1}/${retries + 1})`);
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`[API] Error: ${url} returned ${response.status} ${response.statusText}`);
          if (response.status >= 500 && attempt < retries) {
            console.log(`[API] Retrying after ${1000 * (attempt + 1)}ms...`);
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1))
            );
            continue;
          }
          throw new APIError(
            `API request failed: ${response.statusText}`,
            response.status
          );
        }

        const data = (await response.json()) as T;
        console.log(`[API] Success: ${url}`);
        setCached(url, data, ttlMs);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[API] Fetch error for ${url}:`, errorMessage);
        if (attempt === retries) {
          if (error instanceof APIError) {
            throw error;
          }
          throw new APIError(
            "Failed to connect to artwork database. Please try again later."
          );
        }
      }
    }

    throw new APIError("Max retries exceeded");
  })();

  pendingRequests.set(url, requestPromise);

  try {
    return await requestPromise;
  } finally {
    pendingRequests.delete(url);
  }
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
  const data = await fetchAPI<Artwork[]>(`/artworks${queryString}`);
  return normalizeArtworks(data);
}

export async function getArtwork(id: number): Promise<Artwork> {
  const data = await fetchAPI<Artwork>(`/artworks/${id}`);
  return normalizeArtwork(data);
}

export async function getArtworkBySku(sku: string): Promise<Artwork | null> {
  const encodedSku = encodeURIComponent(sku);
  try {
    const results = await fetchAPI<Artwork[]>(`/artworks?sku=${encodedSku}`);
    if (!Array.isArray(results)) return null;
    const normalized = normalizeArtworks(results);
    return normalized[0] || null;
  } catch {
    return null;
  }
}

export async function getCollections(): Promise<Collection[]> {
  return fetchAPI<Collection[]>("/collections");
}

export async function getCollectionArtworks(
  collectionName: string,
  filters?: { version?: string }
): Promise<Artwork[]> {
  const queryString = filters?.version ? `?version=${filters.version}` : "";
  const encodedName = encodeURIComponent(collectionName);
  const data = await fetchAPI<Artwork[]>(`/collections/${encodedName}/artworks${queryString}`);
  return normalizeArtworks(data);
}

export async function getArtworksByVersion(version: string): Promise<Artwork[]> {
  return getArtworks({ version });
}

export async function getArtworksByYear(year: number): Promise<Artwork[]> {
  return getArtworks({ year });
}
