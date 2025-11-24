import { analyzeArgument } from '../../shared/aiService';
export const fetchPodcastExercise = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return (await import('./podcastArgumentativoMockData')).podcastExercise;
};
export const analyzeRecording = async (transcription: string) => analyzeArgument(transcription);
