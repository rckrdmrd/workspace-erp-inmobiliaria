import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FormErrorDisplay } from '@features/auth/components/FormErrorDisplay';
import { twoFactorSchema, TwoFactorFormData } from '@features/auth/schemas/authSchemas';
import { mockTwoFactorVerification, mockResendVerificationCode } from '@features/auth/mocks/authMocks';
import { Target, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TwoFactorAuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    mode: 'onChange'
  });

  // Focus en el primer input al cargar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Actualizar valor del formulario
    const fullCode = newCode.join('');
    setValue('code', fullCode, { shouldValidate: true });

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Si el campo está vacío y presiona backspace, ir al anterior
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setCode(newCode);
      setValue('code', pastedData, { shouldValidate: true });

      // Focus en el último dígito ingresado o en el siguiente vacío
      const nextEmptyIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const onSubmit = async (data: TwoFactorFormData) => {
    setLoading(true);
    setServerError('');

    try {
      const response = await mockTwoFactorVerification(data.code);

      if (response.success) {
        // 2FA exitoso, redirigir al dashboard
        navigate('/dashboard');
      } else {
        setServerError(response.error || 'Código inválido');
        // Limpiar código en error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendSuccess(false);

    try {
      const response = await mockResendVerificationCode();
      if (response.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error al reenviar código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
      <DetectiveCard className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-12 h-12 text-detective-orange" />
            <h1 className="text-4xl font-bold text-detective-orange">GAMILIT</h1>
          </div>
          <div className="flex items-center justify-center mb-3">
            <Shield className="w-8 h-8 text-detective-blue" />
          </div>
          <h2 className="text-detective-subtitle text-detective-text mb-2">
            Verificación de Dos Factores
          </h2>
          <p className="text-detective-text-secondary">
            Ingresa el código de 6 dígitos enviado a tu dispositivo
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-detective-sm text-blue-700 text-center">
            Esta es una implementación mock. En producción, el código será enviado a tu dispositivo autenticador.
          </p>
          <p className="text-detective-sm text-blue-800 font-semibold text-center mt-2">
            Código de prueba: 123456
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Código 2FA - 6 inputs */}
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-2">
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-detective-orange focus:border-detective-orange transition-all bg-white"
                  whileFocus={{ scale: 1.05 }}
                />
              ))}
            </div>
            {errors.code && (
              <p className="text-detective-danger text-detective-sm text-center mt-2">
                {errors.code.message}
              </p>
            )}
          </div>

          <DetectiveButton
            type="submit"
            variant="primary"

            loading={loading}
            disabled={!isValid || loading}
            className="w-full mb-4"
            icon={<Shield className="w-5 h-5" />}
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </DetectiveButton>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-detective-text-secondary text-sm mb-2">
              ¿No recibiste el código?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-detective-orange hover:text-detective-orange-dark font-semibold transition-colors inline-flex items-center gap-2"
            >
              {resendLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reenviar código
                </>
              )}
            </button>
          </div>

          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-detective-sm text-detective-success text-center">
                Código reenviado exitosamente
              </p>
            </motion.div>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-detective-text-secondary hover:text-detective-text transition-colors text-sm"
            >
              Volver al login
            </button>
          </div>
        </form>
      </DetectiveCard>
    </div>
  );
}
