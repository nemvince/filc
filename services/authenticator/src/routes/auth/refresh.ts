import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';

export const refreshHandler = os.auth.refresh.handler(async ({ input }) => {
  const { accessToken } = input;
  const existing = await db.query.session.findFirst({
    where: (sess) => eq(sess.token, accessToken),
  });
  if (!existing) {
    return { status: 'error', message: 'Invalid session' };
  }
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  const newToken = randomUUID();
  await db
    .update(authenticationSchema.session)
    .set({ token: newToken, updatedAt: now, expiresAt })
    .where(eq(authenticationSchema.session.id, existing.id));
  const updated = await db.query.session.findFirst({
    where: (sess) => eq(sess.id, existing.id),
  });
  if (!updated) {
    return { status: 'error', message: 'Session update failed' };
  }
  return {
    status: 'success',
    message: 'Refreshed',
    data: { session: updated },
  };
});
