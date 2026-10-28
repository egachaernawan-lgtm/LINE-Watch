// Demo mode: a read-only copy of real, already-analysed articles (src/data/snapshot.json) served by
// the Next.js app itself, so no FastAPI backend, database or Google login is needed (e.g. on Vercel).
export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
