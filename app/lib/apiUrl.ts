/**
 * API URL helper for constructing full API URLs across different environments.
 *
 * Uses NEXT_PUBLIC_REACT_API_BASE_URL environment variable to determine the API base URL.
 * Falls back to http://localhost:3002 for local development if the env var isn't set.
 *
 * Environment setup:
 * - Local development: No env var needed (uses localhost:3002)
 * - Netlify/Production: Set NEXT_PUBLIC_REACT_API_BASE_URL=https://art.artigt.com
 *
 * Note: The NEXT_PUBLIC_ prefix is required for the env var to be available
 * on the client side in Next.js.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_REACT_API_BASE_URL || "http://localhost:3002";

/**
 * Constructs a full API URL from a path.
 *
 * @param path - The API endpoint path (e.g., "/api/artworks" or "api/artworks")
 * @returns The full API URL
 *
 * @example
 * // In local development (no env var set):
 * getApiUrl('/api/artworks') // => 'http://localhost:3002/api/artworks'
 * getApiUrl('api/artworks')  // => 'http://localhost:3002/api/artworks'
 *
 * // In production (NEXT_PUBLIC_API_BASE_URL=https://art.artigt.com):
 * getApiUrl('/api/artworks') // => 'https://art.artigt.com/api/artworks'
 */
export function getApiUrl(path: string): string {
  // Normalize the path to ensure consistent formatting
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Remove trailing slash from base URL if present to avoid double slashes
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${normalizedBase}${normalizedPath}`;
}
