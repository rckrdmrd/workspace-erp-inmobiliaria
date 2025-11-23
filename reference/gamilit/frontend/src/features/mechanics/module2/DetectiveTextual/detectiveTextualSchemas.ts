/**
 * Detective Textual Zod Schemas
 */

import { z } from 'zod';

export const evidenceSchema = z.object({
  id: z.string(),
  type: z.enum(['document', 'letter', 'photo', 'note', 'artifact']),
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().optional(),
  imageUrl: z.string().url().optional(),
  discovered: z.boolean(),
  relevance: z.number().min(0).max(1),
});

export const evidenceConnectionSchema = z.object({
  id: z.string(),
  fromEvidenceId: z.string(),
  toEvidenceId: z.string(),
  relationship: z.string().min(1),
  userCreated: z.boolean(),
  isCorrect: z.boolean().optional(),
});

export const investigationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  mystery: z.string().min(1),
  availableEvidence: z.array(evidenceSchema),
  correctConnections: z.array(evidenceConnectionSchema),
  difficulty: z.enum(['facil', 'medio', 'dificil', 'experto']),
});

export const detectiveProgressSchema = z.object({
  investigationId: z.string(),
  discoveredEvidence: z.array(z.string()),
  connections: z.array(evidenceConnectionSchema),
  hypotheses: z.array(z.string()),
  hintsUsed: z.number().min(0),
  timeSpent: z.number().min(0),
  score: z.number().min(0).max(100),
});
