import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { audit } from '@/utils/audit';
import { db } from '@/utils/db';
import { generateSessionToken, hashToken } from '@/utils/security';

export const refreshHandler = os.auth.refresh.handler(async ({ input }) => {
  const { refreshToken } = input;
  const refreshHash = await hashToken(refreshToken);
  const existingRefresh = await db.query.refreshSession.findFirst({
    where: (r) => eq(r.token, refreshHash),
  });
  if (!existingRefresh) {
    audit('auth.refresh.fail', {
      success: false,
      meta: { reason: 'not_found' },
    });
    return { status: 'error', message: 'Invalid token' } as const;
  }
  if (existingRefresh.expiresAt.getTime() <= Date.now()) {
    audit('auth.refresh.fail', {
      success: false,
      actor: existingRefresh.userId,
      meta: { reason: 'expired' },
    });
    return { status: 'error', message: 'Expired token' } as const;
  }
  const session = await db.query.session.findFirst({
    where: (s) => eq(s.id, existingRefresh.sessionId),
  });
  if (!session) {
    audit('auth.refresh.fail', {
      success: false,
      actor: existingRefresh.userId,
      meta: { reason: 'session_missing' },
    });
    return { status: 'error', message: 'Session missing' } as const;
  }
  const now = new Date();
  const newAccessToken = generateSessionToken();
  const newAccessHash = await hashToken(newAccessToken);
  const newAccessExpires = new Date(now.getTime() + 1000 * 60 * 15);
  const newRefreshToken = generateSessionToken(48);
  const newRefreshHash = await hashToken(newRefreshToken);
  const newRefreshExpires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
  await db.transaction(async (tx) => {
    await tx
      .update(authenticationSchema.session)
      .set({
        token: newAccessHash,
        updatedAt: now,
        expiresAt: newAccessExpires,
      })
      .where(eq(authenticationSchema.session.id, session.id));
    await tx
      .update(authenticationSchema.refreshSession)
      .set({
        token: newRefreshHash,
        updatedAt: now,
        expiresAt: newRefreshExpires,
      })
      .where(eq(authenticationSchema.refreshSession.id, existingRefresh.id));
  });
  const updatedSession = await db.query.session.findFirst({
    where: (s) => eq(s.id, session.id),
  });
  if (!updatedSession) {
    return { status: 'error', message: 'Session update failed' } as const;
  }
  audit('auth.refresh.success', {
    success: true,
    actor: existingRefresh.userId,
    meta: { sessionId: session.id },
  });
  return {
    status: 'success',
    message: 'Refreshed',
    data: {
      session: { ...updatedSession, token: newAccessToken },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
});
