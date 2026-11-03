import { NextResponse } from "next/server";

import { demoMode } from "@/lib/demo";
import { fetchLatest } from "@/lib/live-fetch";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Demo deployment only. Public and unauthenticated, so it is kept cheap: the CDN reuses one answer for two
// minutes (a crowd clicking at once triggers one round of publisher requests, not one per person), and it
// only ever reads public feeds. It needs no keys and sends nothing anywhere.
export async function GET() {
  if (!demoMode) return NextResponse.json({ detail: "Not found" }, { status: 404 });
  try {
    return NextResponse.json(await fetchLatest(), {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ detail: "The media feeds could not be read right now" }, { status: 502 });
  }
}
