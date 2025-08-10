import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const assignRolePermissions = oc
  .input(
    z.object({
      ...baseInput.shape,
      roleId: z.uuid(),
      permissions: z.array(z.string().min(1)).min(1),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          roleId: z.uuid(),
          permissions: z.array(z.string()),
        })
        .optional(),
    })
  );
