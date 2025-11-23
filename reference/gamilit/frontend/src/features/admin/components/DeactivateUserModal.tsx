import React, { useState } from 'react';
import { Modal } from '@shared/components/common/Modal';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@shared/utils/cn';

export interface DeactivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName: string;
  isLoading?: boolean;
}

export const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate reason length
    if (reason.trim().length < 10) {
      setError('La razón debe tener al menos 10 caracteres');
      return;
    }

    if (reason.trim().length > 500) {
      setError('La razón no puede exceder 500 caracteres');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  const isValidReason = reason.trim().length >= 10 && reason.trim().length <= 500;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Desactivar Usuario"

      showCloseButton={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning message */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">
              Advertencia
            </h4>
            <p className="text-sm text-amber-800">
              Estás a punto de desactivar la cuenta de <strong>{userName}</strong>.
              El usuario no podrá iniciar sesión hasta que su cuenta sea reactivada.
            </p>
          </div>
        </div>

        {/* Reason field */}
        <div>
          <label htmlFor="deactivate-reason" className="block text-detective-base font-medium text-detective-text mb-2">
            Razón de desactivación <span className="text-red-500">*</span>
          </label>
          <textarea
            id="deactivate-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Explica por qué estás desactivando esta cuenta..."
            className={cn(
              'w-full px-4 py-3 bg-gray-50 border rounded-lg',
              'text-detective-base text-detective-text',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-detective-orange focus:border-transparent',
              'resize-none',
              error ? 'border-red-500' : 'border-gray-300',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            rows={4}
            minLength={10}
            maxLength={500}
            required
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-detective-sm text-gray-500">
              Mínimo 10 caracteres, máximo 500
            </p>
            <p className={cn(
              'text-detective-sm',
              reason.length > 500 ? 'text-red-600' : 'text-gray-500'
            )}>
              {reason.length}/500
            </p>
          </div>
          {error && (
            <p className="text-detective-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <DetectiveButton
            type="button"
            variant="blue"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </DetectiveButton>
          <DetectiveButton
            type="submit"
            variant="primary"
            disabled={!isValidReason || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400"
          >
            {isLoading ? 'Desactivando...' : 'Desactivar Usuario'}
          </DetectiveButton>
        </div>
      </form>
    </Modal>
  );
};
