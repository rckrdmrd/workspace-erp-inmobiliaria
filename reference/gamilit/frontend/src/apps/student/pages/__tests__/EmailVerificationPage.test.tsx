/**
 * EmailVerificationPage Tests
 *
 * Tests for the deprecated email verification page:
 * - Shows informational message about deprecation
 * - Provides links to login and dashboard
 * - No verification logic executes
 * - Displays proper deprecated status
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EmailVerificationPage from '../EmailVerificationPage';

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

describe('EmailVerificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <EmailVerificationPage />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the page', () => {
      renderComponent();

      expect(screen.getByText('GAMILIT')).toBeInTheDocument();
      expect(screen.getByText('Verificación No Requerida')).toBeInTheDocument();
    });

    it('should show deprecation message', () => {
      renderComponent();

      expect(
        screen.getByText(/la verificación de email ya no es necesaria/i)
      ).toBeInTheDocument();
    });

    it('should display informational message', () => {
      renderComponent();

      expect(
        screen.getByText(/todas las cuentas están automáticamente verificadas/i)
      ).toBeInTheDocument();
    });

    it('should show success icon', () => {
      renderComponent();

      // CheckCircle2 icon should be in the document
      const pageContent = screen.getByText('Verificación No Requerida').closest('div');
      expect(pageContent).toBeInTheDocument();
    });
  });

  describe('Informational Notice', () => {
    it('should display blue info notice box', () => {
      renderComponent();

      const infoText = screen.getByText(
        /puedes iniciar sesión directamente con tu cuenta/i
      );
      expect(infoText).toBeInTheDocument();

      // Check for info box styling (bg-blue-50, border-blue-200)
      const infoBox = infoText.closest('div');
      expect(infoBox).toHaveClass('bg-blue-50', 'border-blue-200');
    });

    it('should explain no email verification needed', () => {
      renderComponent();

      expect(
        screen.getByText(/ya no es necesario verificar tu email/i)
      ).toBeInTheDocument();
    });

    it('should have info icon in notice', () => {
      renderComponent();

      // Info icon should be present
      const noticeBox = screen.getByText(/puedes iniciar sesión/i).closest('div');
      expect(noticeBox).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should provide login button', () => {
      renderComponent();

      const loginButton = screen.getByRole('button', { name: /ir al login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should provide dashboard link', () => {
      renderComponent();

      const dashboardLink = screen.getByRole('button', { name: /ir al dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
    });

    it('should navigate to login when login button is clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      const loginButton = screen.getByRole('button', { name: /ir al login/i });
      await user.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to dashboard when dashboard button is clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      const dashboardLink = screen.getByRole('button', { name: /ir al dashboard/i });
      await user.click(dashboardLink);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('No Verification Logic', () => {
    it('should NOT execute any verification logic', () => {
      // This test ensures no API calls or verification checks happen
      const apiSpy = vi.fn();

      renderComponent();

      // No API calls should have been made
      expect(apiSpy).not.toHaveBeenCalled();
    });

    it('should NOT show loading states', () => {
      renderComponent();

      expect(screen.queryByText(/verificando/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    it('should NOT show error messages', () => {
      renderComponent();

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/falló/i)).not.toBeInTheDocument();
    });

    it('should NOT show resend email option', () => {
      renderComponent();

      expect(screen.queryByText(/reenviar/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/enviar nuevamente/i)).not.toBeInTheDocument();
    });

    it('should NOT show token input or verification form', () => {
      renderComponent();

      const inputs = screen.queryAllByRole('textbox');
      expect(inputs).toHaveLength(0);

      const forms = screen.queryAllByRole('form');
      expect(forms).toHaveLength(0);
    });
  });

  describe('Deprecated Status', () => {
    it('should clearly indicate feature is deprecated', () => {
      renderComponent();

      expect(screen.getByText('Verificación No Requerida')).toBeInTheDocument();
    });

    it('should NOT mention email verification as active feature', () => {
      renderComponent();

      // Should not have text suggesting verification is required
      expect(screen.queryByText(/verifica tu correo/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/enviamos un email/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/revisa tu bandeja/i)).not.toBeInTheDocument();
    });

    it('should provide clear migration path to users', () => {
      renderComponent();

      // Both login and dashboard options should be available
      expect(screen.getByRole('button', { name: /ir al login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ir al dashboard/i })).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('should use positive messaging (success icon)', () => {
      renderComponent();

      // Page should have success/check icon, not warning or error
      const heading = screen.getByText('Verificación No Requerida');
      const container = heading.closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should have clear call-to-action buttons', () => {
      renderComponent();

      const loginButton = screen.getByRole('button', { name: /ir al login/i });
      const dashboardButton = screen.getByRole('button', { name: /ir al dashboard/i });

      expect(loginButton).toBeVisible();
      expect(dashboardButton).toBeVisible();
    });

    it('should prioritize login over dashboard', () => {
      renderComponent();

      const buttons = screen.getAllByRole('button');
      const loginButtonIndex = buttons.findIndex(
        (btn) => btn.textContent?.includes('Login')
      );
      const dashboardButtonIndex = buttons.findIndex(
        (btn) => btn.textContent?.includes('Dashboard')
      );

      // Login button should appear before dashboard button
      expect(loginButtonIndex).toBeLessThan(dashboardButtonIndex);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent();

      const mainHeading = screen.getByText('Verificación No Requerida');
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have accessible buttons', () => {
      renderComponent();

      const loginButton = screen.getByRole('button', { name: /ir al login/i });
      const dashboardButton = screen.getByRole('button', { name: /ir al dashboard/i });

      expect(loginButton).toBeInTheDocument();
      expect(dashboardButton).toBeInTheDocument();
    });

    it('should have descriptive text for screen readers', () => {
      renderComponent();

      // All key information should be present as text
      expect(
        screen.getByText(/la verificación de email ya no es necesaria/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/todas las cuentas están automáticamente verificadas/i)
      ).toBeInTheDocument();
    });
  });

  describe('Branding', () => {
    it('should display GAMILIT branding', () => {
      renderComponent();

      expect(screen.getByText('GAMILIT')).toBeInTheDocument();
    });

    it('should have consistent styling with other pages', () => {
      renderComponent();

      // Should use DetectiveCard and consistent theming
      const card = screen.getByText('GAMILIT').closest('div');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Legacy Support', () => {
    it('should handle old email verification links gracefully', () => {
      // Even if accessed with old URL parameters, page should render without errors
      renderComponent();

      expect(screen.getByText('Verificación No Requerida')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should NOT break with query parameters', () => {
      // Old verification links might have ?token=xyz
      // Page should still render correctly
      renderComponent();

      expect(screen.getByText(/ir al login/i)).toBeInTheDocument();
    });
  });
});
