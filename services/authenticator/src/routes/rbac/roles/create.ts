import { randomUUID } from 'node:crypto';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const createRoleHandler = os.rbac.roles.create.handler(
  async ({ input }) => {
    const { name, description } = input;
    const id = randomUUID();
    const now = new Date();
    await db.insert(authorizationSchema.role).values({
      id,
      name,
      description: description ?? null,
      createdAt: now,
      updatedAt: now,
    });
    return {
      status: 'success',
      message: 'Created',
      data: {
        id,
        name,
        description: description ?? null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    };
  }
);
