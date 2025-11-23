import { z } from 'zod';

export const hypertextNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  links: z.array(z.object({ targetId: z.string(), label: z.string() }))
});

export const navegacionHipertextualDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number(),
  topic: z.string(),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  nodes: z.array(hypertextNodeSchema),
  startNodeId: z.string(),
  targetNodeId: z.string()
});
