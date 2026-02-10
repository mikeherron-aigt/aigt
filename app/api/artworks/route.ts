import { NextResponse } from "next/server";
import { normalizeArtworkImageUrl } from "@/app/lib/imageUrl";

const API_BASE_URL =
  process.env.ART_API_BASE_URL || "https://art.artigt.com/api/public";

interface Artwork {
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

const normalizeArtwork = (artwork: Artwork): Artwork => ({
  ...artwork,
  image_url: normalizeArtworkImageUrl(artwork.image_url),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);

  // Extract limit/offset before forwarding — the upstream API doesn't support them
  const limit = params.get("limit") ? parseInt(params.get("limit")!, 10) : null;
  const offset = params.get("offset")
    ? parseInt(params.get("offset")!, 10)
    : null;
  params.delete("limit");
  params.delete("offset");

  const query = params.toString();
  const endpoint = `${API_BASE_URL}/artworks${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    let data = await response.json();

    // Normalize artwork image URLs to unwrap image-proxy URLs
    if (Array.isArray(data)) {
      data = data.map(normalizeArtwork);

      // Apply limit/offset on the proxy side
      const start = offset ?? 0;
      if (limit != null) {
        data = data.slice(start, start + limit);
      } else if (start > 0) {
        data = data.slice(start);
      }
    } else if (data && typeof data === 'object' && 'image_url' in data) {
      // Handle single artwork responses
      data = normalizeArtwork(data);
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to artwork database. Please try again later." },
      { status: 502 }
    );
  }
}
