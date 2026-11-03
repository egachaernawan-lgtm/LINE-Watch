"use client";

import { useMutation } from "@tanstack/react-query";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/states";
import { CategoryTag, Tag } from "@/components/ui/tag";
import { formatDateTime, timeAgo } from "@/lib/format";
import type { LiveFetchResult } from "@/types/api";

const PREVIEW_COUNT = 8;

async function fetchLatest(): Promise<LiveFetchResult> {
  const res = await fetch("/api/fetch-latest");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<LiveFetchResult>;
}

function Step({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-md bg-gray-100 px-3 py-2">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-700">{label}</div>
    </div>
  );
}

/** Demo only: reads the publishers' feeds right now so the audience sees real collection, not just the snapshot. */
export function LiveFetchCard() {
  const [showAll, setShowAll] = useState(false);
  const fetchNow = useMutation({ mutationFn: fetchLatest, onMutate: () => setShowAll(false) });
  const r = fetchNow.data;
  const shown = r ? (showAll ? r.articles : r.articles.slice(0, PREVIEW_COUNT)) : [];

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <CardTitle>Collect the latest news now</CardTitle>
          <p className="mt-1 text-sm text-gray-700">
            Reads the media feeds live, keeps what matches our keywords and drops what the dashboard already has. In production this runs every 15 minutes.
          </p>
        </div>
        <Button onClick={() => fetchNow.mutate()} disabled={fetchNow.isPending} icon={<RefreshCw className={`h-4 w-4 ${fetchNow.isPending ? "animate-spin" : ""}`} />}>
          {fetchNow.isPending ? "Collecting…" : r ? "Fetch again" : "Fetch latest news"}
        </Button>
      </div>

      {fetchNow.isPending && <p className="text-sm text-gray-700">Checking the media feeds, this takes a few seconds…</p>}
      {fetchNow.error && <ErrorState message="The media feeds could not be read. Please try again in a moment." />}

      {r && !fetchNow.isPending && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Step value={r.feeds_ok} label={`of ${r.feeds_total} feeds answered`} />
            <Step value={r.scanned} label="articles in the last 48 h" />
            <Step value={r.matched} label="match our keywords" />
            <Step value={r.total_new} label={r.already_known ? `new (${r.already_known} already known)` : "new to the dashboard"} />
          </div>

          {r.articles.length === 0 ? (
            <p className="text-sm text-gray-700">Nothing new right now: everything that matches is already on the dashboard.</p>
          ) : (
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {shown.map((a) => (
                <li key={a.url} className="space-y-1 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryTag category={a.category} />
                    {a.company && a.company !== "LINE" && <Tag tone="outline">{a.company}</Tag>}
                    <Tag tone="warning">Not analysed yet</Tag>
                  </div>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="block font-bold leading-snug text-gray-900 hover:text-brand-dark">
                    {a.headline}
                  </a>
                  <div className="text-sm text-gray-700">
                    <b>{a.media_name}</b> · {a.published_at ? formatDateTime(a.published_at) : "time unknown"} · keyword: {a.keyword_trigger}
                  </div>
                  {a.excerpt && <p className="text-sm text-gray-700">{a.excerpt}</p>}
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold">
                    <ExternalLink className="h-4 w-4" />
                    Original Source
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              Collected {timeAgo(r.fetched_at)}. In the full system Gemini then summarises, rates and files each article. Not stored in this demo.
            </span>
            {r.articles.length > PREVIEW_COUNT && (
              <button onClick={() => setShowAll((v) => !v)} className="text-sm font-bold text-brand-dark">
                {showAll ? "Show fewer" : `Show all ${r.articles.length}`}
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
