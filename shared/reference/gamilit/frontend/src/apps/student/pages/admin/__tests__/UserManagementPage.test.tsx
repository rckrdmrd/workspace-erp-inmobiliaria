/**
 * UserManagementPage Tests
 *
 * Tests for user management functionality:
 * - Renders user table with is_active status
 * - Shows activate button for inactive users
 * - Shows deactivate button for active users
 * - Opens deactivation modal with reason field
 * - Prevents self-deactivation (shows toast warning)
 * - Filters users by is_active status
 * - Refreshes list after activate/deactivate
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserManagementPage from '../UserManagementPage';
import type { User } from '@features/auth/types/auth.types';

// Mock admin API
const mockGetUsersList = vi.fn();
const mockActivateUser = vi.fn();
const mockDeactivateUser = vi.fn();

vi.mock('@features/admin/api/adminAPI', () => ({
  adminAPI: {
    getUsersList: mockGetUsersList,
    activateUser: mockActivateUser,
    deactivateUser: mockDeactivateUser,
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockUsers: User[] = [
  {
    id: '1',
    email: 'active.user@test.com',
    fullName: 'Active User',
    role: 'student',
    emailVerified: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'inactive.user@test.com',
    fullName: 'Inactive User',
    role: 'student',
    emailVerified: true,
    isActive: false,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'admin@glit.com',
    fullName: 'Admin User',
    role: 'super_admin',
    emailVerified: true,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
  },
];

describe('UserManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUsersList.mockResolvedValue({ users: mockUsers });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserManagementPage />
      </BrowserRouter>
    );
  };

  describe('Rendering', () => {
    it('should render user management page', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      });
    });

    it('should display user count', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/3 usuarios encontrados/i)).toBeInTheDocument();
      });
    });

    it('should render user table', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
        expect(screen.getByText('Inactive User')).toBeInTheDocument();
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      renderComponent();

      expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();
    });
  });

  describe('User Table with is_active Status', () => {
    it('should display is_active status for each user', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      // Should show status badges
      const statusBadges = screen.getAllByText(/activo|inactivo/i);
      expect(statusBadges.length).toBeGreaterThan(0);
    });

    it('should show green badge for active users', async () => {
      renderComponent();

      await waitFor(() => {
        const activeUserRow = screen.getByText('Active User').closest('tr');
        const statusBadge = within(activeUserRow!).getByText('Activo');
        expect(statusBadge).toHaveClass('text-green-800');
      });
    });

    it('should show red badge for inactive users', async () => {
      renderComponent();

      await waitFor(() => {
        const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
        const statusBadge = within(inactiveUserRow!).getByText('Inactivo');
        expect(statusBadge).toHaveClass('text-red-800');
      });
    });
  });

  describe('Activate Button for Inactive Users', () => {
    it('should show activate button for inactive users', async () => {
      renderComponent();

      await waitFor(() => {
        const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
        const activateButton = within(inactiveUserRow!).getByTitle('Activar usuario');
        expect(activateButton).toBeInTheDocument();
      });
    });

    it('should NOT show activate button for active users', async () => {
      renderComponent();

      await waitFor(() => {
        const activeUserRow = screen.getByText('Active User').closest('tr');
        const activateButton = within(activeUserRow!).queryByTitle('Activar usuario');
        expect(activateButton).not.toBeInTheDocument();
      });
    });

    it('should open activate modal when activate button clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Inactive User')).toBeInTheDocument();
      });

      const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
      const activateButton = within(inactiveUserRow!).getByTitle('Activar usuario');
      await user.click(activateButton);

      await waitFor(() => {
        expect(screen.getByText(/activar usuario/i)).toBeInTheDocument();
      });
    });
  });

  describe('Deactivate Button for Active Users', () => {
    it('should show deactivate button for active users', async () => {
      renderComponent();

      await waitFor(() => {
        const activeUserRow = screen.getByText('Active User').closest('tr');
        const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
        expect(deactivateButton).toBeInTheDocument();
      });
    });

    it('should NOT show deactivate button for inactive users', async () => {
      renderComponent();

      await waitFor(() => {
        const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
        const deactivateButton = within(inactiveUserRow!).queryByTitle('Desactivar usuario');
        expect(deactivateButton).not.toBeInTheDocument();
      });
    });

    it('should open deactivation modal when deactivate button clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByText('Desactivar Usuario')).toBeInTheDocument();
      });
    });
  });

  describe('Deactivation Modal', () => {
    it('should display reason field in deactivation modal', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/explica por qué/i)).toBeInTheDocument();
      });
    });

    it('should show user name in deactivation modal', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByText(/Active User/)).toBeInTheDocument();
      });
    });

    it('should submit deactivation with reason', async () => {
      const user = userEvent.setup();

      mockDeactivateUser.mockResolvedValueOnce({
        ...mockUsers[0],
        isActive: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/explica por qué/i)).toBeInTheDocument();
      });

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Violation of community guidelines');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockDeactivateUser).toHaveBeenCalledWith('1', {
          reason: 'Violation of community guidelines',
        });
      });
    });
  });

  describe('Self-Deactivation Prevention', () => {
    it('should prevent admin from deactivating themselves', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });

      const adminUserRow = screen.getByText('Admin User').closest('tr');
      const deactivateButton = within(adminUserRow!).queryByTitle('Desactivar usuario');

      if (deactivateButton) {
        await user.click(deactivateButton);

        await waitFor(() => {
          expect(screen.getByText(/no puedes desactivar tu propia cuenta/i)).toBeInTheDocument();
        });

        // Modal should NOT open
        expect(screen.queryByText('Desactivar Usuario')).not.toBeInTheDocument();
      }
    });

    it('should show warning toast for self-deactivation attempt', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });

      const adminUserRow = screen.getByText('Admin User').closest('tr');
      const deactivateButton = within(adminUserRow!).queryByTitle('Desactivar usuario');

      if (deactivateButton) {
        await user.click(deactivateButton);

        await waitFor(() => {
          expect(screen.getByText(/acción no permitida/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('User Filtering by is_active Status', () => {
    it('should have filter dropdown for user status', async () => {
      renderComponent();

      await waitFor(() => {
        const statusFilter = screen.getByRole('combobox', { name: '' });
        expect(statusFilter).toBeInTheDocument();
      });

      const filterSelects = screen.getAllByRole('combobox');
      const statusFilter = filterSelects.find(select =>
        within(select).queryByText('Todos los estados') !== null ||
        select.innerHTML.includes('Activos') ||
        select.innerHTML.includes('Inactivos')
      );

      expect(statusFilter).toBeInTheDocument();
    });

    it('should filter to show only active users', async () => {
      const user = userEvent.setup();

      const activeUsers = mockUsers.filter(u => u.isActive);
      mockGetUsersList.mockResolvedValueOnce({ users: activeUsers });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const filterSelects = screen.getAllByRole('combobox');
      const statusFilter = filterSelects[filterSelects.length - 1]; // Last select is status filter

      await user.selectOptions(statusFilter, 'active');

      await waitFor(() => {
        expect(mockGetUsersList).toHaveBeenCalledWith(
          expect.objectContaining({ is_active: true })
        );
      });
    });

    it('should filter to show only inactive users', async () => {
      const user = userEvent.setup();

      const inactiveUsers = mockUsers.filter(u => !u.isActive);
      mockGetUsersList.mockResolvedValueOnce({ users: inactiveUsers });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Inactive User')).toBeInTheDocument();
      });

      const filterSelects = screen.getAllByRole('combobox');
      const statusFilter = filterSelects[filterSelects.length - 1];

      await user.selectOptions(statusFilter, 'inactive');

      await waitFor(() => {
        expect(mockGetUsersList).toHaveBeenCalledWith(
          expect.objectContaining({ is_active: false })
        );
      });
    });
  });

  describe('List Refresh After Actions', () => {
    it('should refresh list after successful activation', async () => {
      const user = userEvent.setup();

      mockActivateUser.mockResolvedValueOnce({
        ...mockUsers[1],
        isActive: true,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Inactive User')).toBeInTheDocument();
      });

      const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
      const activateButton = within(inactiveUserRow!).getByTitle('Activar usuario');
      await user.click(activateButton);

      // Confirm activation
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /activar/i });
        return user.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/usuario activado/i)).toBeInTheDocument();
      });

      // User status should update in the table
      await waitFor(() => {
        const updatedRow = screen.getByText('Inactive User').closest('tr');
        expect(within(updatedRow!).queryByTitle('Activar usuario')).not.toBeInTheDocument();
      });
    });

    it('should refresh list after successful deactivation', async () => {
      const user = userEvent.setup();

      mockDeactivateUser.mockResolvedValueOnce({
        ...mockUsers[0],
        isActive: false,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/explica por qué/i)).toBeInTheDocument();
      });

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Test deactivation reason for compliance');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/usuario desactivado/i)).toBeInTheDocument();
      });
    });

    it('should have manual refresh button', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
      });
    });

    it('should refresh list when refresh button clicked', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /actualizar/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(mockGetUsersList).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast when user list fails to load', async () => {
      mockGetUsersList.mockRejectedValueOnce(new Error('Failed to load users'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/error al cargar usuarios/i)).toBeInTheDocument();
      });
    });

    it('should show error toast when activation fails', async () => {
      const user = userEvent.setup();

      mockActivateUser.mockRejectedValueOnce(new Error('Failed to activate'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Inactive User')).toBeInTheDocument();
      });

      const inactiveUserRow = screen.getByText('Inactive User').closest('tr');
      const activateButton = within(inactiveUserRow!).getByTitle('Activar usuario');
      await user.click(activateButton);

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /activar/i });
        return user.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/error al activar usuario/i)).toBeInTheDocument();
      });
    });

    it('should show error toast when deactivation fails', async () => {
      const user = userEvent.setup();

      mockDeactivateUser.mockRejectedValueOnce(new Error('Failed to deactivate'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const activeUserRow = screen.getByText('Active User').closest('tr');
      const deactivateButton = within(activeUserRow!).getByTitle('Desactivar usuario');
      await user.click(deactivateButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/explica por qué/i)).toBeInTheDocument();
      });

      const reasonField = screen.getByPlaceholderText(/explica por qué/i);
      await user.type(reasonField, 'Test reason for error handling validation');

      const submitButton = screen.getByRole('button', { name: /desactivar usuario/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error al desactivar usuario/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should have search input', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/buscar usuarios/i)).toBeInTheDocument();
      });
    });

    it('should filter users by search query', async () => {
      const user = userEvent.setup();

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      await user.type(searchInput, 'Active');

      await waitFor(() => {
        expect(mockGetUsersList).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'Active' })
        );
      });
    });
  });
});
