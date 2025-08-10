import { introspect } from './auth/introspect';
import { login } from './auth/login';
import { logout } from './auth/logout';
import { request } from './auth/password-reset/request';
import { verify } from './auth/password-reset/verify';
import { refresh } from './auth/refresh';
import { register } from './auth/register';
import { revoke } from './auth/revoke';
import { createPermission } from './rbac/permissions/create';
import { listPermissions } from './rbac/permissions/list';
import { assignRolePermissions } from './rbac/roles/assign-permissions';
import { createRole } from './rbac/roles/create';
import { deleteRole } from './rbac/roles/delete';
import { getRole } from './rbac/roles/get';
import { listRoles } from './rbac/roles/list';
import { updateRole } from './rbac/roles/update';
import { assignUserRoles } from './rbac/users/assign-roles';
import { getUserRoles } from './rbac/users/get-roles';

export const authenticatorContract = {
  auth: {
    passwordReset: {
      request,
      verify,
    },
    introspect,
    login,
    logout,
    refresh,
    register,
    revoke,
  },
  rbac: {
    roles: {
      list: listRoles,
      create: createRole,
      get: getRole,
      update: updateRole,
      delete: deleteRole,
      assignPermissions: assignRolePermissions,
    },
    permissions: {
      list: listPermissions,
      create: createPermission,
    },
    users: {
      assignRoles: assignUserRoles,
      getRoles: getUserRoles,
    },
  },
};
