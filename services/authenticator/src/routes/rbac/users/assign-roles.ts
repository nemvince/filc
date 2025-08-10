import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';
import { PERMISSIONS } from '@/utils/permissions';

export const assignUserRolesHandler = os.rbac.users.assignRoles.handler(
  async ({ input }) => {
    const ctx = await resolveAuthContext(input.accessToken);
    if (!hasPermission(ctx, PERMISSIONS.USERS_ASSIGN_ROLES)) {
      return { status: 'error', message: 'Forbidden' };
    }
    const { userId, roles } = input;
    await db
      .delete(authorizationSchema.userRole)
      .where(eq(authorizationSchema.userRole.userId, userId));
    await db
      .insert(authorizationSchema.userRole)
      .values(roles.map((r) => ({ userId, roleId: r, createdAt: new Date() })));
    return { status: 'success', message: 'Assigned', data: { userId, roles } };
  }
);
