import type { FastifyPluginAsync } from 'fastify';

const QUEUE_ENGINE_URL = process.env.QUEUE_ENGINE_URL ?? 'http://localhost:8000';

export const queueRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/queue/analyse', async (req, reply) => {
    try {
      const res = await fetch(`${QUEUE_ENGINE_URL}/analyse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      reply.status(res.status);
      return res.json();
    } catch {
      return reply.status(503).send({ error: 'Queue engine unavailable' });
    }
  });

  app.get('/api/queue/health', async (_req, reply) => {
    try {
      const res = await fetch(`${QUEUE_ENGINE_URL}/health`);
      reply.status(res.status);
      return res.json();
    } catch {
      return reply.status(503).send({ status: 'unavailable' });
    }
  });
};
