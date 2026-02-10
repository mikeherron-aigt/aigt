import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.ART_API_BASE_URL || "https://art.artigt.com/api/public";

interface UpstreamArtwork {
  sku: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const skusParam = request.nextUrl.searchParams.get("skus");
  const versionsParam = request.nextUrl.searchParams.get("versions");
  const limitParam = request.nextUrl.searchParams.get("limit");

  if (!skusParam && !versionsParam) {
    return NextResponse.json(
      { message: "Provide 'skus' and/or 'versions' query parameters" },
      { status: 400 }
    );
  }

  const requestedSkus = skusParam
    ? skusParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  try {
    // Build the upstream URL — if a versions filter is requested, include it so
    // the upstream can do its own filtering. When only SKUs are requested we
    // need the full unfiltered list.
    const needsUnfiltered = requestedSkus.length > 0;
    const upstreamUrl = needsUnfiltered
      ? `${API_BASE_URL}/artworks`
      : `${API_BASE_URL}/artworks${versionsParam ? `?versions=${encodeURIComponent(versionsParam)}` : ""}`;

    const response = await fetch(upstreamUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const allArtworks: UpstreamArtwork[] = await response.json();

    // SKU lookup
    const skuSet = new Set(requestedSkus);
    const bySkus: Record<string, UpstreamArtwork> = {};
    for (const artwork of allArtworks) {
      if (skuSet.has(artwork.sku)) {
        bySkus[artwork.sku] = artwork;
      }
    }

    // Filtered artworks list (versions + limit)
    let artworks: UpstreamArtwork[] | undefined;
    if (versionsParam) {
      if (needsUnfiltered) {
        // Filter in-memory using the `version` field returned by the upstream API.
        artworks = allArtworks.filter(
          (a) => (a as { version?: string }).version === versionsParam
        );
      } else {
        artworks = allArtworks;
      }

      if (artworks && limitParam) {
        const limit = parseInt(limitParam, 10);
        if (limit > 0) {
          artworks = artworks.slice(0, limit);
        }
      }
    }

    const result: {
      bySkus: Record<string, UpstreamArtwork>;
      artworks?: UpstreamArtwork[];
    } = { bySkus };

    if (artworks !== undefined) {
      result.artworks = artworks;
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to artwork database. Please try again later." },
      { status: 502 }
    );
  }
}
