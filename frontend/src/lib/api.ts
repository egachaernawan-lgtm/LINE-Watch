// All calls go through the same-origin proxy (src/app/api/backend), which adds the auth token.
export async function api<T>(path: string, params?: Record<string, string | number | undefined | null>): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  const qs = query.toString();
  const res = await fetch(`/api/backend/${path}${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}
