import { z } from 'zod';
export const sourceSchema = z.object({ url: z.string().url() });
