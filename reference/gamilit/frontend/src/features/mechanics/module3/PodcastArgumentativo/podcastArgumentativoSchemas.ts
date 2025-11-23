import { z } from 'zod';
export const recordingSchema = z.object({ duration: z.number().min(30).max(300) });
