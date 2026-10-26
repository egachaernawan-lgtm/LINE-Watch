import clsx from "clsx";
import type { ReactNode } from "react";

import { CATEGORY_LABEL, titleCase } from "@/lib/format";
import type { Category, Sentiment } from "@/types/api";

const TONE = {
  positive: "bg-brand-tint text-brand-dark",
  negative: "bg-error-tint text-error",
  neutral: "bg-gray-100 text-gray-700",
  info: "bg-info-tint text-info",
  warning: "bg-warning-tint text-[#B36B00]",
  outline: "border border-gray-300 text-gray-700",
} as const;

export function Tag({ tone = "neutral", dot, children }: { tone?: keyof typeof TONE; dot?: boolean; children: ReactNode }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-bold", TONE[tone])}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function SentimentTag({ sentiment }: { sentiment: Sentiment | null }) {
  if (!sentiment) return <Tag tone="outline">Analysing</Tag>;
  const tone = sentiment === "POSITIVE" ? "positive" : sentiment === "NEGATIVE" ? "negative" : "neutral";
  return (
    <Tag tone={tone} dot>
      {titleCase(sentiment)}
    </Tag>
  );
}

export function CategoryTag({ category }: { category: Category }) {
  return <Tag tone={category === "LINE" ? "positive" : "outline"}>{CATEGORY_LABEL[category]}</Tag>;
}
