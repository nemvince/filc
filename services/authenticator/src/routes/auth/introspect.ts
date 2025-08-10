import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { session } from '@/schemas/user';
import { audit } from '@/utils/audit';
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
      audit('auth.introspect.fail', {
        success: false,
        meta: { reason: 'not_found' },
      });
      return { status: 'error', message: 'Session not found' };
    }
    if (sess.expiresAt.getTime() <= Date.now()) {
      await db.delete(session).where(eq(session.id, sess.id));
      audit('auth.introspect.fail', {
        success: false,
        actor: sess.userId,
        meta: { reason: 'expired' },
      });
      return { status: 'error', message: 'Expired session' };
    }
    const usr = await db.query.user.findFirst({
      where: (u) => eq(u.id, sess.userId),
    });
    if (!usr) {
      audit('auth.introspect.fail', {
        success: false,
        actor: sess.userId,
        meta: { reason: 'user_missing' },
      });
      return { status: 'error', message: 'User not found' };
    }
    audit('auth.introspect.success', {
      success: true,
      actor: sess.userId,
      meta: { sessionId: sess.id },
    });
    return {
      status: 'success',
      message: 'OK',
      data: { session: sess, user: usr },
    };
  }
);
