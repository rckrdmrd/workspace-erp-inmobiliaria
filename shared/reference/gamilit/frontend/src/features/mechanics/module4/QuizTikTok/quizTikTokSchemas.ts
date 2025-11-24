import { z } from 'zod';

export const tikTokQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  backgroundVideo: z.string().optional(),
  backgroundColor: z.string().optional()
});

export const quizTikTokDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
  estimatedTime: z.number(),
  topic: z.string(),
  hints: z.array(z.object({ id: z.string(), text: z.string(), cost: z.number() })),
  questions: z.array(tikTokQuestionSchema)
});
