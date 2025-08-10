import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const assignUserRoles = oc
  .input(
    z.object({
      ...baseInput.shape,
      userId: z.uuid(),
      roles: z.array(z.string().min(1)).min(1),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          userId: z.uuid(),
          roles: z.array(z.string()),
        })
        .optional(),
    })
  );
