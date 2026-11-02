import { api, apiWrite } from "@/lib/api";
import { demoMode } from "@/lib/demo";
import type { DailyPreview, RecipientGroup, SendLog, SendResult } from "@/types/api";

// One interface for the Reports screens. In the full app it talks to the FastAPI backend (groups and
// send history live in Postgres). In the Vercel demo there is no database: groups and history are kept
// in this browser, and sending goes through /api/send-report, which needs the presenter's send code.

export interface GroupInput {
  id?: number;
  name: string;
  description: string | null;
  emails: string[];
}

export interface SendInput {
  date: string;
  groups: RecipientGroup[]; // selected groups
  extraEmails: string[];
  test: boolean; // full app only: send just to the signed-in user
  passcode?: string; // demo only
}

const GROUPS_KEY = "linewatch.demo.groups";
const SENDS_KEY = "linewatch.demo.sends";

const SEED_GROUPS: RecipientGroup[] = [
  { id: 1, name: "All employees", description: "Everyone who should receive the daily report", emails: [] },
  { id: 2, name: "Comms team", description: "LINE Indonesia communications", emails: [] },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode / storage full: the screens keep working, the change just is not remembered
  }
}

function localDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() + 7 * 3600_000 - i * 86_400_000); // calendar day in Jakarta
    return d.toISOString().slice(0, 10);
  });
}

export const reportsClient = {
  /** Dates that can be previewed and sent, newest first. */
  async days(): Promise<string[]> {
    return demoMode ? api<string[]>("reports/days") : localDays(14);
  },

  async preview(date: string): Promise<DailyPreview> {
    return api<DailyPreview>("reports/daily/preview", { on: date });
  },

  async groups(): Promise<RecipientGroup[]> {
    if (!demoMode) return api<RecipientGroup[]>("recipient-groups");
    const stored = read<RecipientGroup[] | null>(GROUPS_KEY, null);
    if (stored) return stored;
    write(GROUPS_KEY, SEED_GROUPS);
    return SEED_GROUPS;
  },

  async saveGroup(input: GroupInput): Promise<RecipientGroup> {
    if (!demoMode) {
      const body = { name: input.name, description: input.description, emails: input.emails };
      return input.id ? apiWrite("PUT", `recipient-groups/${input.id}`, body) : apiWrite("POST", "recipient-groups", body);
    }
    const groups = await this.groups();
    if (groups.some((g) => g.id !== input.id && g.name.toLowerCase() === input.name.toLowerCase())) {
      throw new Error("A group with this name already exists");
    }
    const saved: RecipientGroup = {
      id: input.id ?? Math.max(0, ...groups.map((g) => g.id)) + 1,
      name: input.name,
      description: input.description,
      emails: input.emails,
    };
    write(GROUPS_KEY, input.id ? groups.map((g) => (g.id === input.id ? saved : g)) : [...groups, saved]);
    return saved;
  },

  async deleteGroup(id: number): Promise<void> {
    if (!demoMode) return apiWrite("DELETE", `recipient-groups/${id}`);
    write(GROUPS_KEY, (await this.groups()).filter((g) => g.id !== id));
  },

  async send(input: SendInput): Promise<SendResult> {
    if (!demoMode) {
      return apiWrite("POST", "reports/daily/send", {
        on: input.date,
        group_ids: input.groups.map((g) => g.id),
        emails: input.extraEmails,
        test: input.test,
      });
    }
    const emails = [...new Set([...input.groups.flatMap((g) => g.emails), ...input.extraEmails])];
    const names = [...input.groups.map((g) => g.name), ...(input.extraEmails.length ? ["Extra addresses"] : [])];
    let result: SendResult | null = null;
    let error: string | null = null;
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: input.date, emails, passcode: input.passcode }),
      });
      const json = (await res.json().catch(() => ({}))) as Partial<SendResult> & { detail?: string };
      if (!res.ok) throw new Error(json.detail ?? `Request failed (${res.status})`);
      result = json as SendResult;
    } catch (e) {
      error = e instanceof Error ? e.message : "Sending failed";
    }
    // Only log attempts that reached the email service; a wrong code or bad input is not a send.
    if (result || (error && error.startsWith("The email service"))) {
      const log: SendLog = {
        id: Date.now(),
        report_date: input.date,
        subject: result?.subject ?? "Global Daily Monitoring report",
        recipient_count: emails.length,
        groups: names,
        sent_by: "Demo presenter",
        status: result ? "sent" : "failed",
        error,
        sent_at: new Date().toISOString(),
      };
      write(SENDS_KEY, [log, ...read<SendLog[]>(SENDS_KEY, [])].slice(0, 100));
    }
    if (!result) throw new Error(error ?? "Sending failed");
    return result;
  },

  async sends(): Promise<SendLog[]> {
    return demoMode ? read<SendLog[]>(SENDS_KEY, []) : api<SendLog[]>("reports/sends");
  },
};
