import rawSnapshot from "@/data/snapshot.json";
import type { ArticleDetail, ArticlePage, CountItem, Overview, Report } from "@/types/api";

// Same endpoints and response shapes as the FastAPI backend, computed from the exported snapshot.
interface Snapshot {
  generated_at: string | null;
  articles: ArticleDetail[];
  reports: Report[];
}

const snapshot = rawSnapshot as unknown as Snapshot;
const JAKARTA_OFFSET_MS = 7 * 3600_000; // Asia/Jakarta has no daylight saving

const effectiveTime = (a: ArticleDetail) => new Date(a.published_at ?? a.collected_at).getTime();
const articles = [...snapshot.articles].sort((a, b) => effectiveTime(b) - effectiveTime(a) || b.id - a.id);

type Params = URLSearchParams;

function count(items: (string | null | undefined)[], limit?: number): CountItem[] {
  const tally = new Map<string, number>();
  for (const label of items) tally.set(label || "Unknown", (tally.get(label || "Unknown") ?? 0) + 1);
  const sorted = [...tally].map(([label, n]) => ({ label, count: n })).sort((a, b) => b.count - a.count);
  return limit ? sorted.slice(0, limit) : sorted;
}

function listArticles(p: Params): ArticlePage {
  const page = Math.max(1, Number(p.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(p.get("page_size")) || 25));
  const q = p.get("q")?.trim().toLowerCase();
  const from = p.get("date_from") ? new Date(p.get("date_from")!).getTime() : null;
  const to = p.get("date_to") ? new Date(p.get("date_to")!).getTime() : null;

  const matches = articles.filter((a) => {
    if (p.get("category") && a.category !== p.get("category")) return false;
    if (p.get("sentiment") && a.sentiment !== p.get("sentiment")) return false;
    if (p.get("importance") && a.importance !== p.get("importance")) return false;
    if (p.get("media") && a.media_name !== p.get("media")) return false;
    if (p.get("company") && a.company !== p.get("company")) return false;
    if (from !== null && effectiveTime(a) < from) return false;
    if (to !== null && effectiveTime(a) >= to) return false;
    if (q) {
      const haystack = [a.headline, a.media_name, a.keyword_trigger, a.company, ...(a.summary ?? [])].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const start = (page - 1) * pageSize;
  // The list view never needs the extracted text.
  const items = matches.slice(start, start + pageSize).map(({ body: _body, ...rest }) => rest);
  return { items, total: matches.length, page, page_size: pageSize };
}

function overview(days: number): Overview {
  // Anchored to when the snapshot was taken, so the "last N days" views stay populated.
  const anchor = snapshot.generated_at ? new Date(snapshot.generated_at).getTime() : (articles[0] ? effectiveTime(articles[0]) : Date.now());
  const recent = articles.filter((a) => effectiveTime(a) >= anchor - days * 86_400_000);

  const perDay = new Map<string, { total: number; negative: number }>();
  for (const a of recent) {
    const day = new Date(effectiveTime(a) + JAKARTA_OFFSET_MS).toISOString().slice(0, 10);
    const row = perDay.get(day) ?? { total: 0, negative: 0 };
    row.total += 1;
    if (a.sentiment === "NEGATIVE") row.negative += 1;
    perDay.set(day, row);
  }
  const collected = articles.map((a) => a.collected_at).sort();

  return {
    days,
    total: recent.length,
    by_category: count(recent.map((a) => a.category)),
    by_sentiment: count(recent.filter((a) => a.sentiment).map((a) => a.sentiment)),
    top_media: count(recent.map((a) => a.media_name), 10),
    share_of_voice: count(recent.filter((a) => (a.category === "LINE" || a.category === "COMPETITOR") && a.company).map((a) => a.company)),
    daily: [...perDay].sort(([a], [b]) => a.localeCompare(b)).map(([day, v]) => ({ day, ...v })),
    negative_recent: recent.filter((a) => a.sentiment === "NEGATIVE" && a.category === "LINE").length,
    last_collected_at: collected.at(-1) ?? null,
  };
}

/** Returns the JSON body, or null for an unknown endpoint / article. */
export function demoResponse(path: string[], params: Params): unknown | null {
  const [resource, sub] = path;
  if (resource === "articles" && !sub) return listArticles(params);
  if (resource === "articles" && sub === "media") return [...new Set(articles.map((a) => a.media_name))].sort();
  if (resource === "articles" && sub) return articles.find((a) => String(a.id) === sub) ?? null;
  if (resource === "stats" && sub === "overview") return overview(Math.min(365, Math.max(1, Number(params.get("days")) || 7)));
  if (resource === "reports") return snapshot.reports;
  if (resource === "meta") return { generated_at: snapshot.generated_at, articles: articles.length };
  return null;
}
