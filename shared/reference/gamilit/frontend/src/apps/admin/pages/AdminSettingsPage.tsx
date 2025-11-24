import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useSettings, type SettingsCategory } from '../hooks/useSettings';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Wrench,
  Save,
  AlertTriangle,
  Database,
  Image,
} from 'lucide-react';

/**
 * AdminSettingsPage - Configuración general del sistema
 * Updated: 2025-11-19 - Integrated with useSettings hook (FE-059)
 */
export default function AdminSettingsPage() {
  const { user, logout } = useAuth();

  // Use useSettings hook
  const {
    settings,
    activeSection,
    loading,
    saving,
    error,
    successMessage,
    setActiveSection,
    fetchSettings,
    updateSettings,
    sendTestEmail,
    enableMaintenanceMode,
    createBackup,
    clearCache,
  } = useSettings();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fallback gamification data in case hook fails or user is not loaded
  const displayGamificationData = gamificationData || {
    userId: user?.id || 'mock-admin-id',
    level: 1,
    totalXP: 0,
    mlCoins: 0,
    rank: 'Novato',
    achievements: [],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Fetch settings when section changes
  useEffect(() => {
    fetchSettings(activeSection);
  }, [activeSection, fetchSettings]);

  return (
    <AdminLayout
      user={user || undefined}
      gamificationData={displayGamificationData}
      organizationName="GAMILIT Platform Admin"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-detective-text flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-500" />
            Configuración del Sistema
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Administra la configuración global de la plataforma
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <DetectiveCard>
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-500">
              <p className="font-semibold">✓ Éxito</p>
              <p>{successMessage}</p>
            </div>
          </DetectiveCard>
        )}

        {/* Error Message */}
        {error && (
          <DetectiveCard>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-500">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          </DetectiveCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Menu */}
          <div className="lg:col-span-1">
            <DetectiveCard>
              <h2 className="text-lg font-bold text-detective-text mb-4">Secciones</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('general')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'general'
                      ? 'bg-detective-orange text-white'
                      : 'text-detective-text hover:bg-detective-bg-secondary'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>General</span>
                </button>
                <button
                  onClick={() => setActiveSection('email')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'email'
                      ? 'bg-detective-orange text-white'
                      : 'text-detective-text hover:bg-detective-bg-secondary'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email (SMTP)</span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'notifications'
                      ? 'bg-detective-orange text-white'
                      : 'text-detective-text hover:bg-detective-bg-secondary'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                </button>
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'security'
                      ? 'bg-detective-orange text-white'
                      : 'text-detective-text hover:bg-detective-bg-secondary'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Seguridad</span>
                </button>
                <button
                  onClick={() => setActiveSection('maintenance')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'maintenance'
                      ? 'bg-detective-orange text-white'
                      : 'text-detective-text hover:bg-detective-bg-secondary'
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Mantenimiento</span>
                </button>
              </nav>
            </DetectiveCard>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeSection === 'general' && (
              <DetectiveCard>
                <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  Configuración General
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-detective-orange"></div>
                    <p className="mt-2 text-detective-text-secondary">Cargando configuración...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Nombre de la Plataforma
                      </label>
                      <input
                        type="text"
                        value={settings.general?.platformName || ''}
                        onChange={(e) => updateSettings('general', {
                          ...settings.general,
                          platformName: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        URL de la Plataforma
                      </label>
                      <input
                        type="url"
                        value={settings.general?.platformUrl || ''}
                        onChange={(e) => updateSettings('general', {
                          ...settings.general,
                          platformUrl: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Logo de la Plataforma
                      </label>
                      <div className="flex items-center gap-4">
                        <img
                          src={settings.general?.logoUrl || '/logo_gamilit.png'}
                          alt="Logo"
                          className="w-16 h-16 rounded-lg border border-gray-600"
                        />
                        <DetectiveButton variant="outline" size="sm" disabled={saving}>
                          <Image className="w-4 h-4" />
                          Cambiar Logo
                        </DetectiveButton>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Idioma por Defecto
                      </label>
                      <select
                        value={settings.general?.defaultLanguage || 'es'}
                        onChange={(e) => updateSettings('general', {
                          ...settings.general,
                          defaultLanguage: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Zona Horaria
                      </label>
                      <select
                        value={settings.general?.timezone || 'America/Mexico_City'}
                        onChange={(e) => updateSettings('general', {
                          ...settings.general,
                          timezone: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      >
                        <option value="America/Mexico_City">América/Ciudad de México (UTC-6)</option>
                        <option value="America/New_York">América/Nueva York (UTC-5)</option>
                        <option value="America/Los_Angeles">América/Los Ángeles (UTC-8)</option>
                      </select>
                    </div>
                    <DetectiveButton
                      variant="primary"
                      onClick={() => updateSettings('general', settings.general!)}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </DetectiveButton>
                  </div>
                )}
              </DetectiveCard>
            )}

            {/* Email Settings */}
            {activeSection === 'email' && (
              <DetectiveCard>
                <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Configuración de Email (SMTP)
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-detective-orange"></div>
                    <p className="mt-2 text-detective-text-secondary">Cargando configuración...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-detective-text mb-2">
                          Servidor SMTP
                        </label>
                        <input
                          type="text"
                          value={settings.email?.smtpServer || ''}
                          onChange={(e) => updateSettings('email', {
                            ...settings.email,
                            smtpServer: e.target.value
                          })}
                          className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-detective-text mb-2">
                          Puerto
                        </label>
                        <input
                          type="number"
                          value={settings.email?.smtpPort || 587}
                          onChange={(e) => updateSettings('email', {
                            ...settings.email,
                            smtpPort: parseInt(e.target.value)
                          })}
                          className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Usuario SMTP
                      </label>
                      <input
                        type="email"
                        value={settings.email?.smtpUser || ''}
                        onChange={(e) => updateSettings('email', {
                          ...settings.email,
                          smtpUser: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Contraseña SMTP
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => updateSettings('email', {
                          ...settings.email,
                          smtpPassword: e.target.value
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="use-tls"
                        checked={settings.email?.useTLS ?? true}
                        onChange={(e) => updateSettings('email', {
                          ...settings.email,
                          useTLS: e.target.checked
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-detective-bg-secondary"
                      />
                      <label htmlFor="use-tls" className="text-sm text-detective-text">
                        Usar TLS/SSL
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <DetectiveButton
                        variant="primary"
                        onClick={() => updateSettings('email', settings.email!)}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                          </>
                        )}
                      </DetectiveButton>
                      <DetectiveButton
                        variant="outline"
                        onClick={sendTestEmail}
                        disabled={saving}
                      >
                        <Mail className="w-5 h-5" />
                        Enviar Email de Prueba
                      </DetectiveButton>
                    </div>
                  </div>
                )}
              </DetectiveCard>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <DetectiveCard>
                <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  Configuración de Notificaciones
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-detective-orange"></div>
                    <p className="mt-2 text-detective-text-secondary">Cargando configuración...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-detective-text">Notificaciones por Email</h3>
                          <p className="text-sm text-detective-text-secondary">
                            Enviar notificaciones importantes por email
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.emailNotifications ?? true}
                          onChange={(e) => updateSettings('notifications', {
                            ...settings.notifications,
                            emailNotifications: e.target.checked
                          })}
                          className="w-6 h-6 rounded border-gray-600 bg-detective-bg"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-detective-text">Notificaciones Push</h3>
                          <p className="text-sm text-detective-text-secondary">
                            Enviar notificaciones push a dispositivos móviles
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.pushNotifications ?? true}
                          onChange={(e) => updateSettings('notifications', {
                            ...settings.notifications,
                            pushNotifications: e.target.checked
                          })}
                          className="w-6 h-6 rounded border-gray-600 bg-detective-bg"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-detective-text">Notificaciones de Sistema</h3>
                          <p className="text-sm text-detective-text-secondary">
                            Alertas sobre el estado del sistema
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications?.systemNotifications ?? true}
                          onChange={(e) => updateSettings('notifications', {
                            ...settings.notifications,
                            systemNotifications: e.target.checked
                          })}
                          className="w-6 h-6 rounded border-gray-600 bg-detective-bg"
                        />
                      </div>
                    </div>
                    <DetectiveButton
                      variant="primary"
                      onClick={() => updateSettings('notifications', settings.notifications!)}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </DetectiveButton>
                  </div>
                )}
              </DetectiveCard>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <DetectiveCard>
                <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Configuración de Seguridad
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-detective-orange"></div>
                    <p className="mt-2 text-detective-text-secondary">Cargando configuración...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Duración de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        value={settings.security?.sessionDuration || 60}
                        onChange={(e) => updateSettings('security', {
                          ...settings.security,
                          sessionDuration: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Intentos de Login Máximos
                      </label>
                      <input
                        type="number"
                        value={settings.security?.maxLoginAttempts || 5}
                        onChange={(e) => updateSettings('security', {
                          ...settings.security,
                          maxLoginAttempts: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                      />
                    </div>
                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-detective-text">Autenticación de Dos Factores (2FA)</h3>
                          <p className="text-sm text-detective-text-secondary">
                            Requerir 2FA para todos los administradores
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.security?.require2FA ?? true}
                          onChange={(e) => updateSettings('security', {
                            ...settings.security,
                            require2FA: e.target.checked
                          })}
                          className="w-6 h-6 rounded border-gray-600 bg-detective-bg"
                        />
                      </div>
                    </div>
                    <DetectiveButton
                      variant="primary"
                      onClick={() => updateSettings('security', settings.security!)}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </DetectiveButton>
                  </div>
                )}
              </DetectiveCard>
            )}

            {/* Maintenance Settings */}
            {activeSection === 'maintenance' && (
              <DetectiveCard>
                <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
                  <Wrench className="w-6 h-6" />
                  Mantenimiento del Sistema
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-detective-orange"></div>
                    <p className="mt-2 text-detective-text-secondary">Cargando configuración...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-bold text-yellow-400 mb-2">Modo Mantenimiento</h3>
                          <p className="text-sm text-detective-text-secondary mb-3">
                            Activar el modo mantenimiento deshabilitará el acceso para todos los usuarios excepto administradores.
                          </p>
                          <p className="text-sm text-detective-text mb-3">
                            Estado actual: {' '}
                            <span className={settings.maintenance?.maintenanceMode ? 'text-yellow-400 font-bold' : 'text-green-400 font-bold'}>
                              {settings.maintenance?.maintenanceMode ? 'Activo' : 'Inactivo'}
                            </span>
                          </p>
                          <DetectiveButton
                            variant="outline"
                            size="sm"
                            onClick={enableMaintenanceMode}
                            disabled={saving || settings.maintenance?.maintenanceMode}
                          >
                            {saving ? 'Procesando...' : 'Activar Modo Mantenimiento'}
                          </DetectiveButton>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <h3 className="font-bold text-detective-text mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Respaldo de Base de Datos
                      </h3>
                      <p className="text-sm text-detective-text-secondary mb-3">
                        Último respaldo: {' '}
                        {settings.maintenance?.lastBackup
                          ? new Date(settings.maintenance.lastBackup).toLocaleString('es-ES')
                          : 'Nunca'}
                      </p>
                      <DetectiveButton
                        variant="outline"
                        size="sm"
                        onClick={createBackup}
                        disabled={saving}
                      >
                        {saving ? 'Creando respaldo...' : 'Crear Respaldo Ahora'}
                      </DetectiveButton>
                    </div>

                    <div className="p-4 bg-detective-bg-secondary rounded-lg">
                      <h3 className="font-bold text-detective-text mb-3">Limpiar Caché</h3>
                      <p className="text-sm text-detective-text-secondary mb-3">
                        Limpia la caché del sistema para mejorar el rendimiento
                      </p>
                      <DetectiveButton
                        variant="outline"
                        size="sm"
                        onClick={clearCache}
                        disabled={saving}
                      >
                        {saving ? 'Limpiando caché...' : 'Limpiar Caché'}
                      </DetectiveButton>
                    </div>
                  </div>
                )}
              </DetectiveCard>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
