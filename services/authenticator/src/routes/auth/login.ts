import { randomUUID } from 'node:crypto';
import { password as bunPassword } from 'bun';
import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';
import { checkRateLimit } from '@/utils/rateLimit';
import { generateSessionToken, hashToken } from '@/utils/security';

export const loginHandler = os.auth.login.handler(async ({ input }) => {
  const { username, password } = input;
  const rl = checkRateLimit(`login:${username}`, 5, 60_000); // 5/min per username
  if (!rl.allowed) {
    return {
      status: 'error',
      message: 'Too many attempts. Try later.',
    };
  }
  const existing = await db.query.user.findFirst({
    where: (u) => eq(u.name, username),
  });
  if (!existing) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const auth = await db.query.userAuth.findFirst({
    where: (ua) => eq(ua.userId, existing.id),
  });
  if (!auth) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const ok = await bunPassword.verify(password, auth.passwordHash);
  if (!ok) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const sessionId = randomUUID();
  const rawToken = generateSessionToken();
  const tokenHash = await hashToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  await db.insert(authenticationSchema.session).values({
    id: sessionId,
    token: tokenHash,
    userId: existing.id,
    createdAt: now,
    updatedAt: now,
    expiresAt,
  });
  const session = {
    id: sessionId,
    token: rawToken, // raw token only once
    userId: existing.id,
    createdAt: now,
    updatedAt: now,
    expiresAt,
    ipAddress: null,
    userAgent: null,
    impersonatedBy: null,
  };
  return {
    status: 'success',
    message: 'Logged in',
    data: {
      user: existing,
      session,
    },
  };
});
