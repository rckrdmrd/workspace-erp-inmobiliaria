import { z } from 'zod';
export const perspectiveSchema = z.object({ viewpoint: z.string().min(10) });
