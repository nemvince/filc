import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';
import { hashToken } from '@/utils/security';

export const logoutHandler = os.auth.logout.handler(async ({ input }) => {
  const { accessToken } = input;
  const tokenHash = await hashToken(accessToken);
  await db
    .delete(authenticationSchema.session)
    .where(eq(authenticationSchema.session.token, tokenHash));
  return { status: 'success', message: 'Logged out' };
});
