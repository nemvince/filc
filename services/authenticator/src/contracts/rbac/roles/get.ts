import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';
import { roleSchema } from './schemas.js';

export const getRole = oc
  .input(
    z.object({
      ...baseInput.shape,
      roleId: z.uuid(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: roleSchema.optional(),
    })
  );
