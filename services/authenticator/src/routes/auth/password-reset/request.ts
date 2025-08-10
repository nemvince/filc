import { os } from '@/routes/os';

export const passwordResetRequestHandler =
  os.auth.passwordReset.request.handler(async ({ input }) => {
    await Promise.resolve(); // Simulate async operation, e.g., sending email
    input; // This would typically contain the user's email or username
    return { status: 'success', message: 'Requested' };
  });
