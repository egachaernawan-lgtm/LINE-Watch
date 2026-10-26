import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "./card";

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  href?: string;
  icon?: ReactNode;
  tone?: "negative";
}

export function StatTile({ label, value, hint, href, icon, tone }: Props) {
  const body = (
    <Card className={clsx("p-5", href && "transition duration-200 ease-standard hover:shadow-popover")}>
      <div className="flex items-center justify-between text-sm font-bold text-gray-700">
        {label}
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>
      <div className={clsx("tabular mt-2 text-[32px] font-extrabold leading-tight", tone === "negative" && "text-error")}>{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </Card>
  );
  return href ? (
    <Link href={href} className="block text-gray-900 hover:no-underline">
      {body}
    </Link>
  ) : (
    body
  );
}
