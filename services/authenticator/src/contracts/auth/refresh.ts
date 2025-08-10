import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const refresh = oc.input(baseInput).output(
  z.object({
    ...baseOutput.shape,
    data: z
      .object({
        session: z.object({
          accessToken: z.string(),
          refreshToken: z.string(),
          expires: z.number(),
        }),
      })
      .optional(),
  })
);
