import { generateInferenceSuggestions } from '../../shared/aiService';

export const fetchInferenceWheel = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return (await import('./ruedaInferenciasMockData')).mockInferenceWheel;
};

export const getAISuggestions = async (evidence: string[]) => {
  return generateInferenceSuggestions(evidence);
};
