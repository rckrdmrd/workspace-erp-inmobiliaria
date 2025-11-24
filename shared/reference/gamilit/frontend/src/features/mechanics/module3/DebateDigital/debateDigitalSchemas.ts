import { z } from 'zod';
export const messageSchema = z.object({
  text: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});
