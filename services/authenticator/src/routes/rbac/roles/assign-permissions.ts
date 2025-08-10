import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const assignRolePermissionsHandler =
  os.rbac.roles.assignPermissions.handler(async ({ input }) => {
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
