import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { audit } from '@/utils/audit';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';

export const revokeHandler = os.auth.revoke.handler(async ({ input }) => {
  const { sessionId, accessToken } = input;
  const ctx = await resolveAuthContext(accessToken);
  if (!ctx) {
    audit('auth.revoke.fail', {
      success: false,
      meta: { reason: 'unauthenticated' },
    });
    return { status: 'error', message: 'Unauthorized' } as const;
  }
  const sess = await db.query.session.findFirst({
    where: (s) => eq(s.id, sessionId),
  });
  if (!sess) {
    audit('auth.revoke.fail', {
      success: false,
      actor: ctx.userId,
      meta: { reason: 'not_found', sessionId },
    });
    return { status: 'error', message: 'Not found' } as const;
  }
  if (
    sess.userId !== ctx.userId &&
    !hasPermission(ctx, 'sessions:revoke:any')
  ) {
    audit('auth.revoke.fail', {
      success: false,
      actor: ctx.userId,
      meta: { reason: 'forbidden', sessionId },
    });
    return { status: 'error', message: 'Forbidden' } as const;
  }
  await db.transaction(async (tx) => {
    await tx
      .delete(authenticationSchema.refreshSession)
      .where(eq(authenticationSchema.refreshSession.sessionId, sessionId));
    await tx
      .delete(authenticationSchema.session)
      .where(eq(authenticationSchema.session.id, sessionId));
  });
  audit('auth.revoke.success', {
    success: true,
    actor: ctx.userId,
    meta: { sessionId },
  });
  return { status: 'success', message: 'Session revoked' } as const;
});
