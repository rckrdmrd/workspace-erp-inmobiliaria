import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for user management
 * Provides access to user data and update functionality
 */
export const useUser = () => {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  return {
    user,
    updateUser
  };
};
