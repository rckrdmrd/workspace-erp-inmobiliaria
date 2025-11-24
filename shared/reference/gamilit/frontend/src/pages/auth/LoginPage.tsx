/**
 * LoginPage Component - Detective Theme
 * Authentication page for user login with detective theme styling
 *
 * Features:
 * - Detective-themed gradient background (orange tones)
 * - Detective emoji and branding
 * - LoginForm component integration
 * - Responsive mobile-first design
 * - Framer Motion animations
 *
 * @example
 * ```tsx
 * <Route path="/login" element={<LoginPage />} />
 * ```
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/features/auth/components/LoginForm';

/**
 * LoginPage Component
 */
export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Detective Theme */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-center relative overflow-hidden">
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

            {/* Detective Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-4"
            >
              <span className="text-5xl">🕵️‍♂️</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2 relative"
            >
              GAMILIT Detective Platform
            </motion.h1>

            {/* Subtitle */}
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
            <LoginForm
              redirectTo="/dashboard"
              showRememberMe={true}
              showForgotPassword={true}
            />
          </div>
        </div>

        {/* Registration Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-700">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-orange-600 hover:text-orange-700 focus:outline-none focus:underline transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <a
              href="/terms"
              className="hover:text-orange-600 focus:outline-none focus:underline transition-colors"
            >
              Términos
            </a>
            <span>&bull;</span>
            <a
              href="/privacy"
              className="hover:text-orange-600 focus:outline-none focus:underline transition-colors"
            >
              Privacidad
            </a>
            <span>&bull;</span>
            <a
              href="/help"
              className="hover:text-orange-600 focus:outline-none focus:underline transition-colors"
            >
              Ayuda
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
