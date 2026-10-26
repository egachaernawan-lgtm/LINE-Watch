import { Suspense } from "react";

import { FeedView } from "@/components/articles/feed-view";
import { Topbar } from "@/components/layout/topbar";

export default function FeedPage() {
  return (
    <>
      <Topbar title="Latest feed" />
      <main className="p-4 lg:p-8">
        <Suspense>
          <FeedView />
        </Suspense>
      </main>
    </>
  );
}
