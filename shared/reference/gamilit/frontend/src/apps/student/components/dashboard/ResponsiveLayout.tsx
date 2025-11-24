import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useResponsiveLayout, useKeyboardShortcuts } from '../../hooks/useResponsiveLayout';
import { BottomNavigation } from './BottomNavigation';
import { useNavigate } from 'react-router-dom';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showBottomNav?: boolean;
}

export function ResponsiveLayout({
  children,
  sidebar,
  showBottomNav = true,
}: ResponsiveLayoutProps) {
  const layout = useResponsiveLayout();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'g h': () => navigate('/'),
    'g m': () => navigate('/modules'),
    'g p': () => navigate('/profile'),
    'g g': () => navigate('/gamification'),
    'g s': () => navigate('/settings'),
  });

  // Auto-close sidebar on mobile when clicking outside
  React.useEffect(() => {
    if (layout.isMobile && sidebarOpen) {
      const handleClickOutside = () => setSidebarOpen(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [layout.isMobile, sidebarOpen]);

  const getGridColumns = () => {
    if (layout.isWide) return 'grid-cols-1 lg:grid-cols-4';
    if (layout.isDesktop) return 'grid-cols-1 lg:grid-cols-3';
    if (layout.isTablet) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1';
  };

  const getSidebarWidth = () => {
    if (layout.isWide || layout.isDesktop) return 'w-80';
    if (layout.isTablet) return 'w-80';
    return 'w-80';
  };

  return (
    <div className="min-h-screen bg-detective-gradient">
      {/* Skip to main content link (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-detective-orange focus:text-white focus:rounded-lg"
      >
        Saltar al contenido principal
      </a>

      <div className="flex min-h-screen">
        {/* Sidebar for tablet+ */}
        {sidebar && (layout.isTablet || layout.isDesktop || layout.isWide) && (
          <>
            {/* Tablet collapsible sidebar */}
            {layout.isTablet && (
              <>
                {/* Hamburger button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSidebarOpen(!sidebarOpen);
                  }}
                  className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden touch-manipulation min-w-[44px] min-h-[44px]"
                  aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
                  aria-expanded={sidebarOpen}
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6 text-detective-text" />
                  ) : (
                    <Menu className="w-6 h-6 text-detective-text" />
                  )}
                </button>

                {/* Backdrop */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 z-40 md:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {/* Sidebar */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.aside
                      initial={{ x: -280 }}
                      animate={{ x: 0 }}
                      exit={{ x: -280 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className={`fixed top-0 left-0 bottom-0 ${getSidebarWidth()} bg-white shadow-xl z-40 overflow-y-auto`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4">{sidebar}</div>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Desktop/Wide permanent sidebar */}
            {(layout.isDesktop || layout.isWide) && (
              <aside
                className={`${getSidebarWidth()} bg-white shadow-xl overflow-y-auto flex-shrink-0`}
              >
                <div className="p-4 sticky top-0">{sidebar}</div>
              </aside>
            )}
          </>
        )}

        {/* Main content */}
        <main
          id="main-content"
          className={`flex-1 ${
            layout.isMobile && showBottomNav ? 'pb-20' : ''
          } focus:outline-none`}
          tabIndex={-1}
        >
          <div className="detective-container py-6 md:py-8">
            {/* Content with responsive grid */}
            <div className={`grid ${getGridColumns()} gap-4 md:gap-6`}>
              {children}
            </div>
          </div>
        </main>

        {/* Wide screen activity panel */}
        {layout.isWide && (
          <aside className="w-80 bg-white shadow-xl overflow-y-auto flex-shrink-0">
            <div className="p-4 sticky top-0">
              <h2 className="text-lg font-bold text-detective-text mb-4">
                Actividad Reciente
              </h2>
              {/* Activity panel content would go here */}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom navigation for mobile */}
      {showBottomNav && layout.isMobile && <BottomNavigation />}

      {/* Keyboard shortcuts hint */}
      {(layout.isDesktop || layout.isWide) && (
        <div className="fixed bottom-4 right-4 text-xs text-detective-text-secondary bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <p className="font-semibold mb-1">Atajos de teclado:</p>
          <ul className="space-y-0.5">
            <li>
              <kbd className="px-1 py-0.5 bg-detective-bg rounded">g h</kbd> Home
            </li>
            <li>
              <kbd className="px-1 py-0.5 bg-detective-bg rounded">g m</kbd> Módulos
            </li>
            <li>
              <kbd className="px-1 py-0.5 bg-detective-bg rounded">g p</kbd> Perfil
            </li>
          </ul>
        </div>
      )}

      {/* Orientation change notice */}
      {layout.isMobile && layout.orientation === 'landscape' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-4 right-4 p-4 bg-detective-orange text-white rounded-lg shadow-lg z-40"
        >
          <p className="text-sm font-medium text-center">
            Para una mejor experiencia, rota tu dispositivo a modo vertical
          </p>
        </motion.div>
      )}
    </div>
  );
}

export function DashboardGrid({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>{children}</div>
  );
}

export function DashboardSection({
  title,
  children,
  action,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-detective-text">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
