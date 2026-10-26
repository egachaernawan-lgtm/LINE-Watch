"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Overview } from "@/types/api";

/** Daily article volume (green area) with negative coverage (red line), per design tokens. */
export function VolumeChart({ daily }: { daily: Overview["daily"] }) {
  if (!daily.length) return <div className="py-12 text-center text-sm text-gray-500">No data for this period yet.</div>;
  return (
    <div className="h-[220px]" role="img" aria-label="Daily article volume">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="var(--gray-200)" vertical={false} />
          <XAxis dataKey="day" tickFormatter={(d: string) => d.slice(5)} tick={{ fontSize: 12, fill: "var(--gray-500)" }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--gray-500)" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid var(--gray-200)", boxShadow: "var(--shadow-popover)" }}
            formatter={(v, name) => [v, name === "total" ? "Articles" : "Negative"]}
          />
          <Area type="monotone" dataKey="total" stroke="var(--line-green)" strokeWidth={2.5} fill="var(--line-green)" fillOpacity={0.1} />
          <Area type="monotone" dataKey="negative" stroke="var(--red-500)" strokeWidth={2} fill="var(--red-500)" fillOpacity={0.08} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
