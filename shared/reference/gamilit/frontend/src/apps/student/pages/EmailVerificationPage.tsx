/**
 * DEPRECATED: EmailVerificationPage
 *
 * This page is deprecated as email verification is no longer required.
 * All user accounts are now automatically verified upon registration.
 *
 * This page is kept for backward compatibility with old email links
 * and displays an informational message to users.
 *
 * @deprecated Since 2025-10 - Email verification disabled
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { Target, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailVerificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
      <DetectiveCard className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-12 h-12 text-detective-orange" />
            <h1 className="text-4xl font-bold text-detective-orange">GAMILIT</h1>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle2 className="w-16 h-16 text-detective-success mx-auto mb-4" />

          <h2 className="text-detective-title text-detective-text mb-4">
            Verificación No Requerida
          </h2>

          <p className="text-detective-body text-detective-text-secondary mb-6">
            La verificación de email ya no es necesaria. Todas las cuentas están automáticamente verificadas.
          </p>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-detective-sm text-blue-700 text-left">
              Puedes iniciar sesión directamente con tu cuenta. Ya no es necesario verificar tu email.
            </p>
          </div>

          <DetectiveButton
            variant="primary"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Ir al Login
          </DetectiveButton>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 text-detective-text-secondary hover:text-detective-text transition-colors"
          >
            Ir al Dashboard
          </button>
        </motion.div>
      </DetectiveCard>
    </div>
  );
}

/*
 * LEGACY CODE (Preserved for reference - can be removed in future cleanup)
 * -----------------------------------------------------------------------
 *
 * Previous implementation included:
 * - Token-based email verification
 * - Resend verification email functionality
 * - Error handling for verification failures
 *
 * This functionality is no longer needed as:
 * 1. Users are automatically verified on registration
 * 2. Backend endpoints are deprecated
 * 3. Email verification flow is disabled
 */
