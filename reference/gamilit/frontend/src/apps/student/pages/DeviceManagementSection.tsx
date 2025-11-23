/**
 * DeviceManagementSection
 *
 * Section component for managing push notification devices
 * Allows users to view, edit, and delete registered devices
 *
 * @version 1.0 (2025-01-13) - Initial implementation for FE-054
 */

import React, { useEffect, useState } from 'react';
import { useNotificationsStore } from '@/features/notifications/store/notificationsStore';

// Device type icons
const DEVICE_TYPE_ICONS: Record<string, string> = {
  ios: '📱',
  android: '🤖',
  web: '🌐',
};

// Device type labels
const DEVICE_TYPE_LABELS: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
};

export const DeviceManagementSection: React.FC = () => {
  const { devices, devicesLoading, fetchDevices, updateDeviceName, deleteDevice } =
    useNotificationsStore();

  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);

  // Load devices on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Start editing device name
  const handleStartEdit = (deviceId: string, currentName: string) => {
    setEditingDeviceId(deviceId);
    setEditedName(currentName || '');
    setMessage('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingDeviceId(null);
    setEditedName('');
  };

  // Save edited device name
  const handleSaveEdit = async (deviceId: string) => {
    if (!editedName.trim()) {
      setMessage('❌ El nombre no puede estar vacío');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      await updateDeviceName(deviceId, editedName.trim());
      setEditingDeviceId(null);
      setEditedName('');
      setMessage('✅ Nombre actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al actualizar el nombre');
      console.error('Error updating device name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete device
  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el dispositivo "${deviceName || 'Sin nombre'}"?\n\nDejarás de recibir notificaciones push en este dispositivo.`,
    );

    if (!confirmed) return;

    setIsDeleting(deviceId);
    setMessage('');

    try {
      await deleteDevice(deviceId);
      setMessage('✅ Dispositivo eliminado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al eliminar el dispositivo');
      console.error('Error deleting device:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Format last used date
  const formatLastUsed = (dateString?: string) => {
    if (!dateString) return 'Nunca usado';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (devicesLoading && devices.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando dispositivos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dispositivos Registrados</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Gestiona los dispositivos que pueden recibir notificaciones push
        </p>
      </div>

      {/* Devices List */}
      {devices.length === 0 ? (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h3>No tienes dispositivos registrados</h3>
          <p style={{ color: '#666', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Registra un dispositivo para recibir notificaciones push en tu móvil o navegador
          </p>
          <button
            onClick={() => setShowRegisterInfo(!showRegisterInfo)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            ¿Cómo registro un dispositivo?
          </button>

          {showRegisterInfo && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                textAlign: 'left',
              }}
            >
              <h4>📱 Registro de Dispositivos Push</h4>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                El registro de dispositivos para notificaciones push está en desarrollo. Esta
                funcionalidad estará disponible próximamente.
              </p>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                <strong>¿Qué son las notificaciones push?</strong>
                <br />
                Son notificaciones que recibes en tu dispositivo móvil o navegador, incluso cuando
                no estás usando la aplicación.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {devices.map((device) => {
            const isEditing = editingDeviceId === device.id;
            const isBeingDeleted = isDeleting === device.id;

            return (
              <div
                key={device.id}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  opacity: isBeingDeleted ? 0.5 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Device Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '2rem' }}>
                        {DEVICE_TYPE_ICONS[device.deviceType] || '📱'}
                      </span>
                      <div>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              placeholder="Nombre del dispositivo"
                              style={{
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                width: '250px',
                              }}
                              autoFocus
                              disabled={isUpdating}
                            />
                            <button
                              onClick={() => handleSaveEdit(device.id)}
                              disabled={isUpdating}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                              }}
                            >
                              {isUpdating ? '...' : 'Guardar'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#757575',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <strong style={{ fontSize: '1.125rem' }}>
                                {device.deviceName || 'Sin nombre'}
                              </strong>
                              {device.isActive && (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#4caf50',
                                    backgroundColor: '#e8f5e9',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                  }}
                                >
                                  Activo
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                              {DEVICE_TYPE_LABELS[device.deviceType] || device.deviceType}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <div style={{ marginLeft: '3rem', fontSize: '0.875rem', color: '#666' }}>
                        <div>
                          <strong>Último uso:</strong> {formatLastUsed(device.lastUsedAt)}
                        </div>
                        <div style={{ marginTop: '0.25rem' }}>
                          <strong>Registrado:</strong>{' '}
                          {new Date(device.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#999' }}>
                          Token: {device.deviceToken.substring(0, 20)}... (oculto por seguridad)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditing && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStartEdit(device.id, device.deviceName || '')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                        disabled={isBeingDeleted}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id, device.deviceName || '')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                        disabled={isBeingDeleted}
                      >
                        {isBeingDeleted ? '...' : '🗑️ Eliminar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register New Device Info */}
      {devices.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
          }}
        >
          <h4>📱 Registrar Nuevo Dispositivo</h4>
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
            El registro de dispositivos adicionales para notificaciones push está en desarrollo.
            Esta funcionalidad estará disponible próximamente.
          </p>
          <p style={{ marginTop: '0.75rem', color: '#666', fontSize: '0.875rem' }}>
            <strong>Nota:</strong> Las notificaciones push requieren que el servidor tenga
            configurado Firebase Cloud Messaging (FCM). Esta funcionalidad se completará en una fase
            posterior.
          </p>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: message.includes('✅') ? '#e8f5e9' : '#ffebee',
            color: message.includes('✅') ? '#2e7d32' : '#c62828',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {message}
        </div>
      )}

      {/* Info Footer */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          fontSize: '0.875rem',
        }}
      >
        <strong>ℹ️ Información sobre Dispositivos:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>
            Los dispositivos registrados pueden recibir notificaciones push incluso cuando no estás
            usando la aplicación
          </li>
          <li>
            Puedes editar el nombre de tus dispositivos para identificarlos fácilmente (ej: "iPhone
            de Juan", "Chrome en PC")
          </li>
          <li>Si pierdes un dispositivo o ya no lo usas, elimínalo de la lista por seguridad</li>
          <li>
            Los dispositivos inactivos por más de 90 días pueden ser desactivados automáticamente
          </li>
        </ul>
      </div>
    </div>
  );
};
