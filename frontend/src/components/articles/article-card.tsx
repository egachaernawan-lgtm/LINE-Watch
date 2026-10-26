import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { CategoryTag, SentimentTag, Tag } from "@/components/ui/tag";
import { ACTION_LABEL, formatDateTime, titleCase } from "@/lib/format";
import type { Article } from "@/types/api";

/** Headline, media, date, sentiment, summary and the ORIGINAL SOURCE link: shown on every card. */
export function ArticleCard({ article: a }: { article: Article }) {
  return (
    <Card className="p-5 transition duration-200 ease-standard hover:shadow-popover">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <SentimentTag sentiment={a.sentiment} />
        <CategoryTag category={a.category} />
        {a.company && a.company !== "LINE" && <Tag tone="outline">{a.company}</Tag>}
        {a.importance === "HIGH" && <Tag tone="warning">High importance</Tag>}
      </div>

      <h3 className="text-lg font-bold leading-snug">
        <Link href={`/articles/${a.id}`} className="text-gray-900 hover:text-brand-dark">
          {a.headline}
        </Link>
      </h3>
      <div className="mt-1 text-sm text-gray-700">
        <b>{a.media_name}</b> · {formatDateTime(a.published_at ?? a.collected_at)}
      </div>

      {a.summary && a.summary.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-gray-900">
          {a.summary.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 text-sm">
        <a href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold">
          <ExternalLink className="h-4 w-4" />
          Original Source
        </a>
        <span className="text-xs text-gray-500">
          Keyword: {a.keyword_trigger}
          {a.recommended_action && <> · {ACTION_LABEL[a.recommended_action]}</>}
          {a.business_impact && <> · Impact {titleCase(a.business_impact)}</>}
        </span>
      </div>
      <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-gray-500">
        {a.url}
      </a>
    </Card>
  );
}
