import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';
import { roleSchema } from './schemas';

export const createRole = oc
  .input(
    z.object({
      ...baseInput.shape,
      name: roleSchema.shape.name,
      description: roleSchema.shape.description,
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: roleSchema.optional(),
    })
  );
