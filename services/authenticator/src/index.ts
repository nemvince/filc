import { RPCHandler } from '@orpc/server/bun-ws';
import { serve } from 'bun';
import { authenticatorRouter } from './routes';

const handler = new RPCHandler(authenticatorRouter);

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
