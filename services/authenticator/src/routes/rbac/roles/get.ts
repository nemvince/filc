import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';
import { PERMISSIONS } from '@/utils/permissions';

export const getRoleHandler = os.rbac.roles.get.handler(async ({ input }) => {
  const ctx = await resolveAuthContext(input.accessToken);
  if (!hasPermission(ctx, [PERMISSIONS.ROLES_GET, PERMISSIONS.ROLES_LIST])) {
    return { status: 'error', message: 'Forbidden' };
  }
  const { roleId } = input;
  const row = await db.query.role.findFirst({
    where: (r) => eq(r.id, roleId),
  });
  if (!row) {
    return { status: 'error', message: 'Not found' };
  }
  return {
    status: 'success',
    message: 'OK',
    data: {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    },
  };
});
