/**
 * API URL helper for constructing full API URLs across different environments.
 *
 * Uses NEXT_PUBLIC_REACT_API_BASE_URL environment variable to determine the API base URL.
 *
 * Environment setup:
 * - Local development: Set NEXT_PUBLIC_REACT_API_BASE_URL=http://localhost:3002
 * - Netlify/Production: No env var needed - uses relative paths with Netlify redirects
 *   (netlify.toml proxies /api/* to https://art.artigt.com/api/public/*)
 *
 * Note: The NEXT_PUBLIC_ prefix is required for the env var to be available
 * on the client side in Next.js.
 */

/**
 * Determines the API base URL based on environment.
 * - If NEXT_PUBLIC_REACT_API_BASE_URL is set, use it
 * - In browser on non-localhost: use empty string (relative paths for Netlify redirect)
 * - Server-side or localhost without env var: use localhost:3002 for development
 */
function getApiBaseUrl(): string {
  // If env var is explicitly set, use it
  if (process.env.NEXT_PUBLIC_REACT_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_REACT_API_BASE_URL;
  }

  // In browser on production host, use relative paths (Netlify redirect handles it)
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "";
  }

  // Development fallback
  return "http://localhost:3002";
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * Checks if the current environment is using the production API.
 * Production API requires /api/public/ paths instead of /api/.
 * When using relative paths (empty base URL), Netlify redirect handles the transformation.
 */
const isProductionApi = API_BASE_URL !== "" && !API_BASE_URL.includes("localhost");

/**
 * Constructs a full API URL from a path.
 * - For production with explicit API URL: transforms /api/ to /api/public/
 * - For Netlify (empty base URL): uses relative /api/* paths (Netlify redirects to /api/public/*)
 * - For local development: uses localhost:3002 with /api/ paths
 *
 * @param path - The API endpoint path (e.g., "/api/artworks" or "api/artworks")
 * @returns The full API URL
 *
 * @example
 * // In local development (NEXT_PUBLIC_REACT_API_BASE_URL=http://localhost:3002):
 * getApiUrl('/api/artworks') // => 'http://localhost:3002/api/artworks'
 *
 * // On Netlify (no env var, uses relative paths):
 * getApiUrl('/api/artworks') // => '/api/artworks' (Netlify redirects to art.artigt.com/api/public/artworks)
 *
 * // With explicit production URL (NEXT_PUBLIC_REACT_API_BASE_URL=https://art.artigt.com):
 * getApiUrl('/api/artworks') // => 'https://art.artigt.com/api/public/artworks'
 */
export function getApiUrl(path: string): string {
  // Normalize the path to ensure it starts with a slash
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // For production API with explicit URL, transform /api/ to /api/public/
  // This handles paths like /api/artworks -> /api/public/artworks
  // Note: When using relative paths (empty base), Netlify redirect handles this transformation
  if (isProductionApi) {
    if (normalizedPath.startsWith("/api/") && !normalizedPath.startsWith("/api/public/")) {
      normalizedPath = normalizedPath.replace("/api/", "/api/public/");
    } else if (normalizedPath === "/api") {
      normalizedPath = "/api/public";
    }
  }

  // If no base URL (relative paths for Netlify), just return the path
  if (API_BASE_URL === "") {
    return normalizedPath;
  }

  // Remove trailing slash from base URL if present to avoid double slashes
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${normalizedBase}${normalizedPath}`;
}
