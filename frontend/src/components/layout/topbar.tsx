"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

export function Topbar({ title, back, actions }: { title: string; back?: boolean; actions?: ReactNode }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/feed?q=${encodeURIComponent(query)}` : "/feed");
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-8">
      {back && (
        <button aria-label="Back" onClick={() => router.back()} className="rounded-md p-2 hover:bg-black/5">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{title}</h1>
      {actions}
      <form onSubmit={submit} className="relative hidden w-80 sm:block" role="search">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search headlines and articles"
          aria-label="Search articles"
          className="h-9 w-full rounded-md bg-gray-100 pl-9 pr-3 text-sm outline-none ring-0 focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand"
        />
      </form>
    </header>
  );
}
