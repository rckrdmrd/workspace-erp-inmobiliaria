/**
 * LoginPage Tests
 *
 * Tests for inactive/suspended account handling:
 * - Shows amber alert for inactive accounts (ACCOUNT_INACTIVE)
 * - Shows red alert for suspended accounts (ACCOUNT_SUSPENDED)
 * - Displays suspension end date for temporary suspension
 * - Shows suspension reason if provided
 * - Inactive/suspended errors don't trigger CAPTCHA
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { AccountInactiveError, AccountSuspendedError } from '@services/api/apiErrorHandler';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock auth hook
const mockLogin = vi.fn();
vi.mock('@features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
  }),
}));

// Mock auth store
vi.mock('@features/auth/store/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      user: {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'student',
      },
    }),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  const fillLoginForm = async (user = userEvent.setup()) => {
    const emailInput = screen.getByPlaceholderText(/detective@glit.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Test1234');

    return { emailInput, passwordInput };
  };

  describe('Rendering', () => {
    it('should render login form', () => {
      renderComponent();

      expect(screen.getByText('GLIT Detective Platform')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('should show connection status badge', () => {
      renderComponent();

      expect(screen.getByText(/conectado/i)).toBeInTheDocument();
    });

    it('should display form fields', () => {
      renderComponent();

      expect(screen.getByPlaceholderText(/detective@glit.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument(); // Remember me
    });
  });

  describe('Inactive Account Handling', () => {
    it('should show amber alert for inactive account', async () => {
      const user = userEvent.setup();

      const inactiveError = new AccountInactiveError('Tu cuenta ha sido desactivada');
      mockLogin.mockRejectedValueOnce(inactiveError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Desactivada')).toBeInTheDocument();
      });

      // Check for amber/yellow styling (bg-amber-50, border-amber-400)
      const alertBox = screen.getByText('Cuenta Desactivada').closest('div');
      expect(alertBox).toHaveClass('bg-amber-50', 'border-amber-400');
    });

    it('should display inactive account message', async () => {
      const user = userEvent.setup();

      const inactiveError = new AccountInactiveError(
        'Tu cuenta ha sido desactivada. Por favor, contacta a tu maestro.'
      );
      mockLogin.mockRejectedValueOnce(inactiveError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/contacta a tu maestro/i)).toBeInTheDocument();
      });
    });

    it('should show help text for inactive account', async () => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValueOnce(new AccountInactiveError('Account inactive'));

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/si crees que esto es un error/i)
        ).toBeInTheDocument();
      });
    });

    it('should NOT trigger CAPTCHA on inactive account error', async () => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValueOnce(new AccountInactiveError('Account inactive'));

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Desactivada')).toBeInTheDocument();
      });

      // CAPTCHA should NOT be shown
      expect(screen.queryByText(/captcha/i)).not.toBeInTheDocument();
    });
  });

  describe('Suspended Account Handling', () => {
    it('should show red alert for suspended account', async () => {
      const user = userEvent.setup();

      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: false,
        suspendedUntil: '2024-12-31T23:59:59Z',
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Cuenta Suspendida Temporalmente/i)).toBeInTheDocument();
      });

      // Check for red styling (bg-red-50, border-red-400)
      const alertBox = screen.getByText(/Cuenta Suspendida/i).closest('div');
      expect(alertBox).toHaveClass('bg-red-50', 'border-red-400');
    });

    it('should display permanent suspension message', async () => {
      const user = userEvent.setup();

      const suspendedError = new AccountSuspendedError('Account permanently suspended', {
        isPermanent: true,
        reason: 'Violation of terms of service',
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Suspendida Permanentemente')).toBeInTheDocument();
      });
    });

    it('should display suspension end date for temporary suspension', async () => {
      const user = userEvent.setup();

      const suspensionEndDate = '2024-12-31T23:59:59Z';
      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: false,
        suspendedUntil: suspensionEndDate,
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/suspendida hasta/i)).toBeInTheDocument();
      });

      // Should show formatted date
      const formattedDate = new Date(suspensionEndDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it('should display suspension reason if provided', async () => {
      const user = userEvent.setup();

      const reason = 'Múltiples violaciones de las reglas de conducta';
      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: false,
        suspendedUntil: '2024-12-31T23:59:59Z',
        reason,
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/razón/i)).toBeInTheDocument();
        expect(screen.getByText(reason)).toBeInTheDocument();
      });
    });

    it('should show appropriate help text for temporary suspension', async () => {
      const user = userEvent.setup();

      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: false,
        suspendedUntil: '2024-12-31T23:59:59Z',
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/podrás acceder a tu cuenta una vez que finalice/i)
        ).toBeInTheDocument();
      });
    });

    it('should show appropriate help text for permanent suspension', async () => {
      const user = userEvent.setup();

      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: true,
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/contacta al soporte técnico/i)).toBeInTheDocument();
      });
    });

    it('should NOT trigger CAPTCHA on suspended account error', async () => {
      const user = userEvent.setup();

      const suspendedError = new AccountSuspendedError('Account suspended', {
        isPermanent: false,
        suspendedUntil: '2024-12-31T23:59:59Z',
      });
      mockLogin.mockRejectedValueOnce(suspendedError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Cuenta Suspendida/i)).toBeInTheDocument();
      });

      // CAPTCHA should NOT be shown
      expect(screen.queryByText(/captcha/i)).not.toBeInTheDocument();
    });
  });

  describe('Regular Login Errors', () => {
    it('should show regular error messages for invalid credentials', async () => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'));

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
      });
    });

    it('should trigger CAPTCHA after 3 failed login attempts', async () => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      renderComponent();

      // Attempt 1
      await fillLoginForm(user);
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());

      // Attempt 2
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => expect(screen.getByText(/1 intento restante/i)).toBeInTheDocument());

      // Attempt 3
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(screen.getByText(/captcha/i)).toBeInTheDocument();
      });
    });

    it('should show rate limiting warning', async () => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/3 intentos restantes/i)).toBeInTheDocument();
      });
    });
  });

  describe('Successful Login', () => {
    it('should redirect student to dashboard', async () => {
      const user = userEvent.setup();

      mockLogin.mockResolvedValueOnce(undefined);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('User Interactions', () => {
    it('should navigate to register page', async () => {
      const user = userEvent.setup();

      renderComponent();

      const registerLink = screen.getByRole('button', { name: /únete al equipo/i });
      await user.click(registerLink);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('should navigate to password recovery', async () => {
      const user = userEvent.setup();

      renderComponent();

      const forgotPasswordLink = screen.getByRole('button', { name: /olvidaste tu contraseña/i });
      await user.click(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('/password-recovery');
    });

    it('should toggle remember me checkbox', async () => {
      const user = userEvent.setup();

      renderComponent();

      const rememberMeCheckbox = screen.getByRole('checkbox');
      expect(rememberMeCheckbox).not.toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderComponent();

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Contraseña')).toBeInTheDocument();
      expect(screen.getByText('Recordarme')).toBeInTheDocument();
    });

    it('should have accessible error alerts', async () => {
      const user = userEvent.setup();

      const inactiveError = new AccountInactiveError('Account inactive');
      mockLogin.mockRejectedValueOnce(inactiveError);

      renderComponent();
      await fillLoginForm(user);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByText('Cuenta Desactivada').closest('div');
        expect(alert).toBeInTheDocument();
      });
    });
  });
});
