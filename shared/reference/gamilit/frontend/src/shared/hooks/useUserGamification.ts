import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';
import type { UserGamificationData } from '@shared/types';

/**
 * useUserGamification Hook
 *
 * Fetches real-time gamification data for a user from the backend.
 *
 * TODO (Backend): Implement endpoint GET /api/users/:userId/gamification
 * Response should match UserGamificationData interface:
 * {
 *   userId: string;
 *   level: number;
 *   totalXP: number;
 *   mlCoins: number;
 *   rank: string;
 *   achievements: string[];
 * }
 *
 * @param userId - The ID of the user to fetch gamification data for
 * @returns {object} Gamification data, loading state, and error state
 *
 * @example
 * ```tsx
 * const { gamificationData, loading, error } = useUserGamification(user?.id);
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return <GamifiedHeader gamificationData={gamificationData} />;
 * ```
 */
export function useUserGamification(userId?: string) {
  const [gamificationData, setGamificationData] = useState<UserGamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no userId, set null and stop loading
    if (!userId) {
      setGamificationData(null);
      setLoading(false);
      return;
    }

    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with real API call when backend endpoint is ready
        // const response = await apiClient.get(`/api/users/${userId}/gamification`);
        // setGamificationData(response.data.data);

        // TEMPORARY: Mock data for development
        // This simulates the API response structure
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        const mockData: UserGamificationData = {
          userId,
          level: 15,
          totalXP: 3250,
          mlCoins: 1875,
          rank: 'Investigador Experto',
          achievements: ['first_case', 'streak_7', 'helper', 'speed_demon'],
        };

        setGamificationData(mockData);
      } catch (err: any) {
        console.error('Failed to fetch gamification data:', err);
        setError(err?.message || 'Failed to load gamification data');

        // Fallback to basic data if API fails
        setGamificationData({
          userId,
          level: 1,
          totalXP: 0,
          mlCoins: 0,
          rank: 'Novato',
          achievements: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, [userId]);

  return {
    gamificationData,
    loading,
    error,
  };
}
