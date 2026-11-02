async function errorMessage(res: Response): Promise<string> {
  try {
    const detail = ((await res.json()) as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d) => (d as { msg?: string }).msg).filter(Boolean).join("; ");
  } catch {
    // not JSON: fall through to the generic message
  }
  return `Request failed (${res.status})`;
}

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

/** POST / PUT / DELETE with a JSON body. Throws with the server's own message (e.g. "Admin only"). */
export async function apiWrite<T>(method: "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/backend/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (res.status === 204 ? undefined : await res.json()) as T;
}
