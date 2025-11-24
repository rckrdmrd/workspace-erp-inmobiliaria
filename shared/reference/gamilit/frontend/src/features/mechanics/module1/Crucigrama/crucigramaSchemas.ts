import { z } from 'zod';

export const crucigramaClueSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  direction: z.enum(['horizontal', 'vertical']),
  clue: z.string().min(1),
  answer: z.string().min(1),
  startRow: z.number().int().min(0),
  startCol: z.number().int().min(0)
});

export const crucigramaCellSchema = z.object({
  row: z.number().int().min(0),
  col: z.number().int().min(0),
  letter: z.string().length(1),
  isBlack: z.boolean(),
  number: z.number().int().positive().optional(),
  userInput: z.string().length(1).optional()
});

export const crucigramaDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number().int().positive(),
  topic: z.string().min(1),
  hints: z.array(z.object({
    id: z.string(),
    text: z.string(),
    cost: z.number().int().min(0)
  })),
  grid: z.array(z.array(crucigramaCellSchema)),
  clues: z.array(crucigramaClueSchema),
  rows: z.number().int().positive(),
  cols: z.number().int().positive()
});

export type CrucigramaClueInput = z.infer<typeof crucigramaClueSchema>;
export type CrucigramaCellInput = z.infer<typeof crucigramaCellSchema>;
export type CrucigramaDataInput = z.infer<typeof crucigramaDataSchema>;
