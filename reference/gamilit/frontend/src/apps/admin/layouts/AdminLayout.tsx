import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import GamilitSidebar from '@shared/components/layout/GamilitSidebar';
import type { User as UserType, UserGamificationData } from '@shared/types';

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: UserType;
  gamificationData?: UserGamificationData | null;
  organizationName?: string;
  onLogout?: () => void;
}

/**
 * AdminLayout - Layout con sidebar para la aplicación de Admin
 *
 * Proporciona una estructura consistente con:
 * - Header gamificado con información del usuario
 * - Sidebar de navegación con secciones de Admin
 * - Área de contenido principal responsive
 * - Soporte para mobile con overlay
 *
 * @component
 * @example
 * ```tsx
 * <AdminLayout user={user} onLogout={handleLogout}>
 *   <AdminDashboard />
 * </AdminLayout>
 * ```
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  user,
  gamificationData,
  organizationName,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      {/* Header */}
      <GamifiedHeader
        user={user}
        gamificationData={gamificationData}
        organizationName={organizationName}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <GamilitSidebar
          isOpen={isSidebarOpen}
          userRole="admin"
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-40 p-3 bg-detective-orange text-white rounded-full shadow-lg hover:bg-detective-orange/90 transition-colors"
          aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-80' : ''
          }`}
        >
          <div className="detective-container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
