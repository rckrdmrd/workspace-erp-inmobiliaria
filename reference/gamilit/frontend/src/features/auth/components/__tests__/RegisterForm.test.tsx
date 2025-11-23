/**
 * RegisterForm Component Tests
 *
 * Test Coverage:
 * - Rendering (11 tests): Form fields, conditional role selection, buttons
 * - Password Strength Indicator (4 tests): Display, colors, updates
 * - Password Visibility Toggles (4 tests): Both password and confirm password
 * - Form Validation (8 tests): Email, password, confirm password, terms
 * - Form Submission - Success (6 tests): Registration flow, navigation, callback
 * - Form Submission - Error (3 tests): Error display and handling
 * - Loading States (4 tests): Disable inputs, buttons during submission
 * - Accessibility (5 tests): ARIA labels, invalid states, error associations
 * - Lifecycle (2 tests): Clear errors on unmount, redirect if authenticated
 * - Role Selection (2 tests): Show/hide based on prop
 *
 * Total: 49 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from '../RegisterForm';

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
const mockRegister = vi.fn();
const mockClearError = vi.fn();
let mockAuthContextValue = {
  register: mockRegister,
  clearError: mockClearError,
  error: null as string | null,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('@/app/providers/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => mockAuthContextValue,
}));

// Mock password strength calculation
vi.mock('@/shared/schemas/auth.schemas', async () => {
  const actual = await vi.importActual('@/shared/schemas/auth.schemas');
  return {
    ...actual,
    calculatePasswordStrength: vi.fn((password: string) => {
      if (password.length < 8) return { strength: 'weak', score: 1 };
      if (password.length < 12) return { strength: 'medium', score: 3 };
      return { strength: 'strong', score: 6 };
    }),
  };
});

describe('RegisterForm', () => {
  // Helper function to render RegisterForm
  const renderRegisterForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <RegisterForm {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockRegister.mockClear();
    mockClearError.mockClear();

    // Reset mock context value
    mockAuthContextValue = {
      register: mockRegister,
      clearError: mockClearError,
      error: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering Tests
  // ============================================================

  describe('Rendering', () => {
    it('should render complete registration form', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/i agree to the/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create account/i })
      ).toBeInTheDocument();
    });

    it('should render email input with correct attributes', () => {
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
    });

    it('should render full name input with optional label', () => {
      renderRegisterForm();

      const fullNameInput = screen.getByLabelText(/full name/i);
      expect(fullNameInput).toHaveAttribute('type', 'text');
      expect(fullNameInput).toHaveAttribute('autoComplete', 'name');
      expect(screen.getByText(/\(optional\)/i)).toBeInTheDocument();
    });

    it('should render password input with correct attributes', () => {
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
      expect(passwordInput).toHaveAttribute(
        'placeholder',
        'Create a strong password'
      );
    });

    it('should render confirm password input', () => {
      renderRegisterForm();

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute(
        'autoComplete',
        'new-password'
      );
    });

    it('should render two password visibility toggle buttons', () => {
      renderRegisterForm();

      const toggleButtons = screen.getAllByLabelText(/show password/i);
      expect(toggleButtons).toHaveLength(2);
    });

    it('should render terms & conditions checkbox', () => {
      renderRegisterForm();

      const checkbox = screen.getByLabelText(/i agree to the/i);
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render terms and privacy policy links', () => {
      renderRegisterForm();

      const termsLink = screen.getByRole('link', {
        name: /terms and conditions/i,
      });
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });

      expect(termsLink).toHaveAttribute('href', '/terms');
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      expect(termsLink).toHaveAttribute('target', '_blank');
      expect(privacyLink).toHaveAttribute('target', '_blank');
    });

    it('should render submit button with correct text', () => {
      renderRegisterForm();

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).not.toBeDisabled();
    });

    it('should NOT render role selection by default', () => {
      renderRegisterForm();

      expect(screen.queryByLabelText(/^role$/i)).not.toBeInTheDocument();
    });

    it('should render role selection when showRoleSelection is true', () => {
      renderRegisterForm({ showRoleSelection: true });

      const roleSelect = screen.getByLabelText(/^role$/i);
      expect(roleSelect).toBeInTheDocument();
      expect(roleSelect).toHaveValue('student'); // default value

      // Check options
      expect(screen.getByRole('option', { name: /student/i })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: /teacher\/admin/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: /super admin/i })
      ).toBeInTheDocument();
    });
  });

  // ============================================================
  // Password Strength Indicator Tests
  // ============================================================

  describe('Password Strength Indicator', () => {
    it('should NOT show password strength indicator when password is empty', () => {
      renderRegisterForm();

      expect(screen.queryByText(/password strength:/i)).not.toBeInTheDocument();
    });

    it('should show weak password strength for short passwords', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'abc123');

      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
      expect(screen.getByText(/weak/i)).toBeInTheDocument();
    });

    it('should show medium password strength for moderate passwords', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'password12');

      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should show strong password strength for strong passwords', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'StrongP@ssw0rd123!');

      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });

  // ============================================================
  // Password Visibility Toggle Tests
  // ============================================================

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility for password field', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click first toggle button (password field)
      const toggleButtons = screen.getAllByLabelText(/show password/i);
      await user.click(toggleButtons[0]);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getAllByLabelText(/hide password/i)[0]).toBeInTheDocument();

      // Click again to hide
      await user.click(toggleButtons[0]);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle password visibility for confirm password field', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Click second toggle button (confirm password field)
      const toggleButtons = screen.getAllByLabelText(/show password/i);
      await user.click(toggleButtons[1]);

      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      expect(screen.getAllByLabelText(/hide password/i)[1]).toBeInTheDocument();

      // Click again to hide
      await user.click(toggleButtons[1]);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('should have correct aria-label for password toggle', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const toggleButtons = screen.getAllByLabelText(/show password/i);
      await user.click(toggleButtons[0]);

      const hideButton = screen.getAllByLabelText(/hide password/i)[0];
      expect(hideButton).toHaveAttribute('aria-label', 'Hide password');
    });

    it('should have correct aria-label for confirm password toggle', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const toggleButtons = screen.getAllByLabelText(/show password/i);
      await user.click(toggleButtons[1]);

      const hideButton = screen.getAllByLabelText(/hide password/i)[1];
      expect(hideButton).toHaveAttribute('aria-label', 'Hide password');
    });
  });

  // ============================================================
  // Form Validation Tests
  // ============================================================

  describe('Form Validation', () => {
    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(passwordInput, 'short');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should show error for empty password', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password456');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
      });
    });

    it('should show error when terms are not accepted', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/you must accept the terms/i)
        ).toBeInTheDocument();
      });
    });

    it('should NOT submit form with validation errors', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm();

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should clear validation errors when input is corrected', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      // Trigger validation error
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      // Correct the input
      await user.type(emailInput, 'test@test.com');

      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // Form Submission - Success Tests
  // ============================================================

  describe('Form Submission - Success', () => {
    it('should submit form with valid registration data', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'newuser@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'newuser@test.com',
          password: 'password123',
        });
      });
    });

    it('should include full name in registration data when provided', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const fullNameInput = screen.getByLabelText(/full name/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'newuser@test.com');
      await user.type(fullNameInput, 'John Doe');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'newuser@test.com',
          password: 'password123',
          full_name: 'John Doe',
        });
      });
    });

    it('should include role in registration data when role selection is shown', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm({ showRoleSelection: true });

      const emailInput = screen.getByLabelText(/email address/i);
      const roleSelect = screen.getByLabelText(/^role$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'teacher@test.com');
      await user.selectOptions(roleSelect, 'admin_teacher');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'teacher@test.com',
          password: 'password123',
          role: 'admin_teacher',
        });
      });
    });

    it('should call clearError before submitting', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
      });
    });

    it('should navigate to dashboard after successful registration', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should navigate to custom redirect path when provided', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({});
      renderRegisterForm({ redirectTo: '/onboarding' });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
      });
    });
  });

  // ============================================================
  // Form Submission - Error Tests
  // ============================================================

  describe('Form Submission - Error', () => {
    it('should display error message when registration fails', async () => {
      const user = userEvent.setup();
      mockAuthContextValue.error = 'Email already exists';
      renderRegisterForm();

      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display error with alert role for accessibility', async () => {
      const user = userEvent.setup();
      mockAuthContextValue.error = 'Registration failed';
      renderRegisterForm();

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/registration failed/i);
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should call onSuccess callback after successful registration', async () => {
      const user = userEvent.setup();
      const onSuccessMock = vi.fn();
      mockRegister.mockResolvedValue({});
      renderRegisterForm({ onSuccess: onSuccessMock });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccessMock).toHaveBeenCalled();
      });
    });
  });

  // ============================================================
  // Loading States Tests
  // ============================================================

  describe('Loading States', () => {
    it('should show loading state during form submission', async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // Check for loading text
      expect(
        screen.getByRole('button', { name: /creating account/i })
      ).toBeInTheDocument();
    });

    it('should disable all inputs during form submission', async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // All inputs should be disabled
      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(confirmPasswordInput).toBeDisabled();
        expect(termsCheckbox).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should disable password toggle buttons during submission', async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // Toggle buttons should be disabled
      await waitFor(() => {
        const toggleButtons = screen.getAllByLabelText(/show password/i);
        expect(toggleButtons[0]).toBeDisabled();
        expect(toggleButtons[1]).toBeDisabled();
      });
    });

    it('should re-enable inputs after submission completes', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error('Registration failed'));
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // Wait for submission to complete
      await waitFor(() => {
        expect(emailInput).not.toBeDisabled();
        expect(passwordInput).not.toBeDisabled();
        expect(confirmPasswordInput).not.toBeDisabled();
        expect(termsCheckbox).not.toBeDisabled();
      });
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all form fields', () => {
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const fullNameInput = screen.getByLabelText(/full name/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);

      expect(emailInput).toHaveAccessibleName();
      expect(fullNameInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
      expect(confirmPasswordInput).toHaveAccessibleName();
      expect(termsCheckbox).toHaveAccessibleName();
    });

    it('should mark invalid fields with aria-invalid', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should associate error messages with inputs via aria-describedby', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
        expect(screen.getByRole('alert', { name: /email is required/i })).toBeInTheDocument();
      });
    });

    it('should have role="alert" for error messages', async () => {
      const user = userEvent.setup();
      mockAuthContextValue.error = 'Registration failed';
      renderRegisterForm();

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should associate password strength indicator via aria-describedby', async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveAttribute(
        'aria-describedby',
        'password-strength'
      );
    });
  });

  // ============================================================
  // Lifecycle Tests
  // ============================================================

  describe('Lifecycle', () => {
    it('should clear errors when component unmounts', () => {
      const { unmount } = renderRegisterForm();

      unmount();

      expect(mockClearError).toHaveBeenCalled();
    });

    it('should redirect to dashboard if already authenticated', () => {
      mockAuthContextValue.isAuthenticated = true;
      renderRegisterForm();

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // ============================================================
  // Role Selection Tests
  // ============================================================

  describe('Role Selection', () => {
    it('should allow changing role when showRoleSelection is true', async () => {
      const user = userEvent.setup();
      renderRegisterForm({ showRoleSelection: true });

      const roleSelect = screen.getByLabelText(/^role$/i);
      expect(roleSelect).toHaveValue('student');

      await user.selectOptions(roleSelect, 'admin_teacher');
      expect(roleSelect).toHaveValue('admin_teacher');

      await user.selectOptions(roleSelect, 'super_admin');
      expect(roleSelect).toHaveValue('super_admin');
    });

    it('should disable role select during submission', async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      renderRegisterForm({ showRoleSelection: true });

      const emailInput = screen.getByLabelText(/email address/i);
      const roleSelect = screen.getByLabelText(/^role$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByLabelText(/i agree to the/i);
      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(roleSelect).toBeDisabled();
      });
    });
  });
});
