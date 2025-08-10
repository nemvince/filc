import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const logout = oc
  .input(
    z.object({
      accessToken: baseInput.shape.accessToken,
      source: baseInput.shape.source,
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
    })
  );
