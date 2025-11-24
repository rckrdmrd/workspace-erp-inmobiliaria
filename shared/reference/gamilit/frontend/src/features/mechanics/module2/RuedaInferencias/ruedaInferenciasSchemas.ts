import { z } from 'zod';

export const inferenceNodeSchema = z.object({
  id: z.string(),
  text: z.string().min(10),
  evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});
