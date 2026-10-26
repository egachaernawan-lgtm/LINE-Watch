import { NextResponse, type NextFetchEvent } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

const authed = withAuth({ pages: { signIn: "/login" } });

export default function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  // Local UI work without Google credentials; ignored outside `next dev`.
  if (process.env.NODE_ENV === "development" && process.env.DEV_AUTH_BYPASS === "true") {
    return NextResponse.next();
  }
  return authed(req, event);
}

export const config = {
  // Everything except the login page, auth endpoints and static assets requires a session.
  matcher: ["/((?!login|api/auth|_next/static|_next/image|fonts|favicon.ico).*)"],
};
