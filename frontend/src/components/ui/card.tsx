import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={clsx("rounded-xl border border-gray-200 bg-white", className)} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...rest} className={clsx("text-lg font-bold", className)} />;
}
