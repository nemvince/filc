import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { session } from '@/schemas/user';
import { db } from '@/utils/db';
import { hashToken } from '@/utils/security';

export const introspectHandler = os.auth.introspect.handler(
  async ({ input }) => {
    const { accessToken } = input;
    const accessTokenHash = await hashToken(accessToken);
    const sess = await db.query.session.findFirst({
      where: (s) => eq(s.token, accessTokenHash),
    });
    if (!sess) {
      return { status: 'error', message: 'Session not found' };
    }
    if (sess.expiresAt.getTime() <= Date.now()) {
      // delete expired session
      await db.delete(session).where(eq(session.id, sess.id));
      return { status: 'error', message: 'Expired session' };
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
