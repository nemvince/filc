import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseOutput } from '@/utils/defaults';

export const login = oc
  .input(
    z.object({
      username: z.string().min(3).max(30),
      password: z.string().min(6).max(100),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          user: z.object({
            // TODO: Add actual user schema here
            id: z.uuid(),
          }),
          session: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expires: z.number(),
          }),
        })
        .optional(),
    })
  );
