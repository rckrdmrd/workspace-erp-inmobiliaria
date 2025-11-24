import type { TribunalOpinionesData } from './tribunalOpinionesTypes';
import { mockTribunalData } from './tribunalOpinionesMockData';

/**
 * Fetch Tribunal de Opiniones exercise data
 * Currently returns mock data, will be replaced with actual API call
 */
export const fetchTribunal = async (exerciseId: string): Promise<TribunalOpinionesData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In production, this would be:
  // const response = await apiClient.get(`/exercises/${exerciseId}`);
  // return response.data;

  console.log('[TribunalOpinionesAPI] Fetching exercise:', exerciseId);
  return mockTribunalData;
};

/**
 * Submit tribunal evaluations
 * @deprecated Use submitExercise from progressAPI instead
 */
export const submitTribunalAnswers = async (
  exerciseId: string,
  userId: string,
  answers: unknown
): Promise<{ success: boolean; score: number }> => {
  console.log('[TribunalOpinionesAPI] Submitting answers:', { exerciseId, userId, answers });

  // This is deprecated - use submitExercise from progressAPI
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    score: 80
  };
};
