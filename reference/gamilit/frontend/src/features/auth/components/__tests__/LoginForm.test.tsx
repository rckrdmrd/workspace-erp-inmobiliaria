/**
 * LoginForm Component Tests
 * Comprehensive test suite for the login form component
 *
 * Coverage:
 * - Form rendering and accessibility
 * - Form validation (email, password)
 * - Password visibility toggle
 * - Remember me functionality
 * - Form submission (success/error)
 * - Loading states
 * - Error display
 * - Navigation after auth
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '@/app/providers/AuthContext';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock('@/app/providers/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    login: mockLogin,
    clearError: mockClearError,
    error: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginForm', () => {
  // Helper function to render LoginForm
  const renderLoginForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <LoginForm {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all fields', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('should render email input with correct attributes', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'tu@correo.com');
    });

    it('should render password input with correct attributes', () => {
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });

    it('should render "Remember Me" checkbox by default', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/recordarme/i)).toBeInTheDocument();
    });

    it('should hide "Remember Me" checkbox when showRememberMe is false', () => {
      renderLoginForm({ showRememberMe: false });

      expect(screen.queryByLabelText(/recordarme/i)).not.toBeInTheDocument();
    });

    it('should render "Forgot Password" link by default', () => {
      renderLoginForm();

      const forgotLink = screen.getByText(/¿olvidaste tu contraseña?/i);
      expect(forgotLink).toBeInTheDocument();
      expect(forgotLink).toHaveAttribute('href', '/forgot-password');
    });

    it('should hide "Forgot Password" link when showForgotPassword is false', () => {
      renderLoginForm({ showForgotPassword: false });

      expect(screen.queryByText(/¿olvidaste tu contraseña?/i)).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/contraseña/i);
      const toggleButton = screen.getByLabelText(/mostrar contraseña/i);

      // Initially password type
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide
      await user.click(screen.getByLabelText(/ocultar contraseña/i));
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have correct aria-label for toggle button', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      expect(screen.getByLabelText(/mostrar contraseña/i)).toBeInTheDocument();

      await user.click(screen.getByLabelText(/mostrar contraseña/i));
      expect(screen.getByLabelText(/ocultar contraseña/i)).toBeInTheDocument();
    });
  });

  describe('Remember Me Functionality', () => {
    it('should toggle remember me checkbox', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const checkbox = screen.getByLabelText(/recordarme/i) as HTMLInputElement;

      // Initially unchecked
      expect(checkbox.checked).toBe(false);

      // Click to check
      await user.click(checkbox);
      expect(checkbox.checked).toBe(true);

      // Click to uncheck
      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/correo electrónico.*requerido/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty password', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await user.type(emailInput, 'test@test.com');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/contraseña.*requerida/i)).toBeInTheDocument();
      });
    });

    it('should show error for password shorter than 8 characters', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'short');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/contraseña.*al menos 8 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should not submit with validation errors', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission - Success', () => {
    it('should submit form with valid credentials', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({});
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@test.com',
          password: 'password123',
        });
      });
    });

    it('should call onSuccess callback after successful login', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      mockLogin.mockResolvedValue({});
      renderLoginForm({ onSuccess });

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should navigate to dashboard after successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({});
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should navigate to custom redirect path if provided', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({});
      renderLoginForm({ redirectTo: '/custom-path' });

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
      });
    });

    it('should save rememberMe preference to localStorage', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({});
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const rememberCheckbox = screen.getByLabelText(/recordarme/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(rememberCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('rememberMe')).toBe('true');
      });
    });

    it('should remove rememberMe from localStorage when unchecked', async () => {
      const user = userEvent.setup();
      localStorage.setItem('rememberMe', 'true');
      mockLogin.mockResolvedValue({});
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('rememberMe')).toBeNull();
      });
    });
  });

  describe('Form Submission - Error', () => {
    it('should display error message on login failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Credenciales inválidas';
      mockLogin.mockRejectedValue(new Error(errorMessage));

      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'wrong@test.com');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });

    it('should call clearError before submitting', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({});
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
      });
    });

    it('should set default error message if error has no message', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({});

      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Check for loading text
      expect(await screen.findByText(/iniciando sesión/i)).toBeInTheDocument();

      // Button should be disabled
      expect(submitButton).toBeDisabled();
    });

    it('should disable inputs during submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
      });
    });

    it('should disable password toggle during submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      const toggleButton = screen.getByLabelText(/mostrar contraseña/i);
      await waitFor(() => {
        expect(toggleButton).toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
    });

    it('should mark invalid fields with aria-invalid', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should associate error messages with inputs using aria-describedby', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.click(submitButton);

      await waitFor(() => {
        const errorId = emailInput.getAttribute('aria-describedby');
        expect(errorId).toBeTruthy();
        expect(document.getElementById(errorId!)).toBeInTheDocument();
      });
    });

    it('should have role="alert" for error messages', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Lifecycle', () => {
    it('should clear errors on unmount', () => {
      const { unmount } = renderLoginForm();

      unmount();

      expect(mockClearError).toHaveBeenCalled();
    });
  });
});
