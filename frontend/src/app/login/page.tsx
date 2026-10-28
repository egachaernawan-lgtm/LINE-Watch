"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { demoMode } from "@/lib/demo";

function LoginCard() {
  const error = useSearchParams().get("error");
  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center">
      <div className="text-[28px] font-extrabold">
        LINE <span className="text-brand">Watch</span>
      </div>
      <p className="mt-2 text-sm text-gray-700">AI media monitoring for LINE Indonesia</p>
      {error && (
        <p role="alert" className="mt-5 rounded-md bg-error-tint p-3 text-sm text-error">
          {error === "AccessDenied" ? "This Google account is not on the access list. Ask an admin to add your email." : "Sign-in failed. Please try again."}
        </p>
      )}
      {demoMode ? (
        <>
          <p className="mt-5 text-sm text-gray-700">Demo with real articles collected from Indonesian media. Read-only, no sign-in needed.</p>
          <Link href="/feed" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-brand font-bold text-white hover:bg-brand-pressed hover:no-underline">
            Enter demo
          </Link>
        </>
      ) : (
        <Button className="mt-6 w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign in with Google
        </Button>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
