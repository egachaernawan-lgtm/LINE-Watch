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

export interface Report {
  id: number;
  kind: "daily" | "monthly";
  period_start: string;
  period_end: string;
  gdoc_url: string | null;
  pdf_url: string | null;
  emailed_at: string | null;
  created_at: string;
}
