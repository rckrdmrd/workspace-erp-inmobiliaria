import { z } from 'zod';

export const timelineEventSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  category: z.string().min(1)
});

export const timelineDataSchema = z.object({
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
  events: z.array(timelineEventSchema),
  // FE-059: correctOrder is sanitized by backend - never present
  correctOrder: z.array(z.string()).optional()
});

export type TimelineEventInput = z.infer<typeof timelineEventSchema>;
export type TimelineDataInput = z.infer<typeof timelineDataSchema>;
