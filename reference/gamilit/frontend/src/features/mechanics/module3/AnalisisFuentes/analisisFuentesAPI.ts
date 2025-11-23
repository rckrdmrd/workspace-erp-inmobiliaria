import { analyzeSourceCredibility, checkFactAccuracy } from '../../shared/aiService';
export const fetchSources = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return (await import('./analisisFuentesMockData')).mockSources;
};
export const analyzeSource = async (url: string) => analyzeSourceCredibility(url);
export const checkClaim = async (claim: string) => checkFactAccuracy(claim);
