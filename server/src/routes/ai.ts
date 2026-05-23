import type { FastifyPluginAsync } from 'fastify';
import Anthropic from '@anthropic-ai/sdk';

const WORKS_TYPES = `
around_detour, around_sidetrack, around_contraflow,
through_alternating, through_shuttle, through_pilot,
past_lane_closure, past_contraflow, past_shoulder, past_pavement, past_bridge,
mobile_class1, mobile_class2, mobile_class3,
stli_specialist, stli_gaps, stli_short_term, stli_freq_lane, stli_moving,
stli_shoulder_foot, stli_shoulder_plant, stli_freq_outside
`.trim();

const SYSTEM_PROMPT = `You are an expert Australian traffic management designer with deep knowledge of AGTTM (Australian Guide to Temporary Traffic Management), AS 1742.3, and state-specific standards (WA COP, QGTTM).

Given wizard inputs describing a worksite, respond ONLY with a JSON object — no markdown, no preamble:

{
  "worksType": "<one of the valid worksType values below>",
  "worksCategory": "<static|mobile|stli>",
  "designStepName": "<human-readable name>",
  "agttmRef": "<e.g. AGTTM Part 3, Section 3.4>",
  "confidence": "<high|medium|low>",
  "reasoning": "<2-4 sentences explaining why this step applies>",
  "eligibilityConcerns": ["<concern>"],
  "mandatoryActions": ["<action>"],
  "alternativeWorksType": "<worksType or null>"
}

Valid worksType values: ${WORKS_TYPES}`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export const aiRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: { inputs: unknown } }>('/api/ai/suggest', async (req, reply) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      return reply.status(503).send({ error: 'AI assistant not configured — set ANTHROPIC_API_KEY' });
    }

    const inputs = (req.body as { inputs?: unknown })?.inputs;
    if (!inputs) return reply.status(400).send({ error: 'inputs required' });

    const message = await getClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Suggest the best AGTTM design step for these works inputs:\n\n${JSON.stringify(inputs, null, 2)}`,
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return reply.status(500).send({ error: 'Could not parse AI response' });

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return reply.status(500).send({ error: 'Could not parse AI response' });
    }
  });
};
