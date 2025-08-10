import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const verify = oc
  .input(
    z.object({
      ...baseInput.shape,
      token: z.string(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
    })
  );
