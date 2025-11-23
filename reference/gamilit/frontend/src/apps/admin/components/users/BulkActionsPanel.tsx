/**
 * GLIT Platform V2 - Bulk Actions Panel Component
 *
 * Panel flotante para acciones masivas sobre usuarios seleccionados.
 * Aparece desde abajo con animación cuando hay usuarios seleccionados.
 *
 * Features:
 * - Panel flotante con animación slide-up (Framer Motion)
 * - 5 acciones principales: Suspender, Activar, Cambiar Rol, Eliminar, Exportar CSV
 * - Modal de confirmación para acciones peligrosas
 * - Contador de usuarios seleccionados
 * - TypeScript types completos
 * - Integración con useUserManagement hook
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserX,
  UserCheck,
  Shield,
  Trash2,
  Download,
  X,
  AlertTriangle,
  Users,
} from 'lucide-react';
import type { SystemUser } from '../../types';

/**
 * Props interface for BulkActionsPanel component
 */
interface BulkActionsPanelProps {
  /** Array of selected user IDs */
  selectedUsers: string[];
  /** Complete array of user objects for export and display */
  users: SystemUser[];
  /** Callback to clear all selections */
  onClearSelection: () => void;
  /** Callback to suspend selected users */
  onBulkSuspend: (userIds: string[]) => Promise<void>;
  /** Callback to activate selected users */
  onBulkActivate: (userIds: string[]) => Promise<void>;
  /** Callback to change role of selected users */
  onBulkChangeRole: (userIds: string[], role: string) => Promise<void>;
  /** Callback to delete selected users */
  onBulkDelete: (userIds: string[]) => Promise<void>;
  /** Callback to export selected users to CSV */
  onExportCSV: (userIds: string[]) => void;
}

/**
 * Action type definition
 */
interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  requiresConfirmation: boolean;
  requiresRole?: boolean;
}

/**
 * Confirmation modal props
 */
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  requiresRole?: boolean;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
}

/**
 * Confirmation Modal Component
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
  loading = false,
  requiresRole = false,
  selectedRole = 'student',
  onRoleChange,
}) => {
  const roleOptions = [
    { value: 'student', label: 'Detective Novato' },
    { value: 'teacher', label: 'Sargento Detective' },
    { value: 'manager', label: 'Inspector' },
    { value: 'admin', label: 'Inspector Jefe' },
    { value: 'owner', label: 'Comisario Jefe' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  </div>
                  <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-gray-700 text-sm leading-relaxed">{message}</p>

                {/* Role Selection */}
                {requiresRole && onRoleChange && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuevo Rol
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => onRoleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      disabled={loading}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    confirmLabel
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * BulkActionsPanel Component
 *
 * Displays a floating panel at the bottom of the screen when users are selected.
 * Provides quick access to bulk operations.
 */
export const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({
  selectedUsers,
  users,
  onClearSelection,
  onBulkSuspend,
  onBulkActivate,
  onBulkChangeRole,
  onBulkDelete,
  onExportCSV,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    action: string | null;
    title: string;
    message: string;
    confirmLabel: string;
    confirmColor: string;
    requiresRole?: boolean;
  }>({
    isOpen: false,
    action: null,
    title: '',
    message: '',
    confirmLabel: '',
    confirmColor: '',
    requiresRole: false,
  });
  const [selectedRole, setSelectedRole] = useState<string>('student');

  // Available bulk actions
  const actions: BulkAction[] = [
    {
      id: 'suspend',
      label: 'Suspender',
      icon: UserX,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      requiresConfirmation: true,
    },
    {
      id: 'activate',
      label: 'Activar',
      icon: UserCheck,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      requiresConfirmation: false,
    },
    {
      id: 'changeRole',
      label: 'Cambiar Rol',
      icon: Shield,
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      requiresConfirmation: true,
      requiresRole: true,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      requiresConfirmation: true,
    },
    {
      id: 'export',
      label: 'Exportar CSV',
      icon: Download,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      requiresConfirmation: false,
    },
  ];

  /**
   * Handle action click
   */
  const handleActionClick = (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    if (!action) return;

    // Actions that don't require confirmation
    if (!action.requiresConfirmation) {
      executeAction(actionId);
      return;
    }

    // Show confirmation modal
    const confirmationMessages: Record<string, { title: string; message: string; confirmLabel: string; confirmColor: string }> = {
      suspend: {
        title: 'Confirmar Suspensión',
        message: `¿Estás seguro de que deseas suspender ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}? Los usuarios suspendidos no podrán acceder al sistema.`,
        confirmLabel: 'Suspender Usuarios',
        confirmColor: 'bg-red-500 hover:bg-red-600',
      },
      changeRole: {
        title: 'Confirmar Cambio de Rol',
        message: `Se cambiará el rol de ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}. Esta acción afectará sus permisos y acceso al sistema.`,
        confirmLabel: 'Cambiar Rol',
        confirmColor: 'bg-amber-500 hover:bg-amber-600',
      },
      delete: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}? Esta acción NO se puede deshacer y se eliminarán todos los datos asociados.`,
        confirmLabel: 'Eliminar Usuarios',
        confirmColor: 'bg-red-600 hover:bg-red-700',
      },
    };

    const config = confirmationMessages[actionId];
    if (config) {
      setConfirmationModal({
        isOpen: true,
        action: actionId,
        ...config,
        requiresRole: action.requiresRole,
      });
    }
  };

  /**
   * Execute bulk action
   */
  const executeAction = async (actionId: string) => {
    try {
      setLoading(true);

      switch (actionId) {
        case 'suspend':
          await onBulkSuspend(selectedUsers);
          break;
        case 'activate':
          await onBulkActivate(selectedUsers);
          break;
        case 'changeRole':
          await onBulkChangeRole(selectedUsers, selectedRole);
          break;
        case 'delete':
          await onBulkDelete(selectedUsers);
          break;
        case 'export':
          onExportCSV(selectedUsers);
          break;
      }

      // Close modal and clear selection
      setConfirmationModal({ ...confirmationModal, isOpen: false });
      onClearSelection();
    } catch (error) {
      console.error('Error executing bulk action:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle confirmation
   */
  const handleConfirm = () => {
    if (confirmationModal.action) {
      executeAction(confirmationModal.action);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };

  // Get selected user objects
  const selectedUserObjects = users.filter((user) => selectedUsers.includes(user.id));

  return (
    <>
      {/* Bulk Actions Panel */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 pointer-events-none"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Left: Counter and Clear */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          {selectedUsers.length} Usuario{selectedUsers.length > 1 ? 's' : ''} Seleccionado{selectedUsers.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-amber-700">
                          {selectedUserObjects.map((u) => u.display_name || u.email).join(', ')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onClearSelection}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                      <span>Limpiar</span>
                    </button>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action.id)}
                          disabled={loading}
                          className={`flex items-center space-x-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.color} ${action.hoverColor}`}
                          title={action.label}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmLabel={confirmationModal.confirmLabel}
        confirmColor={confirmationModal.confirmColor}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
        requiresRole={confirmationModal.requiresRole}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />
    </>
  );
};

export default BulkActionsPanel;
