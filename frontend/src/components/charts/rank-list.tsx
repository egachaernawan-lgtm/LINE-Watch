import Link from "next/link";

import type { CountItem } from "@/types/api";

/** Ranked horizontal bars (top media, share of voice). `hrefFor` makes each row a drill-down link. */
export function RankList({ items, hrefFor, suffix = "" }: { items: CountItem[]; hrefFor?: (label: string) => string; suffix?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  if (!items.length) return <div className="text-sm text-gray-500">No data yet.</div>;
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const row = (
          <>
            <div className="flex justify-between gap-3 text-sm">
              <span className="truncate font-bold text-gray-900">{item.label}</span>
              <span className="tabular shrink-0 text-gray-700">
                {item.count}
                {suffix === "%" ? ` · ${Math.round((item.count / total) * 100)}%` : suffix}
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </>
        );
        return (
          <li key={item.label}>
            {hrefFor ? (
              <Link href={hrefFor(item.label)} className="block text-inherit hover:no-underline">
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}
