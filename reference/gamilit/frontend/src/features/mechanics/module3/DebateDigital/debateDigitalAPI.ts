import { generateAIDebateResponse } from '../../shared/aiService';
export const sendDebateMessage = async (message: string, topic: string) => {
  return generateAIDebateResponse(message, topic);
};
