import { eq, inArray } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const getUserRolesHandler = os.rbac.users.getRoles.handler(
  async ({ input }) => {
    const { userId } = input;
    const roles = await db
      .select({ roleId: authorizationSchema.userRole.roleId })
      .from(authorizationSchema.userRole)
      .where(eq(authorizationSchema.userRole.userId, userId));
    const roleIds = roles.map((r) => r.roleId);
    let permissions: string[] = [];
    if (roleIds.length) {
      const permRows = await db
        .select({
          permissionName: authorizationSchema.rolePermission.permissionName,
        })
        .from(authorizationSchema.rolePermission)
        .where(inArray(authorizationSchema.rolePermission.roleId, roleIds));
      permissions = permRows.map((p) => p.permissionName);
    }
    return {
      status: 'success',
      message: 'OK',
      data: { userId, roles: roleIds, permissions },
    };
  }
);
