import { count, ilike } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const listPermissionsHandler = os.rbac.permissions.list.handler(
  async ({ input }) => {
    const { page, pageSize, query } = input;
    const offset = (page - 1) * pageSize;
    const where = query
      ? ilike(authorizationSchema.permission.name, `%${query}%`)
      : undefined;
    const items = await db
      .select()
      .from(authorizationSchema.permission)
      .where(where)
      .limit(pageSize)
      .offset(offset);
    const totalRow = await db
      .select({ value: count() })
      .from(authorizationSchema.permission)
      .where(where);
    const total = totalRow[0]?.value ?? 0;
    return {
      status: 'success',
      message: 'OK',
      data: { items, page, pageSize, total },
    };
  }
);
