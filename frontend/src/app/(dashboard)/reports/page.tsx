"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown, FileText } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Report } from "@/types/api";

export default function ReportsPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["reports"], queryFn: () => api<Report[]>("reports") });

  return (
    <>
      <Topbar title="Reports" />
      <main className="space-y-4 p-4 lg:p-8">
        <p className="text-sm text-gray-700">Daily reports are issued at 08:00 WIB and monthly reports on the 1st of each month.</p>
        {error && <ErrorState />}
        {isLoading && <Skeleton className="h-40" />}
        {data && data.length === 0 && (
          <Card>
            <EmptyState title="No reports yet">The first daily report is created at 08:00 WIB.</EmptyState>
          </Card>
        )}
        {data && data.length > 0 && (
          <Card className="divide-y divide-gray-200">
            {data.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold">
                    {r.kind === "daily" ? "Daily" : "Monthly"} report · {formatDateTime(r.period_start)}
                  </div>
                  <div className="text-xs text-gray-500">Created {formatDateTime(r.created_at)}</div>
                </div>
                {r.emailed_at && <Tag tone="positive">Emailed</Tag>}
                {r.gdoc_url && <a href={r.gdoc_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold">Google Doc</a>}
                {r.pdf_url && (
                  <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold">
                    <FileDown className="h-4 w-4" /> PDF
                  </a>
                )}
              </div>
            ))}
          </Card>
        )}
      </main>
    </>
  );
}
