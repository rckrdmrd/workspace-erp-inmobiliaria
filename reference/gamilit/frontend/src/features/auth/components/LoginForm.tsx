/**
 * LoginForm Component - Detective Theme
 * Provides user authentication form with validation and detective theme styling
 *
 * Features:
 * - Email and password inputs with validation
 * - Show/hide password toggle
 * - Remember me checkbox (optional)
 * - Forgot password link
 * - Form error handling from AuthContext
 * - Loading states with disabled submit
 * - Auto-redirect to dashboard on success
 * - Accessible form with ARIA labels
 * - Detective orange theme colors
 *
 * @requires react-hook-form, zod, @hookform/resolvers
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { loginSchema, type LoginFormData } from '@/shared/schemas/auth.schemas';
import { getRoleBasedRedirect } from '@/shared/utils/roleRedirect';

interface LoginFormProps {
  /**
   * Callback fired after successful login (optional)
   */
  onSuccess?: () => void;

  /**
   * Custom redirect path after login (default: '/dashboard')
   */
  redirectTo?: string;

  /**
   * Show "Remember Me" checkbox (default: true)
   */
  showRememberMe?: boolean;

  /**
   * Show "Forgot Password" link (default: true)
   */
  showForgotPassword?: boolean;
}

/**
 * LoginForm Component
 *
 * @example
 * ```tsx
 * <LoginForm
 *   redirectTo="/dashboard"
 *   onSuccess={() => console.log('Login successful')}
 * />
 * ```
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard',
  showRememberMe = true,
  showForgotPassword = true,
}) => {
  const navigate = useNavigate();
  const { login, error: authError, clearError, isAuthenticated, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    // CRITICAL: Don't redirect if user just logged out
    const isLoggingOut = localStorage.getItem('is_logging_out');
    if (isLoggingOut === 'true') {
      console.log('⚠️ [LoginForm] is_logging_out flag detected - skipping auto-redirect');
      return;
    }

    if (isAuthenticated && user) {
      // Use role-based redirect instead of hardcoded redirectTo
      const targetRoute = getRoleBasedRedirect(user.role);
      console.log('✅ [LoginForm] User authenticated - role:', user.role, '- redirecting to:', targetRoute);
      navigate(targetRoute);
    }
  }, [isAuthenticated, user, navigate]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();

      // CRITICAL: Clear logout flag if present (user is now logging in)
      localStorage.removeItem('is_logging_out');

      // Save "remember me" preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Attempt login
      await login(data);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to role-based dashboard
      // Note: The useEffect will also handle redirect, but we do it here for immediate navigation
      if (user) {
        const targetRoute = getRoleBasedRedirect(user.role);
        console.log('✅ [LoginForm] Login successful - redirecting to:', targetRoute);
        navigate(targetRoute);
      }
    } catch (err: any) {
      // Error is already set in AuthContext
      // Optionally set form-level error
      setError('root', {
        message: err.message || 'Login failed. Please try again.',
      });
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Global Error Alert */}
      {(authError || errors.root) && (
        <div
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {authError || errors.root?.message}
            </p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            transition-colors duration-200
            ${
              errors.email
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }
          `}
          placeholder="tu@correo.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`
              w-full px-4 py-3 pr-12 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              transition-colors duration-200
              ${
                errors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="Ingresa tu contraseña"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
            {...register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        {showRememberMe && (
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
              disabled={isSubmitting}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              Recordarme
            </label>
          </div>
        )}

        {showForgotPassword && (
          <a
            href="/forgot-password"
            className="text-sm font-medium text-orange-600 hover:text-orange-700 focus:outline-none focus:underline"
            tabIndex={isSubmitting ? -1 : 0}
          >
            ¿Olvidaste tu contraseña?
          </a>
        )}
      </div>

      {/* Submit Button - Detective Theme */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full flex items-center justify-center gap-2
          px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg
          hover:from-orange-700 hover:to-orange-800
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-all duration-200
          shadow-md hover:shadow-lg
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar Sesión</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
