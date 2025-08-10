import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';
import { PERMISSIONS } from '@/utils/permissions';

export const assignRolePermissionsHandler =
  os.rbac.roles.assignPermissions.handler(async ({ input }) => {
    const ctx = await resolveAuthContext(input.accessToken);
    if (!hasPermission(ctx, PERMISSIONS.ROLES_ASSIGN_PERMISSIONS)) {
      return { status: 'error', message: 'Forbidden' };
    }
    const { roleId, permissions } = input;
    // delete existing
    await db
      .delete(authorizationSchema.rolePermission)
      .where(eq(authorizationSchema.rolePermission.roleId, roleId));
    // insert new
    await db.insert(authorizationSchema.rolePermission).values(
      permissions.map((p) => ({
        roleId,
        permissionName: p,
        createdAt: new Date(),
      }))
    );
    return {
      status: 'success',
      message: 'Assigned',
      data: { roleId, permissions },
    };
  });
