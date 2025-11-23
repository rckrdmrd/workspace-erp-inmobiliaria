import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { PasswordInput } from '@features/auth/components/PasswordInput';
import { FormErrorDisplay } from '@features/auth/components/FormErrorDisplay';
import { passwordResetSchema, PasswordResetFormData } from '@features/auth/schemas/authSchemas';
import { mockPasswordReset } from '@features/auth/mocks/authMocks';
import { Target, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: 'onChange'
  });

  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');

  // Verificar token al cargar
  useEffect(() => {
    if (!token || token.length < 10) {
      setTokenValid(false);
    }
  }, [token]);

  const onSubmit = async (data: PasswordResetFormData) => {
    if (!token) {
      setServerError('Token inválido');
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await mockPasswordReset(token, data.password);

      if (response.success) {
        setResetSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setServerError(response.error || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Token inválido
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
        <DetectiveCard className="max-w-md w-full">
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-detective-danger mx-auto mb-4" />
            <h2 className="text-detective-title text-detective-danger mb-3">
              Token Inválido
            </h2>
            <p className="text-detective-body text-detective-text-secondary mb-6">
              El enlace de recuperación es inválido o ha expirado.
            </p>
            <DetectiveButton
              variant="primary"
              onClick={() => navigate('/password-recovery')}
            >
              Solicitar Nuevo Enlace
            </DetectiveButton>
          </div>
        </DetectiveCard>
      </div>
    );
  }

  // Reset exitoso
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
        <DetectiveCard className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="w-16 h-16 text-detective-success mx-auto mb-4" />
            <h2 className="text-detective-title text-detective-success mb-3">
              Contraseña Actualizada
            </h2>
            <p className="text-detective-body text-detective-text-secondary mb-4">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
            <p className="text-detective-sm text-detective-text-secondary">
              Redirigiendo al login...
            </p>
          </motion.div>
        </DetectiveCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
      <DetectiveCard className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-12 h-12 text-detective-orange" />
            <h1 className="text-4xl font-bold text-detective-orange">GAMILIT</h1>
          </div>
          <h2 className="text-detective-subtitle text-detective-text mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-detective-text-secondary">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Server Errors */}
        {serverError && (
          <FormErrorDisplay
            errors={[serverError]}
            onDismiss={() => setServerError('')}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <PasswordInput
              label="Nueva Contraseña"
              placeholder="••••••••"
              {...register('password')}
              value={watchedPassword}
              error={errors.password?.message}
              showStrengthMeter={true}
              showCriteria={true}
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="Confirmar Nueva Contraseña"
              placeholder="••••••••"
              {...register('confirmPassword')}
              value={watchedConfirmPassword}
              error={errors.confirmPassword?.message}
              showStrengthMeter={false}
            />
          </div>

          <DetectiveButton
            type="submit"
            variant="primary"

            loading={loading}
            disabled={!isValid || loading}
            className="w-full"
            icon={<Lock className="w-5 h-5" />}
          >
            {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
          </DetectiveButton>
        </form>
      </DetectiveCard>
    </div>
  );
}
