"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { api } from "@/lib/api";
import { CATEGORY_LABEL } from "@/lib/format";
import type { ArticlePage, Category } from "@/types/api";

import { ArticleCard } from "./article-card";

const PAGE_SIZE = 20;
const PERIODS = [
  { value: "1", label: "24 hours" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "all", label: "All time" },
];

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-900 outline-none focus:border-brand"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Article feed with filters kept in the URL. `fixedCategory` pins it to one coverage area. */
export function FeedView({ fixedCategory }: { fixedCategory?: Category }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const get = (key: string) => params.get(key) ?? "";
  const category = fixedCategory ?? get("category");
  const period = params.has("days") ? get("days") : "7";
  const page = Math.max(1, Number(get("page")) || 1);

  function set(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) (v ? next.set(k, v) : next.delete(k));
    if (!("page" in updates)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  }

  const { data: media } = useQuery({ queryKey: ["media"], queryFn: () => api<string[]>("articles/media") });

  const filters = {
    category,
    sentiment: get("sentiment"),
    importance: get("importance"),
    media: get("media"),
    company: get("company"),
    q: get("q"),
    date_from: period !== "all" ? new Date(Date.now() - Number(period) * 86_400_000).toISOString() : "",
  };
  const { data, isLoading, error } = useQuery({
    // date_from changes every render, so key on the period instead
    queryKey: ["articles", { ...filters, date_from: period }, page],
    queryFn: () => api<ArticlePage>("articles", { ...filters, page, page_size: PAGE_SIZE }),
    refetchInterval: 60_000, // the collector runs every 15 minutes; keep the feed fresh
    placeholderData: (prev) => prev,
  });

  const active = [
    get("q") && { key: "q", label: `“${get("q")}”` },
    get("sentiment") && { key: "sentiment", label: get("sentiment").toLowerCase() },
    get("importance") && { key: "importance", label: `${get("importance").toLowerCase()} importance` },
    get("media") && { key: "media", label: get("media") },
    get("company") && { key: "company", label: get("company") },
  ].filter(Boolean) as { key: string; label: string }[];

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-2 p-3">
        {!fixedCategory && (
          <Select
            label="Category"
            value={category}
            onChange={(v) => set({ category: v })}
            options={Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value: value, label }))}
          />
        )}
        <Select
          label="Sentiment"
          value={get("sentiment")}
          onChange={(v) => set({ sentiment: v })}
          options={[
            { value: "POSITIVE", label: "Positive" },
            { value: "NEUTRAL", label: "Neutral" },
            { value: "NEGATIVE", label: "Negative" },
          ]}
        />
        <Select
          label="Importance"
          value={get("importance")}
          onChange={(v) => set({ importance: v })}
          options={[
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
          ]}
        />
        <Select label="Media" value={get("media")} onChange={(v) => set({ media: v })} options={(media ?? []).map((m) => ({ value: m, label: m }))} />
        <select
          aria-label="Period"
          value={period}
          onChange={(e) => set({ days: e.target.value })}
          className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-900 outline-none focus:border-brand"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {active.map((f) => (
          <button
            key={f.key}
            onClick={() => set({ [f.key]: "" })}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-gray-900 px-3 text-sm font-bold text-white"
          >
            {f.label}
            <X className="h-3.5 w-3.5" aria-label="Remove filter" />
          </button>
        ))}
        {active.length > 0 && (
          <Button variant="tertiary" size="sm" onClick={() => router.replace(pathname)}>
            Clear all
          </Button>
        )}
      </Card>

      <div className="text-sm text-gray-700">
        {data ? (
          <>
            <b className="text-gray-900">{data.total}</b> articles · newest first
          </>
        ) : (
          "Loading…"
        )}
      </div>

      {error && <ErrorState />}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}
      {data && data.items.length === 0 && (
        <Card>
          <EmptyState title="No articles match these filters">New articles appear here within 15 minutes of being published.</EmptyState>
        </Card>
      )}
      <div className="space-y-3">
        {data?.items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {data && pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })} icon={<ChevronLeft className="h-4 w-4" />}>
            Previous
          </Button>
          <span className="tabular text-sm text-gray-700">
            Page {page} of {pages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => set({ page: String(page + 1) })}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
