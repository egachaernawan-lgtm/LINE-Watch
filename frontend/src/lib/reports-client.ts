import { api } from "@/lib/api";
import { demoMode } from "@/lib/demo";
import type { DailyPreview } from "@/types/api";

// One interface for the Reports screen. In the full app it asks the FastAPI backend to build the report;
// in the Vercel demo both calls are answered from the snapshot (src/lib/demo-api.ts).

function localDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() + 7 * 3600_000 - i * 86_400_000); // calendar day in Jakarta
    return d.toISOString().slice(0, 10);
  });
}

export const reportsClient = {
  /** Dates that can be downloaded, newest first. */
  async days(): Promise<string[]> {
    return demoMode ? api<string[]>("reports/days") : localDays(14);
  },

  async preview(date: string): Promise<DailyPreview> {
    return api<DailyPreview>("reports/daily/preview", { on: date });
  },
};
