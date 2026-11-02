// Same rule as the backend (app/schemas/email.py): something@domain.tld, no spaces or separators.
const EMAIL_RE = /^[^@\s,;<>]+@[^@\s,;<>]+\.[^@\s,;<>]+$/;

/** Split pasted text on spaces, commas, semicolons and newlines; lower-case, dedupe, report what is not an address. */
export function parseEmails(text: string): { valid: string[]; invalid: string[] } {
  const valid = new Set<string>();
  const invalid: string[] = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const email = raw.trim().toLowerCase();
    if (!email) continue;
    if (EMAIL_RE.test(email)) valid.add(email);
    else invalid.push(raw.trim());
  }
  return { valid: [...valid], invalid };
}
