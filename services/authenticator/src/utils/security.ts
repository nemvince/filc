import { password } from 'bun';

// Explicit Argon2id parameters for consistency & resistance against downgrade.
export const ARGON2ID_PARAMS = {
  algorithm: 'argon2id' as const,
  memoryCost: 19_456, // ~19MB
  timeCost: 2,
  parallelism: 1,
};

// Generate a cryptographically secure session token (base64url, no padding)
export function generateSessionToken(size = 32): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  // base64
  const b64 = Buffer.from(bytes).toString('base64');
  // base64url (RFC 4648 §5)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// Hash a token with SHA-256 (hex) for storage.
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper to hash a password with fixed parameters.
export function hashPassword(raw: string): Promise<string> {
  return password.hash(raw, ARGON2ID_PARAMS);
}
