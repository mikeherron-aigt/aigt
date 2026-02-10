import { NextRequest, NextResponse } from "next/server";

/**
 * Same-origin image proxy.
 *
 * Usage: /api/img?url=<canonical-image-url>&w=<optional-width>
 *
 * The browser only ever requests images from *this* domain, so there are
 * no CORS issues.  The server fetches the remote image, optionally
 * negotiates width via the upstream `width` query-param, and returns it
 * with aggressive cache headers.
 */

const ALLOWED_HOSTS = ["image.artigt.com"];
const MAX_WIDTH = 4096;
const CACHE_SECONDS = 60 * 60; // 1 hour edge-cache

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get("url");
  const width = searchParams.get("w");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  // Forward a width hint to the upstream server if requested
  if (width) {
    const w = Math.min(parseInt(width, 10) || 0, MAX_WIDTH);
    if (w > 0) {
      parsed.searchParams.set("width", String(w));
    }
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      next: { revalidate: CACHE_SECONDS },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIGT-App/1.0)",
      },
    });

    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "image/webp";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch upstream image" },
      { status: 502 }
    );
  }
}
