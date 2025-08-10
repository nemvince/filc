import { implement } from '@orpc/server';
import { authenticatorContract } from '@/contracts';

export const authenticatorCore = implement(authenticatorContract);
export const authenticatorRouter = authenticatorCore.router({
  auth: {
    passwordReset: {},
  },
  rbac: {},
});
