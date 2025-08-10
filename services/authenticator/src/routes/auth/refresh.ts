import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';
import { generateSessionToken, hashToken } from '@/utils/security';

export const refreshHandler = os.auth.refresh.handler(async ({ input }) => {
  const { accessToken } = input;
  const accessTokenHash = await hashToken(accessToken);
  const existing = await db.query.session.findFirst({
    where: (sess) => eq(sess.token, accessTokenHash),
  });
  if (!existing) {
    return { status: 'error', message: 'Invalid session' };
  }
  const now = new Date();
  if (existing.expiresAt.getTime() <= now.getTime()) {
    return { status: 'error', message: 'Expired session' };
  }
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  const newRawToken = generateSessionToken();
  const newTokenHash = await hashToken(newRawToken);
  const updateResult = await db
    .update(authenticationSchema.session)
    .set({ token: newTokenHash, updatedAt: now, expiresAt })
    .where(eq(authenticationSchema.session.id, existing.id));
  if (!updateResult) {
    return { status: 'error', message: 'Session update failed' };
  }
  const updated = await db.query.session.findFirst({
    where: (sess) => eq(sess.id, existing.id),
  });
  if (!updated) {
    return { status: 'error', message: 'Session update failed' };
  }
  return {
    status: 'success',
    message: 'Refreshed',
    data: {
      session: { ...updated, token: newRawToken }, // return new raw token
    },
  };
});
