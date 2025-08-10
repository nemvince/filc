import z from 'zod';

export const baseInput = z.object({
  accessToken: z.string(),
  source: z.string(),
});

export const baseOutput = z.object({
  status: z.enum(['success', 'error']),
  message: z.string(),
});
