import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const request = oc
  .input(
    z.object({
      ...baseInput.shape,
      email: z.email(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
    })
  );
