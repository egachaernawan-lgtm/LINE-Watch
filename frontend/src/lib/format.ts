const TZ = "Asia/Jakarta";

export function formatDateTime(iso: string | null): string {
  if (!iso) return "Date unknown";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso)) + " WIB";
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export const CATEGORY_LABEL = {
  LINE: "LINE",
  COMPETITOR: "Competitor",
  INDUSTRY: "Industry",
  GOVERNMENT: "Government",
} as const;

export const ACTION_LABEL = {
  MONITOR: "Monitor",
  SHARE_INTERNALLY: "Share internally",
  PREPARE_RESPONSE: "Prepare response",
  NO_ACTION_REQUIRED: "No action required",
} as const;

export function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
