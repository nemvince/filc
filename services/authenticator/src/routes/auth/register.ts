import { randomUUIDv7 } from 'bun';
import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authenticationSchema } from '@/schemas/user';
import { db } from '@/utils/db';
import { checkRateLimit } from '@/utils/rateLimit';
import { hashPassword } from '@/utils/security';

export const registerHandler = os.auth.register.handler(async ({ input }) => {
  const { username, password, email } = input;
  const rlUser = checkRateLimit(`reg:user:${username}`, 3, 60_000);
  const rlEmail = checkRateLimit(`reg:email:${email}`, 3, 60_000);
  if (!rlUser.allowed) {
    return { status: 'error', message: 'Too many registration attempts' };
  }
  if (!rlEmail.allowed) {
    return { status: 'error', message: 'Too many registration attempts' };
  }
  const existing = await db.query.user.findFirst({
    where: (u, { or }) => or(eq(u.email, email), eq(u.name, username)),
  });
  if (existing) {
    return { status: 'error', message: 'User already exists' };
  }
  const userId = randomUUIDv7();
  const now = new Date();
  try {
    const passwordHash = await hashPassword(password);
    await db.transaction(async (tx) => {
      await tx.insert(authenticationSchema.user).values({
        id: userId,
        name: username,
        email,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
        active: true,
      });
      await tx.insert(authenticationSchema.userAuth).values({
        userId,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    });
    return {
      status: 'success',
      message: 'Registered',
      data: { userId, status: 'active' as const },
    };
  } catch {
    return { status: 'error', message: 'Registration failed' };
  }
});
