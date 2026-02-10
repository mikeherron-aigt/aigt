import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

// Use direct art.artigt.com URL on Netlify to avoid:
// 1. Netlify API route 403 errors on deploy previews
// 2. Cloudflare bot challenges when proxying server-side
// Browsers can handle Cloudflare challenges, but Netlify's proxy cannot
const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname.includes("netlify.app")
    ? "https://art.artigt.com/api/public"
    : "/api";

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
  versions?: string;
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

type FetchOptions = {
  ttlMs?: number;
  retries?: number;
  baseUrl?: string;
};

async function fetchAPI<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const {
    ttlMs = DEFAULT_TTL_MS,
    retries = 2,
    baseUrl = API_BASE_URL,
  } = options ?? {};
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const cacheKey = `${normalizedBase}${normalizedEndpoint}`;
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

  if (filters.versions) params.append("versions", filters.versions);
  if (filters.collection) params.append("collection", filters.collection);
  if (filters.year) params.append("year", filters.year.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.offset) params.append("offset", filters.offset.toString());
  if (filters.sku) params.append("sku", filters.sku);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getArtworks(
  filters?: ArtworkFilters,
  options?: { baseUrl?: string }
): Promise<Artwork[]> {
  const queryString = buildQueryString(filters);
  const data = await fetchAPI<Artwork[]>(`/artworks${queryString}`, {
    baseUrl: options?.baseUrl,
  });
  return normalizeArtworks(data);
}

export async function getArtwork(id: number): Promise<Artwork> {
  const data = await fetchAPI<Artwork>(`/artworks/${id}`);
  return normalizeArtwork(data);
}

export async function getArtworkBySku(sku: string): Promise<Artwork | null> {
  const encodedSku = encodeURIComponent(sku);
  try {
    const results = await fetchAPI<Artwork[]>(`/artworks/sku/${encodedSku}`);
    const normalized = normalizeArtworks(results);
    return normalized[0] || null;
  } catch {
    return null;
  }
}

export async function getArtworksBySkus(
  skus: string[]
): Promise<Record<string, Artwork | null>> {
  if (skus.length === 0) return {};

  try {
    const param = skus.map(encodeURIComponent).join(",");
    const data = await fetchAPI<Record<string, Artwork>>(
      `/artworks/batch?skus=${param}`
    );

    const result: Record<string, Artwork | null> = {};
    for (const sku of skus) {
      const raw = data[sku] ?? null;
      result[sku] = raw ? normalizeArtwork(raw as Artwork) : null;
    }
    return result;
  } catch {
    // Fallback: return nulls for all SKUs
    const result: Record<string, Artwork | null> = {};
    for (const sku of skus) {
      result[sku] = null;
    }
    return result;
  }
}

export interface HomePageData {
  bySkus: Record<string, Artwork | null>;
  artworks: Artwork[];
}

export async function getHomePageData(
  skus: string[],
  filters?: { versions?: string; limit?: number }
): Promise<HomePageData> {
  const params = new URLSearchParams();

  if (skus.length > 0) {
    params.set("skus", skus.map(encodeURIComponent).join(","));
  }
  if (filters?.versions) {
    params.set("versions", filters.versions);
  }
  if (filters?.limit) {
    params.set("limit", filters.limit.toString());
  }

  const query = params.toString();

  try {
    const data = await fetchAPI<{
      bySkus: Record<string, Artwork>;
      artworks?: Artwork[];
    }>(`/artworks/batch?${query}`);

    const bySkus: Record<string, Artwork | null> = {};
    for (const sku of skus) {
      const raw = data.bySkus?.[sku] ?? null;
      bySkus[sku] = raw ? normalizeArtwork(raw) : null;
    }

    const artworks = data.artworks ? normalizeArtworks(data.artworks) : [];

    return { bySkus, artworks };
  } catch {
    const bySkus: Record<string, Artwork | null> = {};
    for (const sku of skus) {
      bySkus[sku] = null;
    }
    return { bySkus, artworks: [] };
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
  return getArtworks({ versions: version });
}

export async function getArtworksByYear(year: number): Promise<Artwork[]> {
  return getArtworks({ year });
}
