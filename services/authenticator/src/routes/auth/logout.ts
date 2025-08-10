import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';

export const logoutHandler = os.auth.logout.handler(async ({ input }) => {
  const { accessToken } = input;
  await db
    .delete(authenticationSchema.session)
    .where(eq(authenticationSchema.session.token, accessToken));
  return { status: 'success', message: 'Logged out' };
});
