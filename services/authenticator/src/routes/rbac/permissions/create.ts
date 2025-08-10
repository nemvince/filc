import { eq } from 'drizzle-orm';
import { os } from '@/routes/os';
import { authorizationSchema } from '@/schemas/rbac';
import { hasPermission, resolveAuthContext } from '@/utils/authz';
import { db } from '@/utils/db';

export const createPermissionHandler = os.rbac.permissions.create.handler(
  async ({ input }) => {
    const ctx = await resolveAuthContext(input.accessToken);
    if (!hasPermission(ctx, 'permissions:create')) {
      return { status: 'error', message: 'Forbidden' };
    }
    const { data } = input;
    const now = new Date();
    await db.insert(authorizationSchema.permission).values({
      name: data.name,
      description: data.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
    const inserted = await db.query.permission.findFirst({
      where: (p) => eq(p.name, data.name),
    });
    if (!inserted) {
      return { status: 'error', message: 'Insert failed' };
    }
    // permissionSchema.select expects Date objects for createdAt/updatedAt
    return { status: 'success', message: 'Created', data: inserted };
  }
);
