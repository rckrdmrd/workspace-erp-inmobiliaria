import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export const SecurityEventsList: React.FC = () => {
  const mockEvents = [
    { id: '1', type: 'success', message: 'Login exitoso desde IP conocida', time: '5 min ago' },
    { id: '2', type: 'warning', message: 'Intento de login fallido', time: '15 min ago' },
    { id: '3', type: 'info', message: 'Nueva sesión iniciada', time: '1 hour ago' },
    { id: '4', type: 'error', message: 'Múltiples intentos de login fallidos', time: '2 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-2">
      {mockEvents.map((event) => (
        <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          {getIcon(event.type)}
          <div className="flex-1">
            <p className="text-detective-body">{event.message}</p>
            <p className="text-detective-small text-gray-500">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
