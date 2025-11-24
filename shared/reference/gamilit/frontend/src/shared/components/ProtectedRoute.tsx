import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wrapper component that protects routes from unauthorized access
 *
 * Features:
 * - Blocks access for unauthenticated users
 * - Supports role-based access control (RBAC)
 * - Shows loading state while checking authentication
 * - Preserves intended destination for post-login redirect
 * - Redirects to login or unauthorized page as needed
 *
 * @param children - The protected content to render
 * @param allowedRoles - Optional array of roles that can access this route
 * @param redirectTo - Custom redirect path for unauthenticated users (default: '/login')
 *
 * @example
 * Basic protection (requires authentication):
 * ```tsx
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 * ```
 *
 * @example
 * Role-based protection:
 * ```tsx
 * <Route path="/admin" element={
 *   <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
 *     <AdminPanel />
 *   </ProtectedRoute>
 * } />
 * ```
 *
 * @example
 * With custom redirect:
 * ```tsx
 * <Route path="/premium" element={
 *   <ProtectedRoute redirectTo="/subscribe">
 *     <PremiumContent />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Preserve the intended destination in state for post-login redirect
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access control if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user?.role || '');

    if (!hasRequiredRole) {
      // User is authenticated but doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

/**
 * Unauthorized Page Component
 * Default page shown when user doesn't have required permissions
 *
 * @example
 * Add to your routes:
 * ```tsx
 * <Route path="/unauthorized" element={<UnauthorizedPage />} />
 * ```
 */
export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-4">403</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you
          believe this is an error.
        </p>
        <div className="space-x-4">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Go to Home
          </a>
          <a
            href="/dashboard"
            className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
