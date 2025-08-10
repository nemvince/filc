// Simple audit logger. Replace with structured logging & external sink in production.
// Intentionally minimal; avoids leaking secrets.

interface AuditEntry {
  ts: string; // ISO timestamp
  event: string;
  actor?: string; // user id
  ip?: string | null;
  target?: string;
  meta?: Record<string, unknown>;
  success: boolean;
}

const SENSITIVE_KEY_REGEX = /password|token|secret|hash/i;

function redact(v: unknown): unknown {
  if (typeof v === 'string' && v.length > 64) {
    return `${v.slice(0, 32)}...`;
  }
  return v;
}

export function audit(event: string, entry: Omit<AuditEntry, 'event' | 'ts'>) {
  const record: AuditEntry = {
    ts: new Date().toISOString(),
    event,
    ...entry,
  };
  if (record.meta) {
    const redacted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record.meta)) {
      if (SENSITIVE_KEY_REGEX.test(k)) {
        continue; // skip sensitive
      }
      redacted[k] = redact(v);
    }
    record.meta = redacted;
  }
  // biome-ignore lint/suspicious/noConsole: Audit log output
  console.info('[AUDIT]', JSON.stringify(record));
}
