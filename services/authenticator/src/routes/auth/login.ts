import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';

export const loginHandler = os.auth.login.handler(async ({ input }) => {
  const { username, password } = input;
  const existing = await db.query.user.findFirst({
    where: (u) => eq(u.name, username),
  });
  if (!existing) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const auth = await db.query.userAuth.findFirst({
    where: (ua) => eq(ua.userId, existing.id),
  });
  if (!auth) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const ok = await globalThis.Bun.password.verify(password, auth.passwordHash);
  if (!ok) {
    return { status: 'error', message: 'Invalid credentials' };
  }
  const sessionId = randomUUID();
  const token = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  const sess = await db.insert(authenticationSchema.session).values({
    id: sessionId,
    token,
    userId: existing.id,
    createdAt: now,
    updatedAt: now,
    expiresAt,
  });
  return {
    status: 'success',
    message: 'Logged in',
    data: {
      user: existing,
      session: sess,
    },
  };
});
