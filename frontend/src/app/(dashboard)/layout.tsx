import type { ReactNode } from "react";

import { MobileNav, Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav />
      <div className="pb-20 lg:pb-0 lg:pl-60">{children}</div>
    </div>
  );
}
