import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { audit } from '@/utils/audit';
import { db } from '@/utils/db';
import { hashToken } from '@/utils/security';

export const logoutHandler = os.auth.logout.handler(async ({ input }) => {
  const { accessToken } = input;
  const tokenHash = await hashToken(accessToken);
  const sess = await db.query.session.findFirst({
    where: (s) => eq(s.token, tokenHash),
  });
  if (sess) {
    await db.transaction(async (tx) => {
      await tx
        .delete(authenticationSchema.refreshSession)
        .where(eq(authenticationSchema.refreshSession.sessionId, sess.id));
      await tx
        .delete(authenticationSchema.session)
        .where(eq(authenticationSchema.session.id, sess.id));
    });
    audit('auth.logout', {
      success: true,
      actor: sess.userId,
      meta: { sessionId: sess.id },
    });
  }
  return { status: 'success', message: 'Logged out' } as const;
});
