import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseOutput } from '@/utils/defaults';

export const register = oc
  .input(
    z.object({
      username: z.string().min(3).max(30),
      password: z.string().min(6).max(100),
      email: z.email(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          userId: z.uuid(),
          status: z.enum(['verification_pending', 'active']),
        })
        .optional(),
    })
  );
