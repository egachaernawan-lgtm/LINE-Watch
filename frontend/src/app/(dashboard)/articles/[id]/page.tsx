"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardTitle } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { CategoryTag, SentimentTag, Tag } from "@/components/ui/tag";
import { api } from "@/lib/api";
import { ACTION_LABEL, formatDateTime, titleCase } from "@/lib/format";
import type { ArticleDetail } from "@/types/api";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { data: a, error, isLoading } = useQuery({ queryKey: ["article", id], queryFn: () => api<ArticleDetail>(`articles/${id}`) });

  return (
    <>
      <Topbar title="Article" back />
      <main className="mx-auto max-w-3xl space-y-4 p-4 lg:p-8">
        {isLoading && <Skeleton className="h-64" />}
        {error && <ErrorState message="This article could not be loaded." />}
        {a && (
          <>
            <Card className="p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <SentimentTag sentiment={a.sentiment} />
                <CategoryTag category={a.category} />
                {a.company && <Tag tone="outline">{a.company}</Tag>}
              </div>
              <h2 className="text-[28px] font-extrabold leading-tight">{a.headline}</h2>
              <p className="mt-2 text-sm text-gray-700">
                <b>{a.media_name}</b> · {formatDateTime(a.published_at ?? a.collected_at)}
                {a.author && <> · {a.author}</>}
              </p>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-md bg-brand px-5 font-bold text-white hover:bg-brand-pressed hover:no-underline"
              >
                <ExternalLink className="h-4 w-4" /> Open original article
              </a>
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-xs text-gray-500">
                {a.url}
              </a>
            </Card>

            <Card className="p-6">
              <CardTitle>AI summary</CardTitle>
              {a.summary?.length ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5">{a.summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
              ) : (
                <p className="mt-2 text-sm text-gray-700">The analysis is still pending and will appear within a few minutes.</p>
              )}
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 text-sm sm:grid-cols-4">
                {[
                  ["Importance", a.importance && titleCase(a.importance)],
                  ["Business impact", a.business_impact && titleCase(a.business_impact)],
                  ["Recommended action", a.recommended_action && ACTION_LABEL[a.recommended_action]],
                  ["Keyword", a.keyword_trigger],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-xs text-gray-500">{label}</dt>
                    <dd className="font-bold">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {a.body && (
              <Card className="p-6">
                <CardTitle>Extracted text</CardTitle>
                <p className="mt-1 text-xs text-gray-500">Excerpt for reference. Read the full article at the original source.</p>
                <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-gray-700">{a.body.slice(0, 2500)}{a.body.length > 2500 ? "…" : ""}</div>
              </Card>
            )}
          </>
        )}
      </main>
    </>
  );
}
