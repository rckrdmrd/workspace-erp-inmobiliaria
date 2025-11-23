import { generatePerspectives } from '../../shared/aiService';
export const fetchMatrixExercise = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return (await import('./matrizPerspectivasMockData')).matrixExercise;
};
export const getAIPerspectives = async (topic: string, count: number) => generatePerspectives(topic, count);
