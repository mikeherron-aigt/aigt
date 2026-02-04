import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.ART_API_BASE_URL || "https://art.artigt.com/api/public";

export async function GET() {
  const endpoint = `${API_BASE_URL}/collections`;

  try {
    const response = await fetch(endpoint, { next: { revalidate: 300 } });

    if (!response.ok) {
      return NextResponse.json(
        { message: `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
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
