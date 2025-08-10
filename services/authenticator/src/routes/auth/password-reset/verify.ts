import { os } from '@/routes/os';

export const passwordResetVerifyHandler = os.auth.passwordReset.verify.handler(
  async ({ input }) => {
    await Promise.resolve(); // Simulate async operation, e.g., verifying token
    input;
    return { status: 'success', message: 'Verified' };
  }
);
