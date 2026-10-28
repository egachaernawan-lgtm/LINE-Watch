"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { demoMode } from "@/lib/demo";
import { formatDateTime } from "@/lib/format";

export function DemoBanner() {
  const { data } = useQuery({ queryKey: ["meta"], queryFn: () => api<{ generated_at: string | null; articles: number }>("meta"), enabled: demoMode });
  if (!demoMode) return null;
  return (
    <div className="bg-brand-tint px-4 py-2 text-center text-xs text-brand-dark lg:px-8">
      <b>Demo</b> · real articles from Indonesian media, analysed by AI
      {data?.generated_at && <> · snapshot of {formatDateTime(data.generated_at)} ({data.articles} articles)</>} · read-only
    </div>
  );
}
