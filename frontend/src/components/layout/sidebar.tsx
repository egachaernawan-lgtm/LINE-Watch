"use client";

import clsx from "clsx";
import {
  Building2,
  FileText,
  Globe2,
  Home,
  Landmark,
  LogOut,
  Newspaper,
  Radio,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Latest feed", icon: Radio },
  { href: "/coverage/line", label: "LINE coverage", icon: Newspaper },
  { href: "/coverage/competitor", label: "Competitors", icon: Swords },
  { href: "/coverage/industry", label: "Industry", icon: Globe2 },
  { href: "/coverage/government", label: "Government", icon: Landmark },
  { href: "/media", label: "Top media", icon: Building2 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-200 bg-white px-3 py-5 lg:flex">
      <div className="px-3 pb-5 text-xl font-extrabold">
        LINE <span className="text-brand">Watch</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-bold transition duration-[120ms] hover:no-underline",
                active ? "bg-brand-tint text-brand-dark" : "text-gray-900 hover:bg-black/5",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 border-t border-gray-200 px-3 pt-4">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{data?.user?.name ?? "Signed in"}</div>
          <div className="truncate text-xs text-gray-500">{data?.user?.email}</div>
        </div>
        <button aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/login" })} className="rounded-md p-2 text-gray-500 hover:bg-black/5">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

/** Compact nav for screens below 1024px (the design shows bottom nav on mobile). */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-gray-200 bg-white px-1 py-1 lg:hidden">
      {NAV.filter((n) => ["/", "/feed", "/coverage/line", "/media", "/reports"].includes(n.href)).map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={clsx("flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[11px] font-bold hover:no-underline", active ? "text-brand-dark" : "text-gray-500")}>
            <Icon className="h-5 w-5" />
            {label.replace(" coverage", "")}
          </Link>
        );
      })}
    </nav>
  );
}
