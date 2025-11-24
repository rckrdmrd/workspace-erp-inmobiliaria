import { z } from 'zod';

export const wordPositionSchema = z.object({
  word: z.string().min(1),
  startRow: z.number().int().min(0),
  startCol: z.number().int().min(0),
  direction: z.enum(['horizontal', 'vertical', 'diagonal']),
  found: z.boolean()
});

export const sopaLetrasDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number().int().positive(),
  topic: z.string().min(1),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number().int().min(0) })),
  grid: z.array(z.array(z.string())),
  words: z.array(wordPositionSchema),
  rows: z.number().int().positive(),
  cols: z.number().int().positive()
});
