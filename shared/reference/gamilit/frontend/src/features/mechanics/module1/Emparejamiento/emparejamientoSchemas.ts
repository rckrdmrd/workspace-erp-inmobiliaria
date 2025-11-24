import { z } from 'zod';

export const matchingCardSchema = z.object({
  id: z.string(),
  content: z.string(),
  matchId: z.string(),
  type: z.enum(['question', 'answer']),
  isFlipped: z.boolean(),
  isMatched: z.boolean()
});

export const emparejamientoDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number(),
  topic: z.string(),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  cards: z.array(matchingCardSchema)
});
