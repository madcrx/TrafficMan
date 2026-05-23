import type { FastifyPluginAsync } from 'fastify';
import { randomBytes } from 'crypto';
import db from '../db.js';

const TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

export const shareRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: { inputs: unknown } }>('/api/share', async (req, reply) => {
    const body = req.body as { inputs?: unknown };
    if (!body?.inputs || typeof body.inputs !== 'object') {
      return reply.status(400).send({ error: 'inputs required' });
    }
    const token = randomBytes(8).toString('base64url');
    const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
    db.prepare('INSERT INTO shares (token, payload, expires_at) VALUES (?, ?, ?)')
      .run(token, JSON.stringify(body.inputs), expiresAt);
    return { token };
  });

  app.get<{ Params: { token: string } }>('/api/share/:token', async (req, reply) => {
    const { token } = req.params;
    const row = db.prepare(
      'SELECT payload FROM shares WHERE token = ? AND expires_at > unixepoch()'
    ).get(token) as { payload: string } | undefined;
    if (!row) return reply.status(404).send({ error: 'Share not found or expired' });
    return { inputs: JSON.parse(row.payload) };
  });
};
