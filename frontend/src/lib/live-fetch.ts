import { XMLParser } from "fast-xml-parser";

import config from "@/data/live-config.json";
import snapshot from "@/data/snapshot.json";
import type { Category, LiveArticle, LiveFetchResult } from "@/types/api";

// Server-side only. The demo's "Fetch latest news" button: reads the publishers' own RSS feeds right now,
// keeps the items that match the monitoring keywords, and drops anything the snapshot already has.
// It mirrors the collector (backend/app/services/ingestion: classifier.py, dedupe.py) for the direct feeds.
// Google-News-only outlets are not fetched here: their links need decoding that only the Python collector does.

const FEED_TIMEOUT_MS = 6000;
const MAX_AGE_MS = 48 * 3600_000;
const LEAD_CHARS = 600;
const SUMMARY_CHARS = 280;
const MAX_RESULTS = 30;
const MAX_ITEMS_PER_FEED = 60;
const PRIORITY: Category[] = ["LINE", "COMPETITOR", "GOVERNMENT", "INDUSTRY"];
const ANYWHERE = new Set<Category>(["LINE", "COMPETITOR"]);

interface Rule {
  term: string;
  category: Category;
  company: string | null;
  patterns: RegExp[];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = (text: string, caseSensitive: boolean) => new RegExp(`(?<![A-Za-z0-9])${escapeRe(text)}(?![A-Za-z0-9])`, caseSensitive ? "" : "i");

const RULES: Rule[] = config.keywords.map((k) => ({
  term: k.term,
  category: k.category as Category,
  company: k.company,
  patterns: [pattern(k.term, k.case_sensitive), ...k.aliases.map((a) => pattern(a, false))],
}));

function classify(title: string, body: string) {
  const lead = `${title}\n${body.slice(0, LEAD_CHARS)}`;
  const full = `${title}\n${body}`;
  const hits = RULES.filter((r) => {
    const haystack = ANYWHERE.has(r.category) ? full : lead;
    return r.patterns.some((p) => p.test(haystack));
  });
  if (!hits.length) return null;
  const rank = (r: Rule) => [PRIORITY.indexOf(r.category), r.patterns.some((p) => p.test(title)) ? 0 : 1, -r.term.length];
  const best = hits.reduce((a, b) => {
    const [x, y] = [rank(a), rank(b)];
    for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? a : b;
    return a;
  });
  return { category: best.category, company: best.company, trigger: best.term };
}

// ---- same URL / same story detection (see dedupe.py) ----

const TRACKING = /^(utm_.*|fbclid|gclid|igshid|ref|ref_src|source|campaign|cmpid|ito|_ga)$/i;

function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const query = [...u.searchParams.entries()]
      .filter(([k, v]) => !TRACKING.test(k) && !(k.toLowerCase() === "page" && v.toLowerCase() === "all"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return `${u.protocol}//${host}${u.pathname.replace(/\/+$/, "") || "/"}${query ? `?${query}` : ""}`;
  } catch {
    return raw;
  }
}

const fingerprint = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ---- feed parsing ----

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…" };

function plainText(html: unknown): string {
  const raw = typeof html === "string" ? html : typeof (html as { "#text"?: string })?.["#text"] === "string" ? (html as { "#text": string })["#text"] : "";
  return raw
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

interface RawItem {
  title: string;
  url: string;
  published: Date | null;
  body: string;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: true, trimValues: true });
const asArray = <T>(x: T | T[] | undefined): T[] => (x === undefined ? [] : Array.isArray(x) ? x : [x]);

function parseFeed(xml: string): RawItem[] {
  const doc = parser.parse(xml);
  const items = [...asArray(doc?.rss?.channel?.item), ...asArray(doc?.["rdf:RDF"]?.item), ...asArray(doc?.feed?.entry)];
  const out: RawItem[] = [];
  for (const it of items.slice(0, MAX_ITEMS_PER_FEED)) {
    const link = it.link;
    const url = typeof link === "string" ? link : (asArray(link).find((l: { "@_rel"?: string }) => !l["@_rel"] || l["@_rel"] === "alternate") ?? asArray(link)[0])?.["@_href"] ?? it.guid?.["#text"] ?? it.guid;
    const title = plainText(it.title);
    const when = it.pubDate ?? it["dc:date"] ?? it.published ?? it.updated;
    const date = when ? new Date(String(when)) : null;
    if (!title || typeof url !== "string" || !/^https?:\/\//i.test(url)) continue; // never link to anything but http(s)
    out.push({
      title,
      url: url.trim(),
      published: date && !Number.isNaN(date.getTime()) ? date : null,
      body: plainText(it["content:encoded"] ?? it.content ?? it.description ?? it.summary),
    });
  }
  return out;
}

async function fetchFeed(feed: { media: string; url: string }): Promise<RawItem[]> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "LINE-WATCH-demo/1.0 (media monitoring)", Accept: "application/rss+xml, application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    redirect: "follow",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseFeed(await res.text());
}

const KNOWN_URLS = new Set(snapshot.articles.map((a) => canonicalUrl(a.url)));
const KNOWN_TITLES = new Set(snapshot.articles.map((a) => fingerprint(a.headline)));

export async function fetchLatest(): Promise<LiveFetchResult> {
  const now = Date.now();
  const settled = await Promise.allSettled(config.feeds.map(async (f) => ({ media: f.media, items: await fetchFeed(f) })));
  let scanned = 0;
  let matched = 0;
  let alreadyKnown = 0;
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const found: LiveArticle[] = [];

  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value.items) {
      if (!item.published || now - item.published.getTime() > MAX_AGE_MS || item.published.getTime() > now + 3600_000) continue;
      scanned += 1;
      if (new URL(item.url).pathname.replace(/\/+$/, "") === "") continue; // a site front page, not an article
      const hit = classify(item.title, item.body);
      if (!hit) continue;
      matched += 1;
      const url = canonicalUrl(item.url);
      const title = fingerprint(item.title);
      if (KNOWN_URLS.has(url) || KNOWN_TITLES.has(title) || seenUrls.has(url) || seenTitles.has(title)) {
        alreadyKnown += 1;
        continue;
      }
      seenUrls.add(url);
      seenTitles.add(title);
      found.push({
        headline: item.title,
        url: item.url,
        media_name: r.value.media,
        published_at: item.published.toISOString(),
        category: hit.category,
        company: hit.company,
        keyword_trigger: hit.trigger,
        excerpt: item.body.length > SUMMARY_CHARS ? `${item.body.slice(0, SUMMARY_CHARS).trimEnd()}…` : item.body,
      });
    }
  }

  found.sort(
    (a, b) => PRIORITY.indexOf(a.category) - PRIORITY.indexOf(b.category) || Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? ""),
  );
  return {
    fetched_at: new Date(now).toISOString(),
    feeds_total: config.feeds.length,
    feeds_ok: settled.filter((r) => r.status === "fulfilled").length,
    scanned,
    matched,
    already_known: alreadyKnown,
    total_new: found.length,
    articles: found.slice(0, MAX_RESULTS),
  };
}
