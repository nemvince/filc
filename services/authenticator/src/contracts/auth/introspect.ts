import { oc } from '@orpc/contract';
import { z } from 'zod';
import { sessionSchema, userSchema } from '@/schemas/user';
import { baseInput, baseOutput } from '@/utils/defaults';

export const introspect = oc.input(baseInput).output(
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
