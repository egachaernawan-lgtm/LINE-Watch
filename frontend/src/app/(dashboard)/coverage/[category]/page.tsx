import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FeedView } from "@/components/articles/feed-view";
import { Topbar } from "@/components/layout/topbar";
import type { Category } from "@/types/api";

const AREAS: Record<string, { category: Category; title: string }> = {
  line: { category: "LINE", title: "LINE coverage" },
  competitor: { category: "COMPETITOR", title: "Competitor coverage" },
  industry: { category: "INDUSTRY", title: "Industry coverage" },
  government: { category: "GOVERNMENT", title: "Government & policy" },
};

export default async function CoveragePage({ params }: { params: Promise<{ category: string }> }) {
  const area = AREAS[(await params).category];
  if (!area) notFound();
  return (
    <>
      <Topbar title={area.title} />
      <main className="p-4 lg:p-8">
        <Suspense>
          <FeedView fixedCategory={area.category} />
        </Suspense>
      </main>
    </>
  );
}
