import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const deleteRoleHandler = os.rbac.roles.delete.handler(
  async ({ input }) => {
    const { roleId } = input;
    await db
      .delete(authorizationSchema.role)
      .where(eq(authorizationSchema.role.id, roleId));
    return { status: 'success', message: 'Deleted' };
  }
);
