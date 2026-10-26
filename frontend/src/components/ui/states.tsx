import { AlertCircle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <Inbox className="h-8 w-8 text-gray-300" />
      <div className="font-bold">{title}</div>
      {children && <div className="max-w-md text-sm text-gray-700">{children}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong while loading data." }: { message?: string }) {
  return (
    <div role="alert" className="flex items-center gap-3 rounded-md bg-error-tint p-4 text-sm text-error">
      <AlertCircle className="h-5 w-5 shrink-0" />
      {message}
    </div>
  );
}

export function Skeleton({ className = "h-24" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />;
}
