import { authorizationSchema } from '@/schemas/rbac';
import { db } from '@/utils/db';

// Canonical permission names (deduplicated, single source of truth)
export const PERMISSIONS = {
  ROLES_CREATE: 'roles:create',
  ROLES_LIST: 'roles:list',
  ROLES_GET: 'roles:get',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  ROLES_ASSIGN_PERMISSIONS: 'roles:assignPermissions',
  PERMISSIONS_CREATE: 'permissions:create',
  PERMISSIONS_LIST: 'permissions:list',
  USERS_ASSIGN_ROLES: 'users:assignRoles',
  USERS_GET_ROLES: 'users:getRoles',
  SESSIONS_REVOKE_ANY: 'sessions:revoke:any',
} as const;

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: PermissionValue[] = Object.values(PERMISSIONS);

const DESCRIPTIONS: Record<PermissionValue, string> = {
  [PERMISSIONS.ROLES_CREATE]: 'Create roles',
  [PERMISSIONS.ROLES_LIST]: 'List roles',
  [PERMISSIONS.ROLES_GET]: 'Get a role',
  [PERMISSIONS.ROLES_UPDATE]: 'Update roles',
  [PERMISSIONS.ROLES_DELETE]: 'Delete roles',
  [PERMISSIONS.ROLES_ASSIGN_PERMISSIONS]: 'Assign permissions to roles',
  [PERMISSIONS.PERMISSIONS_CREATE]: 'Create permissions',
  [PERMISSIONS.PERMISSIONS_LIST]: 'List permissions',
  [PERMISSIONS.USERS_ASSIGN_ROLES]: 'Assign roles to users',
  [PERMISSIONS.USERS_GET_ROLES]: 'Get user roles',
  [PERMISSIONS.SESSIONS_REVOKE_ANY]: 'Revoke any user session',
};

export async function seedPermissions(): Promise<void> {
  const existingRows = await db.select().from(authorizationSchema.permission);
  const existing = new Set(existingRows.map((r) => r.name));
  const toInsert = ALL_PERMISSIONS.filter((p) => !existing.has(p));
  if (!toInsert.length) {
    return;
  }
  const now = new Date();
  await db.insert(authorizationSchema.permission).values(
    toInsert.map((name) => ({
      name,
      description: DESCRIPTIONS[name],
      createdAt: now,
      updatedAt: now,
    }))
  );
}
