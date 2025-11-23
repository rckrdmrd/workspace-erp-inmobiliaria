import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { User as UserType } from '@/shared/types/auth.types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onMenuToggle: () => void;
}

/**
 * Header Component
 * Top navigation bar with user menu and mobile hamburger
 *
 * Features:
 * - Logo/brand on left
 * - User avatar + name with dropdown menu
 * - Notification bell (placeholder)
 * - Mobile hamburger menu button
 * - Click-outside to close dropdown
 * - Keyboard navigation support
 *
 * @param user - Current user from AuthContext
 * @param onLogout - Logout callback
 * @param onMenuToggle - Callback to toggle mobile sidebar
 *
 * @example
 * ```tsx
 * <Header
 *   user={user}
 *   onLogout={logout}
 *   onMenuToggle={() => setIsSidebarOpen(true)}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile hamburger menu */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Center/Left: Page title or search (placeholder) */}
        <div className="flex-1 flex items-center lg:ml-0 ml-4">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Right: Notifications + User menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications bell */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg',
                'transition-colors hover:bg-gray-100',
                isDropdownOpen && 'bg-gray-100'
              )}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getUserInitials()}
                </span>
              </div>

              {/* User info (hidden on mobile) */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Student'}</p>
              </div>

              <ChevronDown
                className={cn(
                  'w-4 h-4 text-gray-500 transition-transform hidden md:block',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                {/* User info (mobile) */}
                <div className="md:hidden px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    Role: {user?.role || 'Student'}
                  </p>
                </div>

                {/* Menu items */}
                <a
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">My Profile</span>
                </a>

                <a
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Settings</span>
                </a>

                <div className="border-t border-gray-200 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
