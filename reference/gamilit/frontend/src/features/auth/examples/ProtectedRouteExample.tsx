/**
 * Example: Protected Route Component
 * This demonstrates how to protect routes based on authentication and permissions
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { useRole } from '../hooks/useRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermission?: string;
  requiredRole?: string;
  redirectTo?: string;
}

export const ProtectedRouteExample: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredPermission,
  requiredRole,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermissions();
  const { hasRole } = useRole();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  // Check role
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">
            Tu rol no tiene acceso a esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Example usage in routes:
 *
 * <Route path="/dashboard" element={
 *   <ProtectedRouteExample requireAuth>
 *     <Dashboard />
 *   </ProtectedRouteExample>
 * } />
 *
 * <Route path="/admin" element={
 *   <ProtectedRouteExample requiredRole="super_admin">
 *     <AdminPanel />
 *   </ProtectedRouteExample>
 * } />
 *
 * <Route path="/exercises/create" element={
 *   <ProtectedRouteExample requiredPermission="create_exercises">
 *     <CreateExercise />
 *   </ProtectedRouteExample>
 * } />
 */
