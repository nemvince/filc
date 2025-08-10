import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const revoke = oc
  .input(
    z.object({
      ...baseInput.shape,
      sessionId: z.string(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
    })
  );
