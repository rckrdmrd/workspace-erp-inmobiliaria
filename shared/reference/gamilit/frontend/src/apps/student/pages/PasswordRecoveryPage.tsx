import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { EmailInput } from '@features/auth/components/EmailInput';
import { FormErrorDisplay } from '@features/auth/components/FormErrorDisplay';
import { passwordRecoverySchema, PasswordRecoveryFormData } from '@features/auth/schemas/authSchemas';
import { mockPasswordRecovery } from '@features/auth/mocks/authMocks';
import { Target, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PasswordRecoveryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
    mode: 'onChange'
  });

  const watchedEmail = watch('email', '');

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    setLoading(true);
    setServerError('');

    try {
      const response = await mockPasswordRecovery(data.email);

      if (response.success) {
        setEmailSent(true);
      } else {
        setServerError(response.error || 'Error al enviar el email');
      }
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar mensaje de éxito
  if (emailSent) {
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
              Email Enviado
            </h2>
            <p className="text-detective-body text-detective-text-secondary mb-6">
              Si el email existe en nuestro sistema, recibirás un enlace de recuperación en breve.
            </p>
            <p className="text-detective-sm text-detective-text-secondary mb-6">
              Revisa tu bandeja de entrada y la carpeta de spam.
            </p>
            <DetectiveButton
              variant="primary"
              onClick={() => navigate('/login')}
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Volver al Login
            </DetectiveButton>
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
            Recuperar Contraseña
          </h2>
          <p className="text-detective-text-secondary">
            Ingresa tu email y te enviaremos un enlace de recuperación
          </p>
        </div>

        {/* Server Errors */}
        {serverError && (
          <FormErrorDisplay
            errors={[serverError]}
            onDismiss={() => setServerError('')}
          />
        )}

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-detective-sm text-blue-700">
            El enlace de recuperación será válido por 15 minutos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-6">
            <EmailInput
              label="Email"
              placeholder="detective@glit.com"
              {...register('email')}
              value={watchedEmail}
              error={errors.email?.message}
              showValidation={true}
            />
          </div>

          <DetectiveButton
            type="submit"
            variant="primary"

            loading={loading}
            disabled={!isValid || loading}
            className="w-full mb-4"
            icon={<Mail className="w-5 h-5" />}
          >
            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </DetectiveButton>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-detective-text-secondary hover:text-detective-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </button>
        </form>
      </DetectiveCard>
    </div>
  );
}
