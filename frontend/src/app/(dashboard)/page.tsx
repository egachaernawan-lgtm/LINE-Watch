"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Globe2, Landmark, Newspaper, Swords } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ArticleCard } from "@/components/articles/article-card";
import { RankList } from "@/components/charts/rank-list";
import { VolumeChart } from "@/components/charts/volume-chart";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardTitle } from "@/components/ui/card";
import { SentimentBar } from "@/components/ui/sentiment-bar";
import { StatTile } from "@/components/ui/stat-tile";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import type { ArticlePage, Overview } from "@/types/api";

const RANGES = [
  { days: 1, label: "24 hours" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
];

export default function HomePage() {
  const [days, setDays] = useState(7);
  const overview = useQuery({ queryKey: ["overview", days], queryFn: () => api<Overview>("stats/overview", { days }), refetchInterval: 60_000 });
  const latest = useQuery({
    queryKey: ["latest"],
    queryFn: () => api<ArticlePage>("articles", { page_size: 5 }),
    refetchInterval: 60_000,
  });

  const o = overview.data;
  const count = (label: string) => o?.by_category.find((c) => c.label === label)?.count ?? 0;

  return (
    <>
      <Topbar title="Home" />
      <main className="space-y-6 p-4 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" className="inline-flex rounded-md bg-gray-200 p-1">
            {RANGES.map((r) => (
              <button
                key={r.days}
                role="tab"
                aria-selected={days === r.days}
                onClick={() => setDays(r.days)}
                className={`rounded-sm px-4 py-1.5 text-sm font-bold transition duration-200 ease-standard ${days === r.days ? "bg-white shadow-sticky" : "text-gray-700"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {o?.last_collected_at && <span className="text-sm text-gray-700">Last article collected {timeAgo(o.last_collected_at)}</span>}
        </div>

        {o && o.negative_recent > 0 && (
          <div role="status" className="flex items-center gap-3 rounded-md bg-warning-tint p-4 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <span className="flex-1">
              <b>{o.negative_recent}</b> negative {o.negative_recent === 1 ? "article" : "articles"} about LINE in the last {days === 1 ? "24 hours" : `${days} days`}.
            </span>
            <Link href={`/coverage/line?sentiment=NEGATIVE&days=${days}`} className="font-bold">
              Review
            </Link>
          </div>
        )}

        {overview.error && <ErrorState />}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {overview.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          ) : (
            <>
              <StatTile label="All coverage" value={o?.total ?? 0} href={`/feed?days=${days}`} />
              <StatTile label="LINE" value={count("LINE")} href={`/coverage/line?days=${days}`} icon={<Newspaper className="h-4 w-4" />} />
              <StatTile label="Negative about LINE" value={o?.negative_recent ?? 0} tone="negative" href={`/coverage/line?sentiment=NEGATIVE&days=${days}`} />
              <StatTile label="Competitors" value={count("COMPETITOR")} href={`/coverage/competitor?days=${days}`} icon={<Swords className="h-4 w-4" />} />
            </>
          )}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="p-5 xl:col-span-2">
            <CardTitle>Coverage volume</CardTitle>
            <div className="mt-1 mb-3 flex gap-4 text-xs text-gray-700">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" />All articles</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-error" />Negative</span>
            </div>
            <VolumeChart daily={o?.daily ?? []} />
          </Card>
          <Card className="p-5">
            <CardTitle>Sentiment distribution</CardTitle>
            <div className="mt-4">
              <SentimentBar items={o?.by_sentiment ?? []} height={10} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Link href={`/coverage/industry?days=${days}`} className="flex items-center gap-2 rounded-md bg-gray-100 p-3 font-bold text-gray-900 hover:no-underline">
                <Globe2 className="h-4 w-4" /> Industry <span className="tabular ml-auto">{count("INDUSTRY")}</span>
              </Link>
              <Link href={`/coverage/government?days=${days}`} className="flex items-center gap-2 rounded-md bg-gray-100 p-3 font-bold text-gray-900 hover:no-underline">
                <Landmark className="h-4 w-4" /> Government <span className="tabular ml-auto">{count("GOVERNMENT")}</span>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Top media</CardTitle>
              <Link href="/media" className="text-sm font-bold">View all</Link>
            </div>
            <RankList items={(o?.top_media ?? []).slice(0, 6)} hrefFor={(m) => `/feed?media=${encodeURIComponent(m)}&days=${days}`} />
          </Card>
          <Card className="p-5">
            <CardTitle>Share of voice</CardTitle>
            <p className="mb-4 text-sm text-gray-700">LINE vs. competitors, by number of articles</p>
            <RankList items={o?.share_of_voice ?? []} suffix="%" hrefFor={(c) => `/feed?company=${encodeURIComponent(c)}&days=${days}`} />
          </Card>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Latest articles</h2>
            <Link href="/feed" className="text-sm font-bold">Open feed</Link>
          </div>
          {latest.isLoading && <Skeleton className="h-40" />}
          {latest.data?.items.length === 0 && (
            <Card className="p-6 text-sm text-gray-700">No articles collected yet. The collector runs every 15 minutes.</Card>
          )}
          {latest.data?.items.map((a) => <ArticleCard key={a.id} article={a} />)}
        </section>
      </main>
    </>
  );
}
