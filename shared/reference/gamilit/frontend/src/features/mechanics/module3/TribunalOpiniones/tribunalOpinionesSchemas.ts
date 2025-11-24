import { z } from 'zod';
export const opinionSchema = z.object({
  id: z.string(),
  stance: z.enum(['a_favor', 'en_contra', 'neutral']),
  text: z.string().min(20),
});
