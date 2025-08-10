import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const introspect = oc.input(baseInput).output(
  z.object({
    ...baseOutput.shape,
    data: z
      .object({
        session: z
          .object({
            accessToken: z.string(),
            refreshToken: z.string(),
            expires: z.number(),
          })
          .optional(),
        user: z
          .object({
            id: z.uuid(),
            // TODO: Add actual user schema here
          })
          .optional(),
      })
      .optional(),
  })
);
