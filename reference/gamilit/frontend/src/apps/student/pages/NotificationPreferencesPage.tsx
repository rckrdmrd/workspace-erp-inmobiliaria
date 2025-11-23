/**
 * NotificationPreferencesPage
 *
 * Page for managing notification preferences (multi-channel)
 * Allows users to configure which notifications they want to receive
 * and through which channels (in-app, email, push)
 *
 * @version 1.0 (2025-01-13) - Initial implementation for FE-054
 */

import React, { useEffect, useState } from 'react';
import { useNotificationsStore } from '@/features/notifications/store/notificationsStore';
import type { UpdatePreferenceDto } from '@/services/api/notificationsAPI';

// Notification types supported (aligned with backend)
const NOTIFICATION_TYPES = [
  {
    key: 'achievement',
    label: 'Logros Desbloqueados',
    description: 'Cuando desbloqueas un nuevo logro',
    icon: '🏆',
    defaultChannels: { inApp: true, email: true, push: true },
  },
  {
    key: 'rank_up',
    label: 'Subida de Rango',
    description: 'Cuando subes de rango (Maya)',
    icon: '⬆️',
    defaultChannels: { inApp: true, email: true, push: true },
  },
  {
    key: 'friend_request',
    label: 'Solicitudes de Amistad',
    description: 'Cuando alguien te envía una solicitud',
    icon: '👥',
    defaultChannels: { inApp: true, email: false, push: true },
  },
  {
    key: 'assignment_created',
    label: 'Nuevas Tareas',
    description: 'Cuando el profesor asigna una tarea',
    icon: '📝',
    defaultChannels: { inApp: true, email: true, push: false },
  },
  {
    key: 'assignment_graded',
    label: 'Tareas Calificadas',
    description: 'Cuando el profesor califica tu tarea',
    icon: '✅',
    defaultChannels: { inApp: true, email: true, push: false },
  },
  {
    key: 'mission_completed',
    label: 'Misiones Completadas',
    description: 'Cuando completas una misión',
    icon: '🎯',
    defaultChannels: { inApp: true, email: false, push: true },
  },
  {
    key: 'ml_coins_earned',
    label: 'ML Coins Ganadas',
    description: 'Cuando ganas ML Coins',
    icon: '🪙',
    defaultChannels: { inApp: true, email: false, push: false },
  },
  {
    key: 'system_announcement',
    label: 'Anuncios del Sistema',
    description: 'Notificaciones importantes del sistema',
    icon: '📢',
    defaultChannels: { inApp: true, email: true, push: false },
  },
];

export const NotificationPreferencesPage: React.FC = () => {
  const {
    preferences,
    preferencesLoading,
    fetchPreferences,
    updatePreference,
  } = useNotificationsStore();

  const [pendingChanges, setPendingChanges] = useState<
    Record<string, UpdatePreferenceDto>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Load preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Get preference for a notification type (with defaults)
  const getPreference = (notificationType: string) => {
    const existing = preferences.find((p) => p.notificationType === notificationType);
    if (existing) {
      return {
        inAppEnabled: existing.inAppEnabled,
        emailEnabled: existing.emailEnabled,
        pushEnabled: existing.pushEnabled,
      };
    }

    // Return defaults (same as backend)
    return {
      inAppEnabled: true,
      emailEnabled: true,
      pushEnabled: false,
    };
  };

  // Handle toggle change
  const handleToggle = (
    notificationType: string,
    channel: 'inAppEnabled' | 'emailEnabled' | 'pushEnabled',
  ) => {
    const currentPref = getPreference(notificationType);
    const pendingPref = pendingChanges[notificationType] || currentPref;

    setPendingChanges({
      ...pendingChanges,
      [notificationType]: {
        ...pendingPref,
        [channel]: !pendingPref[channel],
      },
    });
  };

  // Check if there are pending changes
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  // Save all pending changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSavedMessage('');

    try {
      // Update each changed preference
      const updates = Object.entries(pendingChanges).map(([type, updates]) =>
        updatePreference(type, updates),
      );

      await Promise.all(updates);

      setPendingChanges({});
      setSavedMessage('✅ Preferencias guardadas correctamente');

      // Clear message after 3 seconds
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      setSavedMessage('❌ Error al guardar preferencias');
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Discard pending changes
  const handleDiscardChanges = () => {
    setPendingChanges({});
    setSavedMessage('');
  };

  if (preferencesLoading && preferences.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando preferencias...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Preferencias de Notificaciones</h1>
        <p style={{ color: '#666' }}>
          Configura qué notificaciones quieres recibir y por qué canales
        </p>
      </div>

      {/* Channel Legend */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <div>
          <strong>🔴 In-App:</strong> Notificación dentro de la aplicación
        </div>
        <div>
          <strong>📧 Email:</strong> Correo electrónico
        </div>
        <div>
          <strong>📱 Push:</strong> Notificación push (móvil/web)
        </div>
      </div>

      {/* Notification Types Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', width: '40%' }}>
                Tipo de Notificación
              </th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>🔴 In-App</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>📧 Email</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>📱 Push</th>
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_TYPES.map((type) => {
              const currentPref = getPreference(type.key);
              const pendingPref = pendingChanges[type.key] || currentPref;
              const hasChanges = !!pendingChanges[type.key];

              return (
                <tr
                  key={type.key}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: hasChanges ? '#fffbf0' : 'white',
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                        <strong>{type.label}</strong>
                        {hasChanges && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#ff9800',
                              backgroundColor: '#fff3e0',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            Modificado
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                        {type.description}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={pendingPref.inAppEnabled}
                      onChange={() => handleToggle(type.key, 'inAppEnabled')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={pendingPref.emailEnabled}
                      onChange={() => handleToggle(type.key, 'emailEnabled')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={pendingPref.pushEnabled}
                      onChange={() => handleToggle(type.key, 'pushEnabled')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      {hasPendingChanges && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>Tienes cambios sin guardar</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
              Haz clic en "Guardar Cambios" para aplicar tus preferencias
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleDiscardChanges}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              disabled={isSaving}
            >
              Descartar
            </button>
            <button
              onClick={handleSaveChanges}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Saved Message */}
      {savedMessage && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: savedMessage.includes('✅') ? '#e8f5e9' : '#ffebee',
            color: savedMessage.includes('✅') ? '#2e7d32' : '#c62828',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {savedMessage}
        </div>
      )}

      {/* Info Footer */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.875rem',
        }}
      >
        <strong>ℹ️ Información:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>
            <strong>In-App:</strong> Notificaciones dentro de la plataforma (siempre recomendado)
          </li>
          <li>
            <strong>Email:</strong> Correos a tu cuenta registrada (útil para eventos importantes)
          </li>
          <li>
            <strong>Push:</strong> Notificaciones en tu dispositivo móvil o navegador (requiere
            registrar dispositivo)
          </li>
        </ul>
      </div>
    </div>
  );
};
