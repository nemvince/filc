import { introspectHandler } from '@/routes/auth/introspect';
import { loginHandler } from '@/routes/auth/login';
import { logoutHandler } from '@/routes/auth/logout';
import { passwordResetRequestHandler } from '@/routes/auth/password-reset/request';
import { passwordResetVerifyHandler } from '@/routes/auth/password-reset/verify';
import { refreshHandler } from '@/routes/auth/refresh';
import { registerHandler } from '@/routes/auth/register';
import { revokeHandler } from '@/routes/auth/revoke';
import { os } from '@/routes/os';
import { createPermissionHandler } from '@/routes/rbac/permissions/create';
import { listPermissionsHandler } from '@/routes/rbac/permissions/list';
import { assignRolePermissionsHandler } from '@/routes/rbac/roles/assign-permissions';
import { createRoleHandler } from '@/routes/rbac/roles/create';
import { deleteRoleHandler } from '@/routes/rbac/roles/delete';
import { getRoleHandler } from '@/routes/rbac/roles/get';
import { listRolesHandler } from '@/routes/rbac/roles/list';
import { updateRoleHandler } from '@/routes/rbac/roles/update';
import { assignUserRolesHandler } from '@/routes/rbac/users/assign-roles';
import { getUserRolesHandler } from '@/routes/rbac/users/get-roles';

export const authenticatorRouter = os.router({
  auth: {
    passwordReset: {
      request: passwordResetRequestHandler,
      verify: passwordResetVerifyHandler,
    },
    register: registerHandler,
    login: loginHandler,
    logout: logoutHandler,
    introspect: introspectHandler,
    refresh: refreshHandler,
    revoke: revokeHandler,
  },
  rbac: {
    roles: {
      list: listRolesHandler,
      create: createRoleHandler,
      get: getRoleHandler,
      update: updateRoleHandler,
      delete: deleteRoleHandler,
      assignPermissions: assignRolePermissionsHandler,
    },
    permissions: {
      list: listPermissionsHandler,
      create: createPermissionHandler,
    },
    users: {
      assignRoles: assignUserRolesHandler,
      getRoles: getUserRolesHandler,
    },
  },
});
