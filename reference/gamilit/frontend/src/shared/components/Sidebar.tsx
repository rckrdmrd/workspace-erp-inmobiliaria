import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  Trophy,
  Medal,
  Target,
  User,
  X,
  BookOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'My Progress',
    path: '/progress',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: 'Achievements',
    path: '/achievements',
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    label: 'Leaderboard',
    path: '/leaderboard',
    icon: <Medal className="w-5 h-5" />,
  },
  {
    label: 'Missions',
    path: '/missions',
    icon: <Target className="w-5 h-5" />,
  },
  {
    label: 'Learning',
    path: '/learning',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <User className="w-5 h-5" />,
  },
];

const secondaryItems: NavItem[] = [
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

/**
 * Sidebar Component
 * Navigation sidebar with responsive behavior
 *
 * Features:
 * - Active link highlighting
 * - Mobile-friendly with overlay
 * - Icons from lucide-react
 * - Smooth transitions
 * - Collapsible on mobile
 * - Badge support for notifications
 *
 * @param isOpen - Whether sidebar is open (mobile)
 * @param onClose - Callback to close sidebar (mobile)
 *
 * @example
 * ```tsx
 * const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 *
 * <Sidebar
 *   isOpen={isSidebarOpen}
 *   onClose={() => setIsSidebarOpen(false)}
 * />
 * ```
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-64 bg-white border-r border-gray-200',
          'transform transition-transform duration-300 ease-in-out',
          'lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'flex flex-col h-screen'
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2"
            onClick={onClose}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GAMILIT</span>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg',
                  'text-sm font-medium transition-colors',
                  'group relative',
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive(item.path)
                        ? 'text-primary-700'
                        : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {/* Badge */}
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full">
                    {item.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Secondary navigation */}
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg',
                  'text-sm font-medium transition-colors',
                  'group relative',
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      'transition-colors',
                      isActive(item.path)
                        ? 'text-primary-700'
                        : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full">
                    {item.badge}
                  </span>
                )}

                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-full" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer - Version or help link */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>GAMILIT v1.0.0</p>
            <p className="mt-1">Made with ❤️ for learners</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
