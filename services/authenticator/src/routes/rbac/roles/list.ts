import { count, ilike } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

export const listRolesHandler = os.rbac.roles.list.handler(
  async ({ input }) => {
    const { page, pageSize, query } = input;
    const offset = (page - 1) * pageSize;
    const where = query
      ? ilike(authorizationSchema.role.name, `%${query}%`)
      : undefined;
    const rows = await db
      .select()
      .from(authorizationSchema.role)
      .where(where)
      .limit(pageSize)
      .offset(offset);
    const items = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
    const totalRow = await db
      .select({ value: count() })
      .from(authorizationSchema.role)
      .where(where);
    const total = totalRow[0]?.value ?? 0;
    return {
      status: 'success',
      message: 'OK',
      data: { items, page, pageSize, total },
    };
  }
);
