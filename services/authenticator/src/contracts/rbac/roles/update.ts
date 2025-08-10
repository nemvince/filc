import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';
import { roleSchema } from './schemas.js';

export const updateRole = oc
  .input(
    z.object({
      ...baseInput.shape,
      roleId: z.uuid(),
      name: z.string().min(1).max(64).optional(),
      description: z.string().max(256).nullable().optional(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: roleSchema.optional(),
    })
  );
