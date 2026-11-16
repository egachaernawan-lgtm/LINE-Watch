"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardTitle } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { CategoryTag, Tag } from "@/components/ui/tag";
import { api } from "@/lib/api";
import type { Library, LibraryTopic } from "@/types/api";

function matches(topic: LibraryTopic, q: string) {
  if (!q) return true;
  const haystack = [topic.key, topic.description, ...topic.keywords.flatMap((k) => [k.term, ...k.aliases])].join(" ").toLowerCase();
  return haystack.includes(q);
}

function TopicRow({ topic }: { topic: LibraryTopic }) {
  return (
    <div className="border-t border-gray-200 px-5 py-4 first:border-t-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold">{topic.name}</h3>
        <CategoryTag category={topic.category} />
        {topic.judged && <Tag tone="info">Picked by AI from the article</Tag>}
        {topic.report_cap !== null && <Tag tone="outline">Report: max {topic.report_cap} per day</Tag>}
        <span className="ml-auto text-sm text-gray-700">
          <b className="tabular text-gray-900">{topic.articles_30d}</b> in 30 days · <span className="tabular">{topic.articles_total}</span> total
        </span>
      </div>
      {topic.description && <p className="mt-1 text-sm text-gray-700">{topic.description}</p>}

      {topic.keywords.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {topic.keywords.map((k) => (
            <li
              key={k.term}
              title={[k.aliases.length ? `Also matches: ${k.aliases.join(", ")}` : "", k.scope === "lead" ? "Counts only in the headline or first paragraph" : "Counts anywhere in the article", k.case_sensitive ? "Exact capitalisation" : ""]
                .filter(Boolean)
                .join(" · ")}
              className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-900"
            >
              {k.term}
              {k.aliases.length > 0 && <span className="font-normal text-gray-500"> +{k.aliases.length}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-gray-500">{topic.judged ? "No search term: the AI assigns this topic while reading." : "No search terms yet."}</p>
      )}

      {topic.articles_total > 0 && (
        <Link href={`/feed?topic=${encodeURIComponent(topic.key)}&days=all`} className="mt-3 inline-block text-sm font-bold">
          View articles
        </Link>
      )}
    </div>
  );
}

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const { data, error, isLoading } = useQuery({ queryKey: ["library"], queryFn: () => api<Library>("library") });
  const q = query.trim().toLowerCase();

  return (
    <>
      <Topbar title="Topic library" />
      <main className="space-y-4 p-4 lg:p-8">
        <Card className="space-y-2 p-6">
          <CardTitle>What LINE Watch looks for</CardTitle>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-900">
            <li>
              <b>Indonesian media only.</b> Links hosted under another country&apos;s domain are dropped.
            </li>
            <li>
              <b>LINE services count even when mentioned in passing</b> (for example LINE MUSIC inside a K-pop story). Priority services: LINE Bank by Hana Bank, LINE Webtoon, LINE Games (Let&apos;s Get Rich, LINE Rangers).
            </li>
            <li>
              <b>Competitors and industry:</b> every article is kept in the feed, but the daily report shows at most 5 per topic, from prominent media first.
            </li>
          </ul>
          <p className="text-xs text-gray-500">Hover a keyword to see its other spellings and where it counts.</p>
        </Card>

        <label className="flex h-10 max-w-md items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics and keywords"
            aria-label="Search topics and keywords"
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>

        {error && <ErrorState />}
        {isLoading && <Skeleton className="h-64" />}
        {data?.groups.map((group) => {
          const topics = group.topics.filter((t) => matches(t, q));
          if (topics.length === 0) return null;
          return (
            <Card key={group.name} className="overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                <h2 className="text-lg font-bold">{group.name}</h2>
                {group.description && <p className="text-sm text-gray-700">{group.description}</p>}
              </div>
              {topics.map((t) => (
                <TopicRow key={t.key} topic={t} />
              ))}
            </Card>
          );
        })}
        {data && q && data.groups.every((g) => g.topics.every((t) => !matches(t, q))) && <Card className="p-6 text-center text-sm text-gray-700">No topic or keyword matches “{query}”.</Card>}
      </main>
    </>
  );
}
