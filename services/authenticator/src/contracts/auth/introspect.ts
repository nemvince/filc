import { oc } from '@orpc/contract';
import { z } from 'zod';
import { sessionSchema, userSchema } from '@/schemas/user';
import { baseInput, baseOutput } from '@/utils/defaults';

export const introspect = oc
  .input(
    z.object({
      accessToken: baseInput.shape.accessToken,
      source: baseInput.shape.source,
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          session: sessionSchema.select,
          user: userSchema.select,
        })
        .optional(),
    })
  );
