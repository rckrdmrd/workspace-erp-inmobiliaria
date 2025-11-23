import React, { useState } from 'react';
import { Modal } from '@shared/components/common/Modal';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@shared/utils/cn';

export interface ActivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  userName: string;
  isLoading?: boolean;
}

export const ActivateUserModal: React.FC<ActivateUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim() || undefined);
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Activar Usuario"

      showCloseButton={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info message */}
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">
              Activación de cuenta
            </h4>
            <p className="text-sm text-green-800">
              Estás a punto de activar la cuenta de <strong>{userName}</strong>.
              El usuario podrá iniciar sesión y acceder a la plataforma nuevamente.
            </p>
          </div>
        </div>

        {/* Optional reason field */}
        <div>
          <label htmlFor="activate-reason" className="block text-detective-base font-medium text-detective-text mb-2">
            Razón de activación (opcional)
          </label>
          <textarea
            id="activate-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Puedes agregar un comentario sobre la activación..."
            className={cn(
              'w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg',
              'text-detective-base text-detective-text',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-detective-orange focus:border-transparent',
              'resize-none',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
          {reason.length > 0 && (
            <p className={cn(
              'text-detective-sm text-right mt-1',
              reason.length > 500 ? 'text-red-600' : 'text-gray-500'
            )}>
              {reason.length}/500
            </p>
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
            variant="green"
            disabled={isLoading}
          >
            {isLoading ? 'Activando...' : 'Activar Usuario'}
          </DetectiveButton>
        </div>
      </form>
    </Modal>
  );
};
