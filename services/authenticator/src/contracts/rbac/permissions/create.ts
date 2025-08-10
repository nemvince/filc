import { oc } from '@orpc/contract';
import { z } from 'zod';
import { baseInput, baseOutput } from '@/utils/defaults';
import { permissionSchema } from './list';

export const createPermission = oc
  .input(
    z.object({
      ...baseInput.shape,
      name: permissionSchema.shape.name,
      description: permissionSchema.shape.description,
    })
  )
  .output(
    z.object({
      ...baseOutput.shape,
      data: permissionSchema.optional(),
    })
  );
