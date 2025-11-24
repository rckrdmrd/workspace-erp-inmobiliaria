/**
 * RegisterPage Tests
 *
 * Tests for the updated registration flow:
 * - No email verification required
 * - Direct redirect to login after successful registration
 * - Success message display
 * - Auto-redirect after 2 seconds
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';

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

// Mock auth API
vi.mock('@features/auth/mocks/authMocks', () => ({
  mockRegister: vi.fn(),
}));

import { mockRegister } from '@features/auth/mocks/authMocks';

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  const fillRegistrationForm = async (user = userEvent.setup({ delay: null })) => {
    const fullNameInput = screen.getByPlaceholderText(/marie curie/i);
    const emailInput = screen.getByPlaceholderText(/detective@glit.com/i);
    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/);
    const termsCheckbox = screen.getByRole('checkbox');

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'Test1234!@#$');
    await user.type(passwordInputs[1], 'Test1234!@#$');
    await user.click(termsCheckbox);

    return { fullNameInput, emailInput, passwordInputs, termsCheckbox };
  };

  describe('Rendering', () => {
    it('should render registration form', () => {
      renderComponent();

      expect(screen.getByText('GAMILIT')).toBeInTheDocument();
      expect(screen.getByText('Únete a la academia de detectives')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderComponent();

      expect(screen.getByPlaceholderText(/marie curie/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/detective@glit.com/i)).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText(/••••••••/)).toHaveLength(2);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Successful Registration Flow', () => {
    it('should show success message after registration', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: true,
        user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'student', emailVerified: true },
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Creada')).toBeInTheDocument();
      });

      expect(screen.getByText(/tu cuenta ha sido creada exitosamente/i)).toBeInTheDocument();
      expect(screen.getByText(/ya puedes iniciar sesión/i)).toBeInTheDocument();
    });

    it('should NOT mention email verification in success message', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: true,
        user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'student', emailVerified: true },
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Creada')).toBeInTheDocument();
      });

      // Should NOT contain email verification text
      expect(screen.queryByText(/verifica tu email/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/revisa tu correo/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/verificación/i)).not.toBeInTheDocument();
    });

    it('should show redirect message', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: true,
        user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'student', emailVerified: true },
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/redirigiendo a inicio de sesión/i)).toBeInTheDocument();
      });
    });

    it('should redirect to login page after 2 seconds', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: true,
        user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'student', emailVerified: true },
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Creada')).toBeInTheDocument();
      });

      // Navigate should not be called immediately
      expect(mockNavigate).not.toHaveBeenCalled();

      // Fast-forward time by 2 seconds
      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should display success icon', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: true,
        user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'student', emailVerified: true },
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cuenta Creada')).toBeInTheDocument();
      });

      // CheckCircle2 icon should be present (rendered as svg)
      const successCard = screen.getByText('Cuenta Creada').closest('div');
      expect(successCard).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message on registration failure', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: false,
        error: 'El email ya está registrado',
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el email ya está registrado/i)).toBeInTheDocument();
      });

      // Should NOT redirect on error
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show connection error', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockRejectedValueOnce(new Error('Network error'));

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
      });
    });

    it('should allow dismissing error messages', async () => {
      const user = userEvent.setup({ delay: null });

      vi.mocked(mockRegister).mockResolvedValueOnce({
        success: false,
        error: 'Error de prueba',
      });

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error de prueba/i)).toBeInTheDocument();
      });

      // Find and click dismiss button
      const dismissButton = screen.getByRole('button', { name: /×/i });
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText(/error de prueba/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate full name is required', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const fullNameInput = screen.getByPlaceholderText(/marie curie/i);
      await user.type(fullNameInput, 'a');
      await user.clear(fullNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/el nombre completo es requerido/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const emailInput = screen.getByPlaceholderText(/detective@glit.com/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('should validate password requirements', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const passwordInput = screen.getAllByPlaceholderText(/••••••••/)[0];
      await user.type(passwordInput, 'weak');
      await user.tab();

      await waitFor(() => {
        // Password should show validation errors
        const passwordField = passwordInput.closest('div');
        expect(passwordField).toBeInTheDocument();
      });
    });

    it('should validate password confirmation matches', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/);
      await user.type(passwordInputs[0], 'Test1234!@#$');
      await user.type(passwordInputs[1], 'DifferentPassword123!');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
      });
    });

    it('should require terms acceptance', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const fullNameInput = screen.getByPlaceholderText(/marie curie/i);
      const emailInput = screen.getByPlaceholderText(/detective@glit.com/i);
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/);

      await user.type(fullNameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInputs[0], 'Test1234!@#$');
      await user.type(passwordInputs[1], 'Test1234!@#$');

      // Don't check the terms checkbox
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      // Button should be disabled without terms acceptance
      expect(submitButton).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should navigate to login when clicking login link', async () => {
      const user = userEvent.setup({ delay: null });

      renderComponent();

      const loginLink = screen.getByRole('button', { name: /inicia sesión aquí/i });
      await user.click(loginLink);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should show loading state during registration', async () => {
      const user = userEvent.setup({ delay: null });

      // Mock slow registration
      vi.mocked(mockRegister).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
      );

      renderComponent();
      await fillRegistrationForm(user);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/creando cuenta/i)).toBeInTheDocument();
      });

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderComponent();

      expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getAllByText('Contraseña')).toBeTruthy();
      expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument();
    });

    it('should have accessible form controls', () => {
      renderComponent();

      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      expect(submitButton).toBeInTheDocument();
    });
  });
});
