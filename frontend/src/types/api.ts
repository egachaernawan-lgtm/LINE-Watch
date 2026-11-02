export type Category = "LINE" | "COMPETITOR" | "INDUSTRY" | "GOVERNMENT";
export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type Level = "HIGH" | "MEDIUM" | "LOW";

export interface Article {
  id: number;
  headline: string;
  media_name: string;
  author: string | null;
  published_at: string | null;
  collected_at: string;
  url: string;
  keyword_trigger: string;
  category: Category;
  company: string | null;
  sentiment: Sentiment | null;
  importance: Level | null;
  business_impact: Level | null;
  recommended_action: "MONITOR" | "SHARE_INTERNALLY" | "PREPARE_RESPONSE" | "NO_ACTION_REQUIRED" | null;
  summary: string[] | null;
  analysis_status: string;
}

export interface ArticleDetail extends Article {
  body: string | null;
}

export interface ArticlePage {
  items: Article[];
  total: number;
  page: number;
  page_size: number;
}

export interface CountItem {
  label: string;
  count: number;
}

export interface Overview {
  days: number;
  total: number;
  by_category: CountItem[];
  by_sentiment: CountItem[];
  top_media: CountItem[];
  share_of_voice: CountItem[];
  daily: { day: string; total: number; negative: number }[];
  negative_recent: number;
  last_collected_at: string | null;
}

export interface ReportRow {
  region: string;
  category: string;
  media: string;
  headline: string;
  url: string;
  summary: string | null;
}

export interface ReportSection {
  title: string;
  rows: ReportRow[];
}

export interface DailyPreview {
  date: string;
  label: string;
  subject: string;
  html: string; // the finished report as a standalone HTML document
  sections: ReportSection[]; // the same content as plain rows, for the CSV / Excel / PDF downloads
  ending: string;
  counts: Record<Category, number>;
  translated_all: boolean;
}
