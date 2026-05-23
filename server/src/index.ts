import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { shareRoutes } from './routes/share.js';
import { aiRoutes } from './routes/ai.js';
import { queueRoutes } from './routes/queue.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

const app = Fastify({
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
  bodyLimit: 64 * 1024, // 64 KB max payload
});

// CORS is only needed when the frontend is served separately (dev)
if (process.env.NODE_ENV !== 'production') {
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });
}

await app.register(shareRoutes);
await app.register(aiRoutes);
await app.register(queueRoutes);

// In production the server also serves the compiled frontend
if (process.env.SERVE_STATIC === 'true') {
  const staticDir = process.env.STATIC_DIR ?? path.join(__dirname, '../../public');
  await app.register(staticPlugin, { root: staticDir, prefix: '/' });
  // SPA fallback — any unknown route returns index.html
  app.setNotFoundHandler((_, reply) => reply.sendFile('index.html'));
}

await app.listen({ port: PORT, host: HOST });
