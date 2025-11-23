import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';

interface SessionTimeoutWarningProps {
  minutesLeft: number;
  onExtend: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({ minutesLeft, onExtend }) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white border-2 border-orange-400 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-detective-subtitle mb-2">Sesión por Expirar</h3>
          <p className="text-detective-body mb-4">
            Tu sesión expirará en {minutesLeft} minutos por inactividad.
          </p>
          <DetectiveButton variant="primary" onClick={onExtend}>
            Extender Sesión
          </DetectiveButton>
        </div>
      </div>
    </div>
  );
};
