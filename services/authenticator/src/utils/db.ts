import { drizzle } from 'drizzle-orm/bun-sql';
import { authorizationSchema } from '@/schemas/rbac';
import { authenticationSchema } from '@/schemas/user';
import { env } from '@/utils/env';

export const db = drizzle(env.POSTGRES_URL, {
  schema: {
    ...authenticationSchema,
    ...authorizationSchema,
  },
});
