import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { InputDetective } from '@shared/components/base/InputDetective';
import { EmailInput } from '@features/auth/components/EmailInput';
import { PasswordInput } from '@features/auth/components/PasswordInput';
import { FormErrorDisplay } from '@features/auth/components/FormErrorDisplay';
import { registerSchema, RegisterFormData } from '@features/auth/schemas/authSchemas';
import { useAuthStore } from '@features/auth/store/authStore';
import { Target, UserPlus, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const watchedFullName = watch('fullName', '');
  const watchedEmail = watch('email', '');
  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError('');

    try {
      // Use real API via authStore instead of mockRegister
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: true
      });

      setRegistrationSuccess(true);
      // Auto-redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setServerError(error.message || 'Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar mensaje de éxito
  if (registrationSuccess) {
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
              Cuenta Creada
            </h2>
            <p className="text-detective-body text-detective-text-secondary mb-4">
              Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.
            </p>
            <p className="text-detective-sm text-detective-text-secondary">
              Redirigiendo a inicio de sesión...
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
          <p className="text-detective-text-secondary">
            Únete a la academia de detectives
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
            <InputDetective
              type="text"
              label="Nombre Completo"
              placeholder="Marie Curie"
              {...register('fullName')}
              value={watchedFullName}
              error={errors.fullName?.message}
              icon={<User className="w-5 h-5" />}
            />
          </div>

          <div className="mb-4">
            <EmailInput
              label="Email"
              placeholder="detective@glit.com"
              {...register('email')}
              value={watchedEmail}
              error={errors.email?.message}
              showValidation={true}
            />
          </div>

          <div className="mb-4">
            <PasswordInput
              label="Contraseña"
              placeholder="••••••••"
              {...register('password')}
              value={watchedPassword}
              error={errors.password?.message}
              showStrengthMeter={true}
              showCriteria={true}
            />
          </div>

          <div className="mb-4">
            <PasswordInput
              label="Confirmar Contraseña"
              placeholder="••••••••"
              {...register('confirmPassword')}
              value={watchedConfirmPassword}
              error={errors.confirmPassword?.message}
              showStrengthMeter={false}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="flex items-start gap-2 text-sm text-detective-text cursor-pointer">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="rounded border-amber-200 text-detective-orange focus:ring-detective-orange mt-0.5 flex-shrink-0"
              />
              <span>
                Acepto los{' '}
                <button
                  type="button"
                  className="text-detective-orange hover:text-detective-orange-dark underline"
                  onClick={() => window.open('/terms', '_blank')}
                >
                  términos y condiciones
                </button>
                {' '}y la{' '}
                <button
                  type="button"
                  className="text-detective-orange hover:text-detective-orange-dark underline"
                  onClick={() => window.open('/privacy', '_blank')}
                >
                  política de privacidad
                </button>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-detective-danger text-detective-sm mt-1">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <DetectiveButton
            type="submit"
            variant="primary"

            loading={loading}
            disabled={!isValid || loading}
            className="w-full"
            icon={<UserPlus className="w-5 h-5" />}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </DetectiveButton>

          <div className="mt-6 text-center">
            <p className="text-detective-text-secondary text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-detective-orange hover:text-detective-orange-dark font-semibold transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </DetectiveCard>
    </div>
  );
}
