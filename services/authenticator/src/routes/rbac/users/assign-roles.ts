import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const assignUserRolesHandler = os.rbac.users.assignRoles.handler(
  async ({ input }) => {
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
