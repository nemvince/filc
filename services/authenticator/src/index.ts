import { RPCHandler } from '@orpc/server/bun-ws';
import { serve } from 'bun';
import { seedPermissions } from '@/utils/permissions';
import { authenticatorRouter } from './routes';

const handler = new RPCHandler(authenticatorRouter);

await seedPermissions();

serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }

    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    message(ws, message) {
      handler.message(ws, message);
    },
    close(ws) {
      handler.close(ws);
    },
  },
});
