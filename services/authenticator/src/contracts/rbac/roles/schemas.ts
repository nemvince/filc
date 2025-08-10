import { z } from 'zod';

export const roleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(64),
  description: z.string().max(256).nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Role = z.infer<typeof roleSchema>;
