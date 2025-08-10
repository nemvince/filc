import { env as bunEnv } from 'bun';
import { z } from 'zod';

const schema = z.object({
  MODE: z.enum(['development', 'production']).default('development'),
  POSTGRES_URL: z.url().describe('Database connection URL'),
});

const parsed = schema.safeParse(bunEnv);

if (!parsed.success) {
  // biome-ignore lint/suspicious/noConsole: TODO: Handle error properly
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(parsed.error.format(), null, 4)
  );
  process.exit(1);
}

export const env = parsed.data;
