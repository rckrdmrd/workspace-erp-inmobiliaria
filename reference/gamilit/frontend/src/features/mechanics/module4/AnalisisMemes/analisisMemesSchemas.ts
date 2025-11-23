import { z } from 'zod';

export const memeAnnotationSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  text: z.string(),
  category: z.enum(['texto', 'contexto', 'humor', 'critica'])
});

export const analisisMemesDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number(),
  topic: z.string(),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  memeUrl: z.string(),
  memeTitle: z.string(),
  expectedAnnotations: z.array(memeAnnotationSchema)
});
