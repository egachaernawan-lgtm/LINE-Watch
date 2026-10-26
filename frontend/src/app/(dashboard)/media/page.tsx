"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { RankList } from "@/components/charts/rank-list";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardTitle } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { api } from "@/lib/api";
import type { Overview } from "@/types/api";

export default function MediaPage() {
  const [days, setDays] = useState(30);
  const { data, error, isLoading } = useQuery({ queryKey: ["overview", days], queryFn: () => api<Overview>("stats/overview", { days }) });

  return (
    <>
      <Topbar title="Top media" />
      <main className="space-y-4 p-4 lg:p-8">
        <select
          aria-label="Period"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        {error && <ErrorState />}
        {isLoading && <Skeleton className="h-64" />}
        {data && (
          <Card className="p-6">
            <CardTitle>Outlets by number of articles</CardTitle>
            <p className="mb-4 text-sm text-gray-700">Select an outlet to see its articles.</p>
            <RankList items={data.top_media} hrefFor={(m) => `/feed?media=${encodeURIComponent(m)}&days=${days}`} />
          </Card>
        )}
      </main>
    </>
  );
}
