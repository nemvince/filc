import { randomUUID } from 'node:crypto';
import { password as bunPassword } from 'bun';
import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { audit } from '@/utils/audit';
import { db } from '@/utils/db';
import { checkRateLimit } from '@/utils/rate-limit';
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
    audit('auth.login.fail', { success: false, meta: { username } });
    return { status: 'error', message: 'Invalid credentials' } as const;
  }
  const auth = await db.query.userAuth.findFirst({
    where: (ua) => eq(ua.userId, existing.id),
  });
  if (!auth) {
    audit('auth.login.fail', { success: false, meta: { username } });
    return { status: 'error', message: 'Invalid credentials' } as const;
  }
  const ok = await bunPassword.verify(password, auth.passwordHash);
  if (!ok) {
    audit('auth.login.fail', {
      success: false,
      actor: existing.id,
      meta: { username },
    });
    return { status: 'error', message: 'Invalid credentials' } as const;
  }
  const sessionId = randomUUID();
  const rawAccessToken = generateSessionToken();
  const accessTokenHash = await hashToken(rawAccessToken);
  const rawRefreshToken = generateSessionToken(48);
  const refreshTokenHash = await hashToken(rawRefreshToken);
  const now = new Date();
  const accessExpiresAt = new Date(now.getTime() + 1000 * 60 * 15); // 15m
  const refreshExpiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30d
  await db.transaction(async (tx) => {
    await tx.insert(authenticationSchema.session).values({
      id: sessionId,
      token: accessTokenHash,
      userId: existing.id,
      createdAt: now,
      updatedAt: now,
      expiresAt: accessExpiresAt,
    });
    await tx.insert(authenticationSchema.refreshSession).values({
      id: randomUUID(),
      sessionId,
      userId: existing.id,
      token: refreshTokenHash,
      createdAt: now,
      updatedAt: now,
      expiresAt: refreshExpiresAt,
    });
  });
  const session = {
    id: sessionId,
    token: rawAccessToken, // raw token only once
    userId: existing.id,
    createdAt: now,
    updatedAt: now,
    expiresAt: accessExpiresAt,
    ipAddress: null,
    userAgent: null,
    impersonatedBy: null,
  };
  audit('auth.login.success', {
    success: true,
    actor: existing.id,
    meta: { sessionId },
  });
  return {
    status: 'success',
    message: 'Logged in',
    data: {
      user: existing,
      session,
      refreshToken: rawRefreshToken,
    },
  };
});
