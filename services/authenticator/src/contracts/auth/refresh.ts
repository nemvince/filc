import { oc } from '@orpc/contract';
import { z } from 'zod';
import { sessionSchema } from '@/schemas/user';
import { baseInput, baseOutput } from '@/utils/defaults';

export const refresh = oc.input(baseInput).output(
  z.object({
    ...baseOutput.shape,
    data: z
      .object({
        session: sessionSchema.select,
      })
      .optional(),
  })
);
