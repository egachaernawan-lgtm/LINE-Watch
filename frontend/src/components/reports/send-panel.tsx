"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { demoMode } from "@/lib/demo";
import { parseEmails } from "@/lib/emails";
import { CATEGORY_LABEL } from "@/lib/format";
import { reportsClient } from "@/lib/reports-client";
import type { Category } from "@/types/api";

export function SendPanel() {
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [extraText, setExtraText] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const days = useQuery({ queryKey: ["report-days"], queryFn: () => reportsClient.days() });
  const groups = useQuery({ queryKey: ["report-groups"], queryFn: () => reportsClient.groups() });
  useEffect(() => {
    if (!date && days.data?.length) setDate(days.data[0]);
  }, [days.data, date]);
  const preview = useQuery({
    queryKey: ["report-preview", date],
    queryFn: () => reportsClient.preview(date),
    enabled: !!date,
    staleTime: 5 * 60_000,
  });

  const extra = useMemo(() => parseEmails(extraText), [extraText]);
  const chosen = useMemo(() => (groups.data ?? []).filter((g) => selected.includes(g.id)), [groups.data, selected]);
  const recipientCount = useMemo(() => new Set([...chosen.flatMap((g) => g.emails), ...extra.valid]).size, [chosen, extra.valid]);

  const send = useMutation({
    mutationFn: (test: boolean) => reportsClient.send({ date, groups: chosen, extraEmails: extra.valid, test, passcode }),
    onSuccess: (r) => {
      setNotice({ ok: true, text: `Sent to ${r.recipients} ${r.recipients === 1 ? "person" : "people"}: ${r.subject}` });
      qc.invalidateQueries({ queryKey: ["report-sends"] });
    },
    onError: (e: Error) => setNotice({ ok: false, text: e.message }),
    onSettled: () => setConfirming(false),
  });

  // Links inside the preview open in a new tab, and the sandbox keeps the email from running anything.
  const srcDoc = preview.data?.html.replace("<html>", '<html><head><base target="_blank"></head>') ?? "";
  const toggle = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setConfirming(false);
  };
  const blocked = !date || recipientCount === 0 || extra.invalid.length > 0 || (demoMode && !passcode) || send.isPending;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="flex-1">Email preview</CardTitle>
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
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Subject: </span>
                <b>{preview.data.subject}</b>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(preview.data.counts) as [Category, number][]).map(([cat, n]) => (
                  <Tag key={cat} tone={cat === "LINE" ? "positive" : "outline"}>
                    {CATEGORY_LABEL[cat]} {n}
                  </Tag>
                ))}
              </div>
              {!preview.data.translated_all && (
                <div className="flex items-center gap-2 rounded-md bg-warning-tint p-3 text-[#B36B00]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Some headlines are still in Indonesian: the AI translation quota ran out for today.
                </div>
              )}
            </div>
            <iframe
              title="Email preview"
              srcDoc={srcDoc}
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              className="h-[680px] w-full rounded-md border border-gray-200 bg-white"
            />
          </>
        )}
      </Card>

      <Card className="h-fit space-y-5 p-5">
        <CardTitle>Recipients</CardTitle>
        {groups.error && <ErrorState message="Recipient groups could not be loaded." />}
        <div className="space-y-2">
          {groups.data?.length === 0 && <p className="text-sm text-gray-700">No groups yet. Create one in the Recipient groups tab.</p>}
          {groups.data?.map((g) => (
            <label key={g.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-100">
              <input type="checkbox" checked={selected.includes(g.id)} onChange={() => toggle(g.id)} className="mt-1 h-4 w-4 accent-brand" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{g.name}</span>
                <span className="block text-xs text-gray-500">
                  {g.emails.length} {g.emails.length === 1 ? "address" : "addresses"}
                  {g.emails.length === 0 && " · add addresses in Recipient groups"}
                </span>
              </span>
            </label>
          ))}
        </div>

        <label className="block text-sm font-bold">
          Other addresses
          <textarea
            value={extraText}
            onChange={(e) => {
              setExtraText(e.target.value);
              setConfirming(false);
            }}
            rows={3}
            placeholder="name@company.com, one per line or separated by commas"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm font-normal outline-none focus:border-brand"
          />
        </label>
        {extra.invalid.length > 0 && (
          <p role="alert" className="text-sm text-error">
            Not a valid address: {extra.invalid.slice(0, 3).join(", ")}
          </p>
        )}

        {demoMode && (
          <label className="block text-sm font-bold">
            Send code
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoComplete="off"
              className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm font-normal outline-none focus:border-brand"
            />
            <span className="mt-1 block text-xs font-normal text-gray-500">Only the presenter has this code. Without it nothing is emailed.</span>
          </label>
        )}

        <div className="space-y-2 border-t border-gray-200 pt-4">
          <div className="text-sm">
            <b>{recipientCount}</b> {recipientCount === 1 ? "recipient" : "recipients"} · each gets their own copy, nobody sees the others
          </div>
          {!demoMode && (
            <Button variant="secondary" className="w-full" disabled={!date || send.isPending} onClick={() => send.mutate(true)}>
              Send test to me
            </Button>
          )}
          {confirming ? (
            <div className="space-y-2 rounded-md bg-warning-tint p-3 text-sm">
              <div>
                Email the Global Daily Monitoring report for <b>{date}</b> to <b>{recipientCount}</b> {recipientCount === 1 ? "person" : "people"}? This cannot be undone.
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={send.isPending} onClick={() => send.mutate(false)} icon={<Send className="h-4 w-4" />}>
                  {send.isPending ? "Sending…" : "Yes, send"}
                </Button>
                <Button variant="secondary" disabled={send.isPending} onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button className="w-full" disabled={blocked} icon={<Send className="h-4 w-4" />} onClick={() => { setNotice(null); setConfirming(true); }}>
              Send to {recipientCount} {recipientCount === 1 ? "recipient" : "recipients"}
            </Button>
          )}
          {notice && (
            <div
              role="status"
              className={`flex items-start gap-2 rounded-md p-3 text-sm ${notice.ok ? "bg-brand-tint text-brand-dark" : "bg-error-tint text-error"}`}
            >
              {notice.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
              {notice.text}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
