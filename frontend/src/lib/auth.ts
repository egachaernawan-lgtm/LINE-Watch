import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export function allowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(email?: string | null): boolean {
  return !!email && allowedEmails().includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Email allow-list: anyone else is bounced back to /login?error=AccessDenied.
    async signIn({ user, profile }) {
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified;
      return verified !== false && isAllowed(user.email);
    },
  },
};
