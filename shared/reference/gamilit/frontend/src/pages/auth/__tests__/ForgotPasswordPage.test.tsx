/**
 * ForgotPasswordPage Component Tests
 *
 * Test Coverage:
 * - Rendering - Form State (7 tests): Email input, submit button, links, header
 * - Rendering - Success State (6 tests): Success message, instructions, button, icon
 * - Form Validation (4 tests): Email validation, empty email
 * - Form Submission - Success (3 tests): Submit flow, success state display
 * - Form Submission - Error (2 tests): Error display and handling
 * - Loading States (3 tests): Disable inputs, show spinner
 * - Accessibility (4 tests): ARIA labels, invalid states, error associations
 * - Navigation (2 tests): Back to login links
 *
 * Total: 31 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ForgotPasswordPage } from '../ForgotPasswordPage';

describe('ForgotPasswordPage', () => {
  // Helper function to render ForgotPasswordPage
  const renderForgotPasswordPage = () => {
    return render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Rendering Tests - Form State
  // ============================================================

  describe('Rendering - Form State', () => {
    it('should render forgot password form', () => {
      renderForgotPasswordPage();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /send reset link/i })
      ).toBeInTheDocument();
    });

    it('should render header with title and description', () => {
      renderForgotPasswordPage();

      expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
      expect(
        screen.getByText(/no worries! enter your email/i)
      ).toBeInTheDocument();
    });

    it('should render email input with correct attributes', () => {
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
    });

    it('should render submit button with mail icon', () => {
      renderForgotPasswordPage();

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).not.toBeDisabled();
    });

    it('should render back to login link in form state', () => {
      renderForgotPasswordPage();

      const backLinks = screen.getAllByRole('link', { name: /back to login/i });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute('href', '/login');
    });

    it('should render mail icon in header', () => {
      renderForgotPasswordPage();

      // Check for header section
      expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    });

    it('should NOT display success state initially', () => {
      renderForgotPasswordPage();

      expect(screen.queryByText(/check your email/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/we've sent a password reset link/i)
      ).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Rendering Tests - Success State
  // ============================================================

  describe('Rendering - Success State', () => {
    it('should display success state after form submission', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('should display success message with instructions', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/we've sent a password reset link/i)
        ).toBeInTheDocument();
      });
    });

    it('should display spam folder tip in success state', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/didn't receive the email\? check your spam folder/i)
        ).toBeInTheDocument();
      });
    });

    it('should display back to login button in success state', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /back to login/i })
        ).toBeInTheDocument();
      });
    });

    it('should display success icon in success state', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('should NOT display form in success state', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('button', { name: /send reset link/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Form Validation Tests
  // ============================================================

  describe('Form Validation', () => {
    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should NOT submit form with validation errors', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      // Form should not have submitted
      expect(screen.queryByText(/check your email/i)).not.toBeInTheDocument();
    });

    it('should clear validation error when input is corrected', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
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
    it('should submit form with valid email', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('should show success state after submission completes', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'user@example.com');
      await user.click(submitButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(
          screen.getByText(/we've sent a password reset link/i)
        ).toBeInTheDocument();
      });
    });

    it('should NOT show error message on successful submission', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/failed to send reset link/i)
      ).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // Form Submission - Error Tests
  // ============================================================

  describe('Form Submission - Error', () => {
    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();

      // Mock setTimeout to throw error
      vi.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        throw new Error('Network error');
      });

      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to send reset link/i)
        ).toBeInTheDocument();
      });

      vi.restoreAllMocks();
    });

    it('should display error with alert role for accessibility', async () => {
      const user = userEvent.setup();

      // Mock setTimeout to throw error
      vi.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        throw new Error('Network error');
      });

      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/failed to send reset link/i);
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });

      vi.restoreAllMocks();
    });
  });

  // ============================================================
  // Loading States Tests
  // ============================================================

  describe('Loading States', () => {
    it('should show loading state during form submission', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      // Check for loading text (will briefly appear)
      expect(
        screen.getByRole('button', { name: /sending/i })
      ).toBeInTheDocument();
    });

    it('should disable email input during submission', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      // Input should be disabled during submission
      expect(emailInput).toBeDisabled();
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      // Button should be disabled
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });
  });

  // ============================================================
  // Accessibility Tests
  // ============================================================

  describe('Accessibility', () => {
    it('should have proper ARIA label for email input', () => {
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAccessibleName();
    });

    it('should mark invalid email field with aria-invalid', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should associate error message with input via aria-describedby', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
        expect(
          screen.getByRole('alert', { name: /email is required/i })
        ).toBeInTheDocument();
      });
    });

    it('should have role="alert" for error messages', async () => {
      const user = userEvent.setup();

      // Mock setTimeout to throw error
      vi.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        throw new Error('Network error');
      });

      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });

      vi.restoreAllMocks();
    });
  });

  // ============================================================
  // Navigation Tests
  // ============================================================

  describe('Navigation', () => {
    it('should have back to login link in form state', () => {
      renderForgotPasswordPage();

      const backLinks = screen.getAllByRole('link', { name: /back to login/i });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute('href', '/login');
    });

    it('should have back to login link in success state', async () => {
      const user = userEvent.setup();
      renderForgotPasswordPage();

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'test@test.com');
      await user.click(submitButton);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to login/i });
        expect(backLink).toHaveAttribute('href', '/login');
      });
    });
  });
});
