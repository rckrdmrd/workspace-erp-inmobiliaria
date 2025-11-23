/**
 * Auth Store Tests
 * Comprehensive test suite for authentication store
 *
 * Coverage:
 * - Login/Register/Logout flows
 * - Session management and refresh
 * - Password recovery
 * - Error handling
 * - Loading states
 * - localStorage integration
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore } from '../store/authStore';
import * as authAPI from '../api/authAPI';

// Mock authAPI module
vi.mock('../api/authAPI', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

describe('Auth Store', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    // Replace global localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();

    // Clear all mocks
    vi.clearAllMocks();

    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionExpiresAt: null
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('Login', () => {
    const mockLoginResponse = {
      user: {
        id: '1',
        email: 'admin@gamilit.com',
        fullName: 'Admin User',
        role: 'admin',
        emailVerified: true
      },
      token: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: '3600'
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      // Act
      const { login } = useAuthStore.getState();
      await login('admin@gamilit.com', 'password123');

      // Assert
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeTruthy();
      expect(state.user?.email).toBe('admin@gamilit.com');
      expect(state.token).toBe('mock-access-token');
      expect(state.refreshToken).toBe('mock-refresh-token');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should store tokens in localStorage on successful login', async () => {
      // Arrange
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      // Act
      const { login } = useAuthStore.getState();
      await login('admin@gamilit.com', 'password123');

      // Assert
      expect(localStorage.getItem('auth-token')).toBe('mock-access-token');
      expect(localStorage.getItem('refresh-token')).toBe('mock-refresh-token');
    });

    it('should set sessionExpiresAt on successful login', async () => {
      // Arrange
      const beforeLogin = Date.now();
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      // Act
      const { login } = useAuthStore.getState();
      await login('admin@gamilit.com', 'password123');

      // Assert
      const state = useAuthStore.getState();
      expect(state.sessionExpiresAt).toBeGreaterThan(beforeLogin);
      expect(state.sessionExpiresAt).toBeLessThanOrEqual(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
    });

    it('should set isLoading to true during login', async () => {
      // Arrange
      let loadingDuringCall = false;
      vi.mocked(authAPI.login).mockImplementation(async () => {
        loadingDuringCall = useAuthStore.getState().isLoading;
        return mockLoginResponse;
      });

      // Act
      const { login } = useAuthStore.getState();
      await login('admin@gamilit.com', 'password123');

      // Assert
      expect(loadingDuringCall).toBe(true);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('should clear error before login attempt', async () => {
      // Arrange
      useAuthStore.setState({ error: 'Previous error' });
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);

      // Act
      const { login } = useAuthStore.getState();
      await login('admin@gamilit.com', 'password123');

      // Assert
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('Login Failures', () => {
    it('should fail login with invalid credentials', async () => {
      // Arrange
      const error = new Error('Credenciales inválidas');
      vi.mocked(authAPI.login).mockRejectedValue(error);

      // Act & Assert
      const { login } = useAuthStore.getState();
      await expect(login('wrong@email.com', 'wrongpass')).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBeTruthy();
      expect(state.isLoading).toBe(false);
    });

    it('should set error message on login failure', async () => {
      // Arrange
      vi.mocked(authAPI.login).mockRejectedValue(
        new Error('Usuario no encontrado')
      );

      // Act
      const { login } = useAuthStore.getState();
      try {
        await login('nonexistent@email.com', 'password');
      } catch {}

      // Assert
      expect(useAuthStore.getState().error).toBe('Usuario no encontrado');
    });

    it('should set default error message if error has no message', async () => {
      // Arrange
      vi.mocked(authAPI.login).mockRejectedValue({});

      // Act
      const { login } = useAuthStore.getState();
      try {
        await login('test@test.com', 'password');
      } catch {}

      // Assert
      expect(useAuthStore.getState().error).toBe('Error al iniciar sesión');
    });
  });

  describe('Register', () => {
    const mockRegisterData = {
      fullName: 'New User',
      email: 'newuser@gamilit.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      acceptTerms: true
    };

    const mockRegisterResponse = {
      user: {
        id: '2',
        email: 'newuser@gamilit.com',
        fullName: 'New User',
        role: 'student',
        emailVerified: false
      },
      token: 'mock-register-token',
      refreshToken: 'mock-register-refresh-token',
      expiresIn: '3600'
    };

    it('should register user successfully', async () => {
      // Arrange
      vi.mocked(authAPI.register).mockResolvedValue(mockRegisterResponse);

      // Act
      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      // Assert
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('newuser@gamilit.com');
      expect(state.token).toBe('mock-register-token');
      expect(state.refreshToken).toBe('mock-register-refresh-token');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should store tokens in localStorage on successful registration', async () => {
      // Arrange
      vi.mocked(authAPI.register).mockResolvedValue(mockRegisterResponse);

      // Act
      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      // Assert
      expect(localStorage.getItem('auth-token')).toBe('mock-register-token');
      expect(localStorage.getItem('refresh-token')).toBe('mock-register-refresh-token');
    });

    it('should set sessionExpiresAt on successful registration', async () => {
      // Arrange
      const beforeRegister = Date.now();
      vi.mocked(authAPI.register).mockResolvedValue(mockRegisterResponse);

      // Act
      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      // Assert
      const state = useAuthStore.getState();
      expect(state.sessionExpiresAt).toBeGreaterThan(beforeRegister);
    });

    it('should fail registration with error', async () => {
      // Arrange
      vi.mocked(authAPI.register).mockRejectedValue(
        new Error('Email ya registrado')
      );

      // Act & Assert
      const { register } = useAuthStore.getState();
      await expect(register(mockRegisterData)).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Email ya registrado');
      expect(state.isLoading).toBe(false);
    });

    it('should set default error message on registration failure', async () => {
      // Arrange
      vi.mocked(authAPI.register).mockRejectedValue({});

      // Act
      const { register } = useAuthStore.getState();
      try {
        await register(mockRegisterData);
      } catch {}

      // Assert
      expect(useAuthStore.getState().error).toBe('Error al registrar usuario');
    });
  });

  describe('Logout', () => {
    const mockLoginResponse = {
      user: {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        role: 'student',
        emailVerified: true
      },
      token: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresIn: '3600'
    };

    it('should logout correctly and clear state', async () => {
      // Arrange
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse);
      vi.mocked(authAPI.logout).mockResolvedValue();

      // Act - First login
      const { login, logout } = useAuthStore.getState();
      await login('test@test.com', 'password123');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Act - Then logout
      await logout();

      // Assert
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.sessionExpiresAt).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should remove tokens from localStorage on logout', async () => {
      // Arrange
      localStorage.setItem('auth-token', 'test-token');
      localStorage.setItem('refresh-token', 'test-refresh');
      vi.mocked(authAPI.logout).mockResolvedValue();

      // Act
      const { logout } = useAuthStore.getState();
      await logout();

      // Assert
      expect(localStorage.getItem('auth-token')).toBeNull();
      expect(localStorage.getItem('refresh-token')).toBeNull();
    });

    it('should call logout API', async () => {
      // Arrange
      vi.mocked(authAPI.logout).mockResolvedValue();

      // Act
      const { logout } = useAuthStore.getState();
      await logout();

      // Assert
      expect(authAPI.logout).toHaveBeenCalled();
    });

    it('should logout locally even if API call fails', async () => {
      // Arrange
      localStorage.setItem('auth-token', 'test-token');
      vi.mocked(authAPI.logout).mockRejectedValue(new Error('API error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      const { logout } = useAuthStore.getState();
      await logout();

      // Assert
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(localStorage.getItem('auth-token')).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('RefreshSession', () => {
    const mockRefreshResponse = {
      token: 'new-access-token',
      refreshToken: 'new-refresh-token'
    };

    it('should refresh session successfully', async () => {
      // Arrange
      useAuthStore.setState({ refreshToken: 'old-refresh-token' });
      vi.mocked(authAPI.refreshToken).mockResolvedValue(mockRefreshResponse);

      // Act
      const { refreshSession } = useAuthStore.getState();
      await refreshSession();

      // Assert
      const state = useAuthStore.getState();
      expect(state.token).toBe('new-access-token');
      expect(state.sessionExpiresAt).toBeGreaterThan(Date.now());
    });

    it('should update token in localStorage on refresh', async () => {
      // Arrange
      useAuthStore.setState({ refreshToken: 'old-refresh-token' });
      vi.mocked(authAPI.refreshToken).mockResolvedValue(mockRefreshResponse);

      // Act
      const { refreshSession } = useAuthStore.getState();
      await refreshSession();

      // Assert
      expect(localStorage.getItem('auth-token')).toBe('new-access-token');
    });

    it('should throw error if no refresh token available', async () => {
      // Arrange
      useAuthStore.setState({ refreshToken: null });

      // Act & Assert
      const { refreshSession } = useAuthStore.getState();
      await expect(refreshSession()).rejects.toThrow(
        'No hay token de refresco disponible'
      );
    });

    it('should logout user if refresh fails', async () => {
      // Arrange
      useAuthStore.setState({
        refreshToken: 'old-refresh-token',
        isAuthenticated: true,
        user: { id: '1', email: 'test@test.com' } as any
      });
      vi.mocked(authAPI.refreshToken).mockRejectedValue(
        new Error('Refresh token expirado')
      );
      vi.mocked(authAPI.logout).mockResolvedValue();

      // Act & Assert
      const { refreshSession } = useAuthStore.getState();
      await expect(refreshSession()).rejects.toThrow();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('Password Recovery', () => {
    describe('requestPasswordReset', () => {
      it('should request password reset successfully', async () => {
        // Arrange
        vi.mocked(authAPI.requestPasswordReset).mockResolvedValue();

        // Act
        const { requestPasswordReset } = useAuthStore.getState();
        await requestPasswordReset('user@test.com');

        // Assert
        const state = useAuthStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(authAPI.requestPasswordReset).toHaveBeenCalledWith({
          email: 'user@test.com'
        });
      });

      it('should set isLoading to true during request', async () => {
        // Arrange
        let loadingDuringCall = false;
        vi.mocked(authAPI.requestPasswordReset).mockImplementation(async () => {
          loadingDuringCall = useAuthStore.getState().isLoading;
        });

        // Act
        const { requestPasswordReset } = useAuthStore.getState();
        await requestPasswordReset('user@test.com');

        // Assert
        expect(loadingDuringCall).toBe(true);
        expect(useAuthStore.getState().isLoading).toBe(false);
      });

      it('should handle request password reset failure', async () => {
        // Arrange
        vi.mocked(authAPI.requestPasswordReset).mockRejectedValue(
          new Error('Email no encontrado')
        );

        // Act & Assert
        const { requestPasswordReset } = useAuthStore.getState();
        await expect(
          requestPasswordReset('nonexistent@test.com')
        ).rejects.toThrow();

        const state = useAuthStore.getState();
        expect(state.error).toBe('Email no encontrado');
        expect(state.isLoading).toBe(false);
      });

      it('should set default error message on failure', async () => {
        // Arrange
        vi.mocked(authAPI.requestPasswordReset).mockRejectedValue({});

        // Act
        const { requestPasswordReset } = useAuthStore.getState();
        try {
          await requestPasswordReset('user@test.com');
        } catch {}

        // Assert
        expect(useAuthStore.getState().error).toBe('Error al solicitar recuperación');
      });
    });

    describe('resetPassword', () => {
      it('should reset password successfully', async () => {
        // Arrange
        vi.mocked(authAPI.resetPassword).mockResolvedValue();

        // Act
        const { resetPassword } = useAuthStore.getState();
        await resetPassword('reset-token-123', 'NewPassword123!');

        // Assert
        const state = useAuthStore.getState();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(authAPI.resetPassword).toHaveBeenCalledWith({
          token: 'reset-token-123',
          newPassword: 'NewPassword123!'
        });
      });

      it('should set isLoading to true during password reset', async () => {
        // Arrange
        let loadingDuringCall = false;
        vi.mocked(authAPI.resetPassword).mockImplementation(async () => {
          loadingDuringCall = useAuthStore.getState().isLoading;
        });

        // Act
        const { resetPassword } = useAuthStore.getState();
        await resetPassword('token', 'newpass');

        // Assert
        expect(loadingDuringCall).toBe(true);
        expect(useAuthStore.getState().isLoading).toBe(false);
      });

      it('should handle reset password failure', async () => {
        // Arrange
        vi.mocked(authAPI.resetPassword).mockRejectedValue(
          new Error('Token inválido o expirado')
        );

        // Act & Assert
        const { resetPassword } = useAuthStore.getState();
        await expect(
          resetPassword('invalid-token', 'NewPass123!')
        ).rejects.toThrow();

        const state = useAuthStore.getState();
        expect(state.error).toBe('Token inválido o expirado');
        expect(state.isLoading).toBe(false);
      });

      it('should set default error message on failure', async () => {
        // Arrange
        vi.mocked(authAPI.resetPassword).mockRejectedValue({});

        // Act
        const { resetPassword } = useAuthStore.getState();
        try {
          await resetPassword('token', 'newpass');
        } catch {}

        // Assert
        expect(useAuthStore.getState().error).toBe('Error al restablecer contraseña');
      });
    });
  });

  it('should update user data', () => {
    const { updateUser } = useAuthStore.getState();

    // Set initial user
    useAuthStore.setState({
      user: {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        role: 'student',
        emailVerified: false
      }
    });

    // Update user
    updateUser({ fullName: 'Updated Name' });

    const state = useAuthStore.getState();
    expect(state.user?.fullName).toBe('Updated Name');
  });

  it('should check session validity', () => {
    const { checkSession } = useAuthStore.getState();

    // Set valid session
    useAuthStore.setState({
      isAuthenticated: true,
      sessionExpiresAt: Date.now() + 10000 // 10 seconds from now
    });

    expect(checkSession()).toBe(true);
  });

  it('should invalidate expired session', () => {
    const { checkSession } = useAuthStore.getState();

    // Set expired session
    useAuthStore.setState({
      isAuthenticated: true,
      sessionExpiresAt: Date.now() - 10000 // 10 seconds ago
    });

    expect(checkSession()).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should clear error', () => {
    const { clearError } = useAuthStore.getState();

    useAuthStore.setState({ error: 'Some error' });
    expect(useAuthStore.getState().error).toBeTruthy();

    clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
