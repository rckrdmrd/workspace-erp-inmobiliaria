import { z } from 'zod';

export const infoCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  icon: z.string(),
  revealed: z.boolean()
});

export const infografiaInteractivaDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number(),
  topic: z.string(),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  cards: z.array(infoCardSchema),
  backgroundImage: z.string().optional()
});
