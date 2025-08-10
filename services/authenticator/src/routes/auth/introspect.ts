import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { db } from '@/utils/db';

export const introspectHandler = os.auth.introspect.handler(
  async ({ input }) => {
    const { accessToken } = input;
    const sess = await db.query.session.findFirst({
      where: (s) => eq(s.token, accessToken),
    });
    if (!sess) {
      return { status: 'error', message: 'Session not found' };
    }
    const usr = await db.query.user.findFirst({
      where: (u) => eq(u.id, sess.userId),
    });
    if (!usr) {
      return { status: 'error', message: 'User not found' };
    }
    return {
      status: 'success',
      message: 'OK',
      data: { session: sess, user: usr },
    };
  }
);
