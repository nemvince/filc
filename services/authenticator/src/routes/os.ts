import { implement } from '@orpc/server';
import { authenticatorContract } from '@/contracts';

export const os = implement(authenticatorContract);
