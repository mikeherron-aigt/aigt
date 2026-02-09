import { NextResponse } from "next/server";
import { getArtworks, type ArtworkFilters } from "@/app/lib/artApiServer";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const filters: ArtworkFilters = {};

  const version = params.get("version");
  const collection = params.get("collection");
  const year = params.get("year");
  const limit = params.get("limit");
  const offset = params.get("offset");
  const sku = params.get("sku");

  if (version) filters.version = version;
  if (collection) filters.collection = collection;
  if (year) {
    const parsedYear = Number.parseInt(year, 10);
    if (!Number.isNaN(parsedYear)) filters.year = parsedYear;
  }
  if (limit) {
    const parsedLimit = Number.parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit)) filters.limit = parsedLimit;
  }
  if (offset) {
    const parsedOffset = Number.parseInt(offset, 10);
    if (!Number.isNaN(parsedOffset)) filters.offset = parsedOffset;
  }
  if (sku) filters.sku = sku;

  try {
    const data = await getArtworks(filters);
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
