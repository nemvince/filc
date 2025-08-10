import { oc } from '@orpc/contract';
import { z } from 'zod';
import { permissionSchema } from '@/schemas/rbac';
import { baseInput, baseOutput } from '@/utils/defaults';

export const createPermission = oc
  .input(
    z.object({
      ...baseInput.shape,
      data: permissionSchema.insert,
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: permissionSchema.select.optional(),
    })
  );
