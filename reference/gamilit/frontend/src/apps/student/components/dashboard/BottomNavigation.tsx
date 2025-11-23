import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  ariaLabel: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    ariaLabel: 'Ir al Dashboard Principal',
  },
  {
    id: 'modules',
    label: 'Modules',
    icon: BookOpen,
    path: '/modules',
    ariaLabel: 'Ver Módulos Educativos',
  },
  {
    id: 'gamification',
    label: 'Gamification',
    icon: Trophy,
    path: '/gamification',
    ariaLabel: 'Ver Gamificación y Logros',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    ariaLabel: 'Ver Perfil de Usuario',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    ariaLabel: 'Abrir Configuración',
  },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-detective-bg-secondary shadow-lg md:hidden"
      role="navigation"
      aria-label="Navegación Principal"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-1 touch-manipulation"
              aria-label={item.ariaLabel}
              aria-currentStep={active ? 'page' : undefined}
            >
              {/* Ripple effect background */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-detective-bg rounded-lg"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon with animation */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: active ? 1.1 : 1,
                  y: active ? -2 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17,
                }}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    active
                      ? 'text-detective-orange'
                      : 'text-detective-text-secondary'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 text-xs font-medium transition-colors ${
                  active
                    ? 'text-detective-orange'
                    : 'text-detective-text-secondary'
                }`}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  className="absolute bottom-1 w-1 h-1 bg-detective-orange rounded-full"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
