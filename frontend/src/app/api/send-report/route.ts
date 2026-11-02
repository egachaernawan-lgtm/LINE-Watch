import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { demoMode } from "@/lib/demo";
import { getDemoReport } from "@/lib/demo-api";
import { parseEmails } from "@/lib/emails";

// Demo deployment only: really emails the daily report. Three guards keep a public link from becoming
// a spam relay: the presenter's send code (DEMO_SEND_PASSCODE), the HTML always comes from the snapshot
// on the server (never from the request), and a hard cap on recipients per send.
const MAX_RECIPIENTS = 200;

const fail = (status: number, detail: string) => NextResponse.json({ detail }, { status });

function sameSecret(given: unknown, expected: string): boolean {
  if (typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!demoMode) return fail(404, "Not found");
  const { DEMO_SEND_PASSCODE: passcode, SENDGRID_API_KEY: apiKey, EMAIL_FROM: from } = process.env;
  if (!passcode || !apiKey || !from) {
    return fail(503, "Sending is not set up on this deployment (needs DEMO_SEND_PASSCODE, SENDGRID_API_KEY and EMAIL_FROM)");
  }

  const body = (await req.json().catch(() => null)) as { date?: string; emails?: string[]; passcode?: string } | null;
  if (!body) return fail(400, "Invalid request");
  if (!sameSecret(body.passcode, passcode)) {
    await new Promise((resolve) => setTimeout(resolve, 600)); // slow down guessing
    return fail(403, "Wrong send code");
  }

  const report = getDemoReport(String(body.date ?? ""));
  if (!report) return fail(404, "No report for this date");
  const { valid, invalid } = parseEmails(Array.isArray(body.emails) ? body.emails.join(",") : "");
  if (invalid.length) return fail(422, `Not a valid email address: ${invalid[0].slice(0, 80)}`);
  if (!valid.length) return fail(422, "No recipients selected");
  if (valid.length > MAX_RECIPIENTS) return fail(422, `Too many recipients (${valid.length}); the limit per send is ${MAX_RECIPIENTS}`);

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: valid.map((email) => ({ to: [{ email }] })), // one message each: addresses stay private
      from: { email: from },
      subject: report.subject,
      content: [{ type: "text/html", value: report.html }],
    }),
  });
  if (!res.ok) return fail(502, `The email service refused the message (HTTP ${res.status})`);
  return NextResponse.json({ status: "sent", recipients: valid.length, subject: report.subject });
}
