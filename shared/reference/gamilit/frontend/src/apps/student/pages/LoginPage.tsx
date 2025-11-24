import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { EmailInput } from '@features/auth/components/EmailInput';
import { PasswordInput } from '@features/auth/components/PasswordInput';
import { FormErrorDisplay } from '@features/auth/components/FormErrorDisplay';
import { loginSchema, LoginFormData } from '@features/auth/schemas/authSchemas';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useAuthStore } from '@features/auth/store/authStore';
import { Lock, AlertTriangle, Wifi, WifiOff, Ban, Clock } from 'lucide-react';
import { AccountInactiveError, AccountSuspendedError } from '@services/api/apiErrorHandler';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const [serverError, setServerError] = useState<string>('');
  const [accountStatusError, setAccountStatusError] = useState<{
    type: 'inactive' | 'suspended' | null;
    message: string;
    suspensionDetails?: {
      isPermanent: boolean;
      suspendedUntil?: string;
      reason?: string;
    };
  }>({ type: null, message: '' });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const watchedEmail = watch('email', '');
  const watchedPassword = watch('password', '');

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    setAccountStatusError({ type: null, message: '' });

    try {
      // CRITICAL: Clear logout flag if present (user is now logging in)
      localStorage.removeItem('is_logging_out');

      // Use real authentication
      await login(data.email, data.password);

      // Login exitoso - Get user from store after successful login
      console.log('Login exitoso');

      // Get user from the auth store (now it should be populated)
      const { user: loggedInUser } = useAuthStore.getState();

      // Get user role from the store
      const userRole = loggedInUser?.role || 'student';

      console.log('🔍 Login exitoso - User role:', userRole);
      console.log('🔍 User object:', loggedInUser);

      // Redirect based on role (roles from database: 'student', 'admin_teacher', 'super_admin')
      switch (userRole) {
        case 'admin_teacher':
        case 'teacher': // Also handle 'teacher' as alias
          console.log('➡️ Redirigiendo a Teacher Dashboard');
          navigate('/teacher/dashboard');
          break;
        case 'super_admin':
        case 'admin': // Also handle 'admin' as alias
          console.log('➡️ Redirigiendo a Admin Dashboard');
          navigate('/admin/dashboard');
          break;
        case 'student':
        default:
          console.log('➡️ Redirigiendo a Student Dashboard');
          navigate('/dashboard');
          break;
      }
    } catch (error: any) {
      // Check for specific account status errors
      if (error instanceof AccountInactiveError) {
        setAccountStatusError({
          type: 'inactive',
          message: error.message || 'Tu cuenta ha sido desactivada. Por favor, contacta a tu maestro.'
        });
        return; // Don't count as failed login attempt
      }

      if (error instanceof AccountSuspendedError) {
        setAccountStatusError({
          type: 'suspended',
          message: error.message || 'Tu cuenta ha sido suspendida.',
          suspensionDetails: error.suspensionDetails
        });
        return; // Don't count as failed login attempt
      }

      // Login fallido - other errors
      const errorMessage = error?.message || authError || 'Error de autenticación';
      setServerError(errorMessage);

      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      // Mostrar CAPTCHA después de 3 intentos fallidos
      if (newAttempts >= 3) {
        setShowCaptcha(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4 relative">
      {/* Connection Status Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg ${
          isOnline ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-700 border-2 border-red-200'
        }`}>
          {isOnline ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Wifi className="w-4 h-4" />
              <span>Conectado</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <WifiOff className="w-4 h-4" />
              <span>Sin conexión</span>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Login Card with enhanced shadow */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-4"
            >
              <span className="text-5xl">🕵️‍♂️</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2 relative"
            >
              GAMILIT Detective Platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-orange-100 relative"
            >
              Resuelve misterios mientras aprendes
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Account Inactive Error */}
            {accountStatusError.type === 'inactive' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Ban className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Cuenta Desactivada
                    </h3>
                    <p className="text-sm text-amber-800 mb-2">
                      {accountStatusError.message}
                    </p>
                    <p className="text-xs text-amber-700">
                      Si crees que esto es un error, contacta a tu maestro o al administrador del sistema.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Account Suspended Error */}
            {accountStatusError.type === 'suspended' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">
                      {accountStatusError.suspensionDetails?.isPermanent
                        ? 'Cuenta Suspendida Permanentemente'
                        : 'Cuenta Suspendida Temporalmente'}
                    </h3>
                    {accountStatusError.suspensionDetails?.suspendedUntil && (
                      <p className="text-sm text-red-800 mb-1">
                        Suspendida hasta:{' '}
                        <strong>
                          {new Date(accountStatusError.suspensionDetails.suspendedUntil).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </strong>
                      </p>
                    )}
                    {accountStatusError.suspensionDetails?.reason && (
                      <p className="text-sm text-red-800 mb-2">
                        <strong>Razón:</strong> {accountStatusError.suspensionDetails.reason}
                      </p>
                    )}
                    <p className="text-xs text-red-700">
                      {accountStatusError.suspensionDetails?.isPermanent
                        ? 'Para más información, contacta al soporte técnico.'
                        : 'Podrás acceder a tu cuenta una vez que finalice el período de suspensión.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rate Limiting Warning */}
            {failedAttempts > 0 && failedAttempts < 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-detective-sm text-amber-700">
                  {3 - failedAttempts} {failedAttempts === 2 ? 'intento' : 'intentos'} restantes antes del bloqueo temporal
                </p>
              </motion.div>
            )}

            {/* Server Errors */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FormErrorDisplay
                  errors={[serverError]}
                  onDismiss={() => setServerError('')}
                />
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-4"
              >
                <EmailInput
                  label="Email"
                  placeholder="detective@gamilit.com"
                  {...register('email')}
                  value={watchedEmail}
                  error={errors.email?.message}
                  showValidation={true}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-4"
              >
                <PasswordInput
                  label="Contraseña"
                  placeholder="••••••••"
                  {...register('password')}
                  value={watchedPassword}
                  error={errors.password?.message}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mb-6"
              >
                <label className="flex items-center gap-2 text-sm text-detective-text cursor-pointer hover:text-detective-orange transition-colors">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="rounded border-amber-200 text-detective-orange focus:ring-2 focus:ring-detective-orange"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/password-recovery')}
                  className="text-sm text-detective-orange hover:text-detective-orange-dark font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </motion.div>

              {/* CAPTCHA Placeholder */}
              {showCaptcha && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6 text-center"
                >
                  <p className="text-detective-sm text-detective-text-secondary">
                    [CAPTCHA Placeholder - Integrar en producción]
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <DetectiveButton
                  type="submit"
                  variant="primary"

                  loading={authLoading}
                  disabled={!isValid || authLoading}
                  className="w-full shadow-lg hover:shadow-xl transition-shadow"
                  icon={<Lock className="w-5 h-5" />}
                >
                  {authLoading ? 'Verificando...' : 'Iniciar Sesión'}
                </DetectiveButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-detective-text-secondary text-sm">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-detective-orange hover:text-detective-orange-dark font-semibold transition-colors"
                  >
                    Únete al equipo
                  </button>
                </p>
              </motion.div>
            </form>

            {/* Test Credentials Helper (solo desarrollo) */}
            {import.meta.env.DEV && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3"
              >
                <p className="text-detective-sm text-blue-800 font-semibold mb-2">
                  🔑 Credenciales de prueba (Backend real):
                </p>
                <div className="space-y-2 text-detective-xs text-blue-700">
                  <div className="bg-white/60 p-2 rounded">
                    <strong>👨‍🎓 Alumno:</strong><br />
                    Email: student@gamilit.com<br />
                    Password: Test1234
                  </div>
                  <div className="bg-white/60 p-2 rounded">
                    <strong>👩‍🏫 Maestro:</strong><br />
                    Email: teacher@gamilit.com<br />
                    Password: Test1234
                  </div>
                  <div className="bg-white/60 p-2 rounded">
                    <strong>🔐 Admin:</strong><br />
                    Email: admin@gamilit.com<br />
                    Password: Test1234
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-gray-600 text-sm mt-6"
        >
          © 2025 Gamilit Platform. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
