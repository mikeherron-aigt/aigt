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

  // DEBUG: Log incoming request
  console.log("[/api/img] Incoming request:", {
    rawUrl,
    width,
    fullUrl: request.url,
  });

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

  const upstreamUrl = parsed.toString();
  console.log("[/api/img] Fetching upstream:", upstreamUrl);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(upstreamUrl, {
      signal: controller.signal,
      cache: "no-store", // Disable Next.js Data Cache to prevent cache key collisions
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIGT-App/1.0)",
      },
    });
    clearTimeout(timeoutId);

    console.log("[/api/img] Upstream response:", {
      status: upstream.status,
      contentType: upstream.headers.get("content-type"),
      contentLength: upstream.headers.get("content-length"),
    });

    if (!upstream.ok) {
      console.log("[/api/img] Upstream error:", upstream.status);
      return new NextResponse(null, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "image/webp";
    const body = await upstream.arrayBuffer();

    // DEBUG: Log response details
    console.log("[/api/img] Returning image:", {
      size: body.byteLength,
      contentType,
      // First 32 bytes as hex for debugging
      preview: Buffer.from(body.slice(0, 32)).toString("hex"),
    });

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
        "X-Image-Size": String(body.byteLength),
        "X-Upstream-Url": upstreamUrl,
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("[/api/img] Error:", err);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Upstream image request timed out" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch upstream image" },
      { status: 502 }
    );
  }
}
