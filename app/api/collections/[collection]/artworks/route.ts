import { NextRequest, NextResponse } from "next/server";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const url = request.nextUrl;
  const query = url.searchParams.toString();
  const encodedName = encodeURIComponent(collection);
  const endpoint = `${API_BASE_URL}/collections/${encodedName}/artworks${
    query ? `?${query}` : ""
  }`;

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
