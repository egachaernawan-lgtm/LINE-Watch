"use client";

import clsx from "clsx";
import { useState } from "react";

import { GroupsPanel } from "@/components/reports/groups-panel";
import { HistoryPanel } from "@/components/reports/history-panel";
import { SendPanel } from "@/components/reports/send-panel";
import { Topbar } from "@/components/layout/topbar";

const TABS = [
  { id: "send", label: "Send report" },
  { id: "groups", label: "Recipient groups" },
  { id: "history", label: "History" },
] as const;

export default function ReportsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("send");

  return (
    <>
      <Topbar title="Reports" />
      <main className="space-y-4 p-4 lg:p-8">
        <p className="text-sm text-gray-700">
          The Global Daily Monitoring report covers the 24 hours before 08:00 WIB. Preview it, then email it to everyone or to specific groups.
        </p>
        <div role="tablist" className="inline-flex rounded-md bg-gray-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "h-9 rounded-md px-4 text-sm font-bold transition duration-[120ms]",
                tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "send" && <SendPanel />}
        {tab === "groups" && <GroupsPanel />}
        {tab === "history" && <HistoryPanel />}
      </main>
    </>
  );
}
