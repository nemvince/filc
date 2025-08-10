import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';

const roleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(64),
  description: z.string().max(256).nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listRoles = oc
  .input(
    z.object({
      ...baseInput.shape,
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
      query: z.string().max(64).optional(),
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: z
        .object({
          items: z.array(roleSchema),
          page: z.number(),
          pageSize: z.number(),
          total: z.number(),
        })
        .optional(),
    })
  );

export type Role = z.infer<typeof roleSchema>;
