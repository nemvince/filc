import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const deleteRole = oc
  .input(
    z.object({
      ...baseInput.shape,
      roleId: z.uuid(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
    })
  );
