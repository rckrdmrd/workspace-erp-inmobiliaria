import React from 'react';
import { Monitor, Smartphone, Tablet, X, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const SessionsList: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch sessions using react-query
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: authAPI.getSessions,
    refetchOnWindowFocus: true,
  });

  // Mutation for revoking sessions
  const revokeMutation = useMutation({
    mutationFn: authAPI.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Sesión cerrada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al cerrar la sesión');
    },
  });

  const handleRevokeSession = (sessionId: string) => {
    if (confirm('¿Estás seguro de que deseas cerrar esta sesión?')) {
      revokeMutation.mutate(sessionId);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'mobile') {
      return <Smartphone className="w-5 h-5 text-gray-600" />;
    } else if (deviceType === 'tablet') {
      return <Tablet className="w-5 h-5 text-gray-600" />;
    }
    return <Monitor className="w-5 h-5 text-gray-600" />;
  };

  const formatLastActivity = (lastActivity: Date | string) => {
    try {
      const date = typeof lastActivity === 'string' ? new Date(lastActivity) : lastActivity;
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
      return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        <span className="ml-2 text-gray-600">Cargando sesiones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          Error al cargar las sesiones. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">No hay sesiones activas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getDeviceIcon(session.deviceType)}
            <div>
              <p className="text-detective-body font-medium">
                {session.browser} en {session.os}
              </p>
              <p className="text-detective-small text-gray-500">
                {session.ipAddress} • {formatLastActivity(session.lastActivity)}
              </p>
            </div>
          </div>
          {session.isCurrent ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Sesión Actual
            </span>
          ) : (
            <button
              onClick={() => handleRevokeSession(session.id)}
              disabled={revokeMutation.isPending}
              className="p-2 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cerrar sesión"
            >
              {revokeMutation.isPending ? (
                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
