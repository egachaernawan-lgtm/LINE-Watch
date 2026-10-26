import type { CountItem } from "@/types/api";

const COLORS: Record<string, string> = {
  POSITIVE: "var(--sentiment-positive)",
  NEUTRAL: "var(--sentiment-neutral)",
  NEGATIVE: "var(--sentiment-negative)",
};
const ORDER = ["POSITIVE", "NEUTRAL", "NEGATIVE"];

/** Design-system SentimentBar: positive, neutral, negative in that order, 2px gaps, fully rounded. */
export function SentimentBar({ items, height = 8, showLegend = true }: { items: CountItem[]; height?: number; showLegend?: boolean }) {
  const counts = Object.fromEntries(items.map((i) => [i.label, i.count]));
  const total = ORDER.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
  if (!total) return <div className="text-sm text-gray-500">No analysed articles yet.</div>;
  return (
    <div>
      <div className="flex gap-0.5" style={{ height }} role="img" aria-label="Sentiment distribution">
        {ORDER.filter((k) => counts[k]).map((k) => (
          <div key={k} className="rounded-full" style={{ flex: counts[k], background: COLORS[k] }} />
        ))}
      </div>
      {showLegend && (
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
          {ORDER.map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[k] }} />
              {k.charAt(0) + k.slice(1).toLowerCase()} <b className="tabular text-gray-900">{counts[k] ?? 0}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
