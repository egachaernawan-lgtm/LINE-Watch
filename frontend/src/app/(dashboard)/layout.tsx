import type { ReactNode } from "react";

import { DemoBanner } from "@/components/layout/demo-banner";
import { MobileNav, Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav />
      <div className="pb-20 lg:pb-0 lg:pl-60">
        <DemoBanner />
        {children}
      </div>
    </div>
  );
}
