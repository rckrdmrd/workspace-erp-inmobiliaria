import { z } from 'zod';

export const newsArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  source: z.string().min(1, 'Source is required'),
  date: z.string(),
  url: z.string().url().optional(),
});

export const claimSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Claim text is required'),
  context: z.string(),
  position: z.object({
    start: z.number(),
    end: z.number(),
  }),
});

export const factCheckResultSchema = z.object({
  claimId: z.string(),
  verdict: z.enum(['true', 'false', 'partially-true', 'unverified', 'misleading']),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    credibilityScore: z.number().min(0).max(100),
    type: z.enum(['academic', 'news', 'government', 'encyclopedia', 'other']),
  })),
  explanation: z.string(),
});

export const verificationSessionSchema = z.object({
  articleId: z.string(),
  claims: z.array(claimSchema),
  results: z.array(factCheckResultSchema),
  startTime: z.date(),
  endTime: z.date().optional(),
  score: z.number().optional(),
});

export type NewsArticleFormData = z.infer<typeof newsArticleSchema>;
export type ClaimFormData = z.infer<typeof claimSchema>;
export type FactCheckResultFormData = z.infer<typeof factCheckResultSchema>;
