/**
 * DeactivateUserModal Tests
 *
 * Tests for the DeactivateUserModal component:
 * - Validates reason field (10-500 chars)
 * - Shows character counter
 * - Disables submit with invalid reason
 * - Form validation and submission
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeactivateUserModal } from '../DeactivateUserModal';

describe('DeactivateUserModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const testUserName = 'John Doe';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <DeactivateUserModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        userName={testUserName}
        isLoading={false}
        {...props}
      />
    );
  };

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      renderComponent();

      expect(screen.getByText('Desactivar Usuario')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(
        <DeactivateUserModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          userName={testUserName}
        />
      );

      expect(screen.queryByText('Desactivar Usuario')).not.toBeInTheDocument();
    });

    it('should display user name in warning message', () => {
      renderComponent();

      expect(screen.getByText(testUserName)).toBeInTheDocument();
    });

    it('should show warning icon', () => {
      renderComponent();

      expect(screen.getByText('Advertencia')).toBeInTheDocument();
    });

    it('should display reason textarea', () => {
      renderComponent();

      expect(screen.getByPlaceholderText(/explica por qué/i)).toBeInTheDocument();
    });
  });

  describe('Reason Field Validation - Minimum Length', () => {
    it('should show error for reason less than 10 characters', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/la razón debe tener al menos 10 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should accept reason with exactly 10 characters', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Ten chars!'); // Exactly 10 chars

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith('Ten chars!');
      });
    });

    it('should disable submit button with invalid reason length', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Reason Field Validation - Maximum Length', () => {
    it('should show error for reason more than 500 characters', async () => {
      const user = userEvent.setup();

      renderComponent();

      const longReason = 'a'.repeat(501);
      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, longReason);

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/la razón no puede exceder 500 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should accept reason with exactly 500 characters', async () => {
      const user = userEvent.setup();

      renderComponent();

      const maxReason = 'a'.repeat(500);
      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, maxReason);

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith(maxReason);
      });
    });

    it('should disable submit button when reason exceeds 500 characters', async () => {
      const user = userEvent.setup();

      renderComponent();

      const longReason = 'a'.repeat(501);
      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, longReason);

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Character Counter', () => {
    it('should show character counter', () => {
      renderComponent();

      expect(screen.getByText(/0\/500/i)).toBeInTheDocument();
    });

    it('should update character counter as user types', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Test reason');

      await waitFor(() => {
        expect(screen.getByText(/11\/500/i)).toBeInTheDocument();
      });
    });

    it('should show character counter in red when exceeding limit', async () => {
      const user = userEvent.setup();

      renderComponent();

      const longReason = 'a'.repeat(501);
      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, longReason);

      await waitFor(() => {
        const counter = screen.getByText(/501\/500/i);
        expect(counter).toHaveClass('text-red-600');
      });
    });

    it('should show character counter in normal color when within limit', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Valid reason with good length');

      await waitFor(() => {
        const counter = screen.getByText(/31\/500/i);
        expect(counter).toHaveClass('text-gray-500');
      });
    });

    it('should display minimum and maximum character requirements', () => {
      renderComponent();

      expect(screen.getByText(/mínimo 10 caracteres, máximo 500/i)).toBeInTheDocument();
    });
  });

  describe('Submit Button State', () => {
    it('should enable submit button with valid reason', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'This is a valid reason for deactivation');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should disable submit button initially', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button during loading', () => {
      renderComponent({ isLoading: true });

      const submitButton = screen.getByRole('button', { name: /desactivando/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading text when isLoading is true', () => {
      renderComponent({ isLoading: true });

      expect(screen.getByText(/desactivando/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onConfirm with trimmed reason on submit', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, '  Valid reason with spaces  ');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledWith('Valid reason with spaces');
      });
    });

    it('should not call onConfirm with invalid reason', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should prevent form submission with Enter key when invalid', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');
      await user.keyboard('{Enter}');

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Modal Interactions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal during loading', () => {
      renderComponent({ isLoading: true });

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      expect(cancelButton).toBeDisabled();
    });

    it('should clear form state when closing', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Some test reason');

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Error State Display', () => {
    it('should clear error when user starts typing', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/la razón debe tener al menos 10 caracteres/i)).toBeInTheDocument();
      });

      // Start typing to clear error
      await user.type(reasonField, ' additional text to make it valid');

      await waitFor(() => {
        expect(screen.queryByText(/la razón debe tener al menos 10 caracteres/i)).not.toBeInTheDocument();
      });
    });

    it('should show red border on reason field when error exists', async () => {
      const user = userEvent.setup();

      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Short');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(reasonField).toHaveClass('border-red-500');
      });
    });
  });

  describe('Warning Message', () => {
    it('should display warning about deactivation consequences', () => {
      renderComponent();

      expect(
        screen.getByText(/el usuario no podrá iniciar sesión/i)
      ).toBeInTheDocument();
    });

    it('should have amber/yellow warning styling', () => {
      renderComponent();

      const warningBox = screen.getByText('Advertencia').closest('div');
      expect(warningBox).toHaveClass('bg-amber-50', 'border-amber-200');
    });
  });

  describe('Textarea Attributes', () => {
    it('should have required attribute', () => {
      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toHaveAttribute('required');
    });

    it('should have minLength attribute', () => {
      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toHaveAttribute('minLength', '10');
    });

    it('should have maxLength attribute', () => {
      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toHaveAttribute('maxLength', '500');
    });

    it('should have 4 rows', () => {
      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toHaveAttribute('rows', '4');
    });

    it('should disable textarea during loading', () => {
      renderComponent({ isLoading: true });

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label for reason field', () => {
      renderComponent();

      expect(screen.getByText(/razón de desactivación/i)).toBeInTheDocument();
    });

    it('should mark reason field as required in label', () => {
      renderComponent();

      const label = screen.getByText(/razón de desactivación/i);
      const requiredMark = label.querySelector('.text-red-500');
      expect(requiredMark).toHaveTextContent('*');
    });

    it('should have accessible buttons', () => {
      renderComponent();

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });

      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it('should associate label with textarea', () => {
      renderComponent();

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      expect(reasonField).toHaveAttribute('id', 'deactivate-reason');
    });
  });

  describe('Button Styling', () => {
    it('should have red background for submit button', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      expect(submitButton).toHaveClass('bg-red-600');
    });

    it('should show disabled state styling when disabled', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      expect(submitButton).toHaveClass('disabled:bg-red-400');
    });
  });
});
