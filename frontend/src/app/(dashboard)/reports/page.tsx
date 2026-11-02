"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Download, FileSpreadsheet, FileText, FileType, Globe } from "lucide-react";
import { useEffect, useState } from "react";

import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { CATEGORY_LABEL } from "@/lib/format";
import { downloadReport, FORMATS, type ExportFormat } from "@/lib/report-export";
import { reportsClient } from "@/lib/reports-client";
import type { Category } from "@/types/api";

const ICONS: Record<ExportFormat, typeof FileText> = { pdf: FileText, xlsx: FileSpreadsheet, csv: FileType, html: Globe };

export default function ReportsPage() {
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const days = useQuery({ queryKey: ["report-days"], queryFn: () => reportsClient.days() });
  useEffect(() => {
    if (!date && days.data?.length) setDate(days.data[0]);
  }, [days.data, date]);
  const preview = useQuery({
    queryKey: ["report-preview", date],
    queryFn: () => reportsClient.preview(date),
    enabled: !!date,
    staleTime: 5 * 60_000,
  });

  const download = async (format: ExportFormat) => {
    if (!preview.data) return;
    setBusy(format);
    setFailed(null);
    try {
      await downloadReport(preview.data, format);
    } catch {
      setFailed("The file could not be created. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  // Links inside the preview open in a new tab, and the sandbox keeps the report from running anything.
  const srcDoc = preview.data?.html.replace("<head>", '<head><base target="_blank">') ?? "";

  return (
    <>
      <Topbar title="Reports" />
      <main className="space-y-4 p-4 lg:p-8">
        <p className="text-sm text-gray-700">
          The Global Daily Monitoring report covers the 24 hours before 08:00 WIB. Pick a day, check it below, then download it.
        </p>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex-1">Global Daily Monitoring</CardTitle>
            <label className="flex items-center gap-2 text-sm font-bold">
              Report date
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm font-bold outline-none focus:border-brand"
              >
                {(days.data ?? []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {days.data?.length === 0 && (
            <EmptyState title="No reports yet">Run an ingestion and export the snapshot to create the first daily report.</EmptyState>
          )}
          {preview.error && <ErrorState message="This report could not be loaded." />}
          {(preview.isLoading || days.isLoading) && <Skeleton className="h-96" />}

          {preview.data && (
            <>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2" aria-label="Download this report">
                  {FORMATS.map((f) => {
                    const Icon = ICONS[f.id];
                    return (
                      <Button
                        key={f.id}
                        variant={f.id === "pdf" ? "primary" : "secondary"}
                        size="sm"
                        title={f.hint}
                        disabled={busy !== null}
                        onClick={() => download(f.id)}
                        icon={busy === f.id ? <Download className="h-4 w-4 animate-pulse" /> : <Icon className="h-4 w-4" />}
                      >
                        {busy === f.id ? "Preparing…" : f.label}
                      </Button>
                    );
                  })}
                </div>
                {failed && (
                  <p role="alert" className="text-sm text-error">
                    {failed}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(preview.data.counts) as [Category, number][]).map(([cat, n]) => (
                    <Tag key={cat} tone={cat === "LINE" ? "positive" : "outline"}>
                      {CATEGORY_LABEL[cat]} {n}
                    </Tag>
                  ))}
                </div>
                {!preview.data.translated_all && (
                  <div className="flex items-center gap-2 rounded-md bg-warning-tint p-3 text-sm text-[#B36B00]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Some headlines are still in Indonesian: the AI translation quota ran out for today.
                  </div>
                )}
              </div>
              <iframe
                title="Report preview"
                srcDoc={srcDoc}
                sandbox="allow-popups allow-popups-to-escape-sandbox"
                className="h-[680px] w-full rounded-md border border-gray-200 bg-white"
              />
            </>
          )}
        </Card>
      </main>
    </>
  );
}
