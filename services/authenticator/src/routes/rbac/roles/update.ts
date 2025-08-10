import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';

export const updateRoleHandler = os.rbac.roles.update.handler(
  async ({ input }) => {
    const ctx = await resolveAuthContext(input.accessToken);
    if (!hasPermission(ctx, 'roles:update')) {
      return { status: 'error', message: 'Forbidden' };
    }
    const { roleId, name, description } = input;
    const update: Partial<{
      name: string;
      description: string | null;
      updatedAt: Date;
    }> = { updatedAt: new Date() };
    if (name) {
      update.name = name;
    }
    if (description !== undefined) {
      update.description = description;
    }
    const [row] = await db
      .update(authorizationSchema.role)
      .set(update)
      .where(eq(authorizationSchema.role.id, roleId))
      .returning();
    if (!row) {
      return { status: 'error', message: 'Not found' };
    }
    return {
      status: 'success',
      message: 'Updated',
      data: {
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    };
  }
);
