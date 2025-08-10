import { eq, inArray } from 'drizzle-orm';
import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';
import { hashToken } from '@/utils/security';

export interface AuthContext {
  userId: string;
  roles: string[];
  permissions: string[];
}

export async function resolveAuthContext(
  rawToken: string
): Promise<AuthContext | null> {
  const tokenHash = await hashToken(rawToken);
  const session = await db.query.session.findFirst({
    where: (s) => eq(s.token, tokenHash),
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }
  const userId = session.userId;
  const roleRows = await db
    .select({ roleId: authorizationSchema.userRole.roleId })
    .from(authorizationSchema.userRole)
    .where(eq(authorizationSchema.userRole.userId, userId));
  const roles = roleRows.map((r) => r.roleId);
  let permissions: string[] = [];
  if (roles.length) {
    const permRows = await db
      .select({ permission: authorizationSchema.rolePermission.permissionName })
      .from(authorizationSchema.rolePermission)
      .where(inArray(authorizationSchema.rolePermission.roleId, roles));
    permissions = [...new Set(permRows.map((p) => p.permission))];
  }
  return { userId, roles, permissions };
}

export function hasPermission(
  ctx: AuthContext | null,
  needed: string | string[]
): boolean {
  if (!ctx) {
    return false;
  }
  const list = Array.isArray(needed) ? needed : [needed];
  return list.every((p) => ctx.permissions.includes(p));
}
