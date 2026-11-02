"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { formatDateTime } from "@/lib/format";
import { reportsClient } from "@/lib/reports-client";

export function HistoryPanel() {
  const { data, error, isLoading } = useQuery({ queryKey: ["report-sends"], queryFn: () => reportsClient.sends() });

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">Every time the daily report was emailed: when, by whom, and to which groups.</p>
      {error && <ErrorState />}
      {isLoading && <Skeleton className="h-40" />}
      {data && data.length === 0 && (
        <Card>
          <EmptyState title="Nothing sent yet">Sent reports will be listed here.</EmptyState>
        </Card>
      )}
      {data && data.length > 0 && (
        <Card className="divide-y divide-gray-200">
          {data.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="font-bold">{s.subject}</div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(s.sent_at)} · by {s.sent_by} · {s.recipient_count} {s.recipient_count === 1 ? "recipient" : "recipients"}
                </div>
                {s.error && <div className="mt-1 text-xs text-error">{s.error}</div>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(s.groups ?? []).map((g) => (
                  <Tag key={g} tone="outline">
                    {g}
                  </Tag>
                ))}
                <Tag tone={s.status === "sent" ? "positive" : "negative"} dot>
                  {s.status === "sent" ? "Sent" : "Failed"}
                </Tag>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
