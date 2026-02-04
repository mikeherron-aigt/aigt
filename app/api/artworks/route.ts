import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.ART_API_BASE_URL || "https://art.artigt.com/api/public";

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
    const response = await fetch(endpoint, { next: { revalidate: 300 } });

    if (!response.ok) {
      return NextResponse.json(
        { message: `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    let data = await response.json();

    // Apply limit/offset on the proxy side
    if (Array.isArray(data)) {
      const start = offset ?? 0;
      if (limit != null) {
        data = data.slice(start, start + limit);
      } else if (start > 0) {
        data = data.slice(start);
      }
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to connect to artwork database. Please try again later." },
      { status: 502 }
    );
  }
}
