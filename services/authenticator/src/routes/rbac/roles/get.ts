import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { db } from '@/utils/db';

export const getRoleHandler = os.rbac.roles.get.handler(async ({ input }) => {
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
