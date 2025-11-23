import { z } from 'zod';

export const conceptNodeSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  x: z.number(),
  y: z.number(),
  category: z.string()
});

export const connectionSchema = z.object({
  id: z.string(),
  fromId: z.string(),
  toId: z.string(),
  label: z.string()
});

export const mapaConceptualDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number().int().positive(),
  topic: z.string().min(1),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  nodes: z.array(conceptNodeSchema),
  connections: z.array(connectionSchema),
  correctConnections: z.array(z.string())
});
