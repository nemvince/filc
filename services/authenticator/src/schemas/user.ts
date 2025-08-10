import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const user = pgTable('user', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  active: boolean(),
});

export const userAuth = pgTable('user_auth', {
  userId: text()
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  passwordHash: text().notNull(),
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text(),
});

export const verification = pgTable('verification', {
  id: text().primaryKey(),
  token: text().notNull().unique(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  expiresAt: timestamp().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  verified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  verificationCode: text().notNull(),
});

export const authenticationSchema = {
  user,
  userAuth,
  session,
  verification,
};

export const userSchema = {
  insert: createInsertSchema(user),
  select: createSelectSchema(user),
  update: createUpdateSchema(user),
};

export const sessionSchema = {
  insert: createInsertSchema(session),
  select: createSelectSchema(session),
  update: createUpdateSchema(session),
};

export const verificationSchema = {
  insert: createInsertSchema(verification),
  select: createSelectSchema(verification),
  update: createUpdateSchema(verification),
};
