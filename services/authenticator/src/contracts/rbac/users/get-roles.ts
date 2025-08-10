import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const getUserRoles = oc
  .input(
    z.object({
      ...baseInput.shape,
      userId: z.uuid(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          userId: z.uuid(),
          roles: z.array(z.string()),
          permissions: z.array(z.string()),
        })
        .optional(),
    })
  );
