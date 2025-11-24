/**
 * RegisterPage Component
 * User registration/signup page
 *
 * Features:
 * - Centered card layout with branding
 * - RegisterForm component integration
 * - Link to login page
 * - Responsive mobile-first design
 * - Auto-redirect if already authenticated
 *
 * @example
 * ```tsx
 * // In App.tsx or router config
 * <Route path="/register" element={<RegisterPage />} />
 * ```
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import RegisterForm from '@/features/auth/components/RegisterForm';

/**
 * RegisterPage Component
 */
export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Únete a GAMILIT y comienza tu viaje de aprendizaje
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Register Form */}
          <RegisterForm
            redirectTo="/dashboard"
            showRoleSelection={false}
          />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Footer Links (Optional) */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <a
              href="/terms"
              className="hover:text-gray-700 focus:outline-none focus:underline"
            >
              Términos
            </a>
            <span>&bull;</span>
            <a
              href="/privacy"
              className="hover:text-gray-700 focus:outline-none focus:underline"
            >
              Privacidad
            </a>
            <span>&bull;</span>
            <a
              href="/help"
              className="hover:text-gray-700 focus:outline-none focus:underline"
            >
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
