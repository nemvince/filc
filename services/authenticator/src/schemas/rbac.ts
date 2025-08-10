import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { user } from './user';

export const role = pgTable('role', {
  id: text().primaryKey(), // UUID string
  name: text().notNull().unique(),
  description: text(),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const permission = pgTable('permission', {
  name: text().primaryKey(),
  description: text(),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const rolePermission = pgTable('role_permission', {
  roleId: text()
    .notNull()
    .references(() => role.id, { onDelete: 'cascade' }),
  permissionName: text()
    .notNull()
    .references(() => permission.name, { onDelete: 'cascade' }),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRole = pgTable('user_role', {
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  roleId: text()
    .notNull()
    .references(() => role.id, { onDelete: 'cascade' }),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const authorizationSchema = {
  role,
  permission,
  rolePermission,
  userRole,
};

export const roleSchema = {
  insert: createInsertSchema(role),
  select: createSelectSchema(role),
  update: createUpdateSchema(role),
};

export const permissionSchema = {
  insert: createInsertSchema(permission),
  select: createSelectSchema(permission),
  update: createUpdateSchema(permission),
};

export const rolePermissionSchema = {
  insert: createInsertSchema(rolePermission),
  select: createSelectSchema(rolePermission),
  update: createUpdateSchema(rolePermission),
};

export const userRoleSchema = {
  insert: createInsertSchema(userRole),
  select: createSelectSchema(userRole),
  update: createUpdateSchema(userRole),
};
