import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';

export const deleteRoleHandler = os.rbac.roles.delete.handler(
  async ({ input }) => {
    const ctx = await resolveAuthContext(input.accessToken);
    if (!hasPermission(ctx, 'roles:delete')) {
      return { status: 'error', message: 'Forbidden' };
    }
    const { roleId } = input;
    await db
      .delete(authorizationSchema.role)
      .where(eq(authorizationSchema.role.id, roleId));
    return { status: 'success', message: 'Deleted' };
  }
);
