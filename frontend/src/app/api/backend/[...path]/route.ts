import { SignJWT } from "jose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions, isAllowed } from "@/lib/auth";
import { devAuthBypass } from "@/lib/dev";

// Same-origin proxy: the browser never sees the backend token. Each request is signed for 60 s
// with the secret shared with the FastAPI backend, which re-checks the e-mail allow-list.
async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const session = await getServerSession(authOptions);
  const email = devAuthBypass ? "dev@local" : session?.user?.email;
  if (!email || (!devAuthBypass && !isAllowed(email))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setExpirationTime("60s")
    .sign(new TextEncoder().encode(process.env.BACKEND_JWT_SECRET ?? ""));

  const { path } = await params;
  const url = new URL(`/api/v1/${path.join("/")}`, process.env.BACKEND_URL);
  url.search = req.nextUrl.search;

  const upstream = await fetch(url, {
    method: req.method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    cache: "no-store",
  });
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}

export { proxy as GET, proxy as POST, proxy as PATCH };
