import { NextResponse, type NextFetchEvent } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

const authed = withAuth({ pages: { signIn: "/login" } });

export default function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  // Demo deployment is public and read-only; local UI work can skip Google via DEV_AUTH_BYPASS (`next dev` only).
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || (process.env.NODE_ENV === "development" && process.env.DEV_AUTH_BYPASS === "true")) {
    return NextResponse.next();
  }
  return authed(req, event);
}

export const config = {
  // Everything except the login page, auth endpoints and static assets requires a session.
  matcher: ["/((?!login|api/auth|_next/static|_next/image|fonts|favicon.ico).*)"],
};
