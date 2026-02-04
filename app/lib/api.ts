const API_BASE_URL = "/api";

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
  const cacheKey = `${API_BASE_URL}${endpoint}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  const requestPromise = (async () => {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(cacheKey);

        if (!response.ok) {
          if (response.status >= 500 && attempt < retries) {
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
        setCached(cacheKey, data, ttlMs);
        return data;
      } catch (error) {
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

  pendingRequests.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    pendingRequests.delete(cacheKey);
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
  return fetchAPI<Artwork[]>(`/artworks${queryString}`);
}

export async function getArtwork(id: number): Promise<Artwork> {
  return fetchAPI<Artwork>(`/artworks/${id}`);
}

export async function getArtworkBySku(sku: string): Promise<Artwork | null> {
  const encodedSku = encodeURIComponent(sku);
  try {
    const results = await fetchAPI<Artwork[]>(`/artworks/sku/${encodedSku}`);
    return results[0] || null;
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
  return fetchAPI<Artwork[]>(`/collections/${encodedName}/artworks${queryString}`);
}

export async function getArtworksByVersion(version: string): Promise<Artwork[]> {
  return getArtworks({ version });
}

export async function getArtworksByYear(year: number): Promise<Artwork[]> {
  return getArtworks({ year });
}
