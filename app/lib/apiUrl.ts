/**
 * API URL helper for constructing full API URLs across different environments.
 *
 * Uses NEXT_PUBLIC_REACT_API_BASE_URL environment variable to determine the API base URL.
 * Falls back to http://localhost:3002 for local development if the env var isn't set.
 *
 * Environment setup:
 * - Local development: No env var needed (uses localhost:3002, paths use /api/)
 * - Netlify/Production: Set NEXT_PUBLIC_REACT_API_BASE_URL=https://art.artigt.com
 *   (paths are automatically transformed to use /api/public/)
 *
 * Note: The NEXT_PUBLIC_ prefix is required for the env var to be available
 * on the client side in Next.js.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_REACT_API_BASE_URL || "http://localhost:3002";

/**
 * Checks if the current environment is using the production API.
 * Production API requires /api/public/ paths instead of /api/.
 */
const isProductionApi = !API_BASE_URL.includes("localhost");

/**
 * Constructs a full API URL from a path.
 * Automatically handles the /api/ to /api/public/ transformation for production.
 *
 * @param path - The API endpoint path (e.g., "/api/artworks" or "api/artworks")
 * @returns The full API URL
 *
 * @example
 * // In local development (no env var set):
 * getApiUrl('/api/artworks') // => 'http://localhost:3002/api/artworks'
 *
 * // In production (NEXT_PUBLIC_REACT_API_BASE_URL=https://art.artigt.com):
 * getApiUrl('/api/artworks') // => 'https://art.artigt.com/api/public/artworks'
 */
export function getApiUrl(path: string): string {
  // Normalize the path to ensure it starts with a slash
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // For production API, transform /api/ to /api/public/
  // This handles paths like /api/artworks -> /api/public/artworks
  if (isProductionApi) {
    if (normalizedPath.startsWith("/api/") && !normalizedPath.startsWith("/api/public/")) {
      normalizedPath = normalizedPath.replace("/api/", "/api/public/");
    } else if (normalizedPath === "/api") {
      normalizedPath = "/api/public";
    }
  }

  // Remove trailing slash from base URL if present to avoid double slashes
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${normalizedBase}${normalizedPath}`;
}
