import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

export const logout = oc.input(baseInput).output(
  z.object({
    ...baseOutput.shape,
  })
);
