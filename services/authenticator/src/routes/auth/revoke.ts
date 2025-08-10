import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';

export const revokeHandler = os.auth.revoke.handler(async ({ input }) => {
  const { sessionId } = input;
  // TODO: enforce that caller owns the session or has admin permission
  await db
    .delete(authenticationSchema.session)
    .where(eq(authenticationSchema.session.id, sessionId));
  return { status: 'success', message: 'Session revoked' };
});
