import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@shared/utils';
import {
  Bell,
  Settings,
  LogOut,
  Crown,
  Star,
  Zap,
  Trophy,
  Medal,
  Gift,
  ChevronDown,
  Target,
  User as UserIcon,
  Building2,
  Coins,
} from 'lucide-react';
import type { User, UserGamificationData } from '@shared/types';
import { getUserFullName, getUserDisplayName } from '@features/auth/types/auth.types';

export interface Notification {
  id: string;
  type: 'achievement' | 'level_up' | 'badge_unlocked' | 'quest_complete' | 'reminder' | 'other';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    xp?: number;
    ml?: number;
  };
}

export interface GamifiedHeaderProps {
  user?: User;
  onLogout?: () => void;
  gamificationData?: UserGamificationData | null;
  organizationName?: string;
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  ml: number;
  rank: string;
  badges: string[];
  notifications: number;
}

export const GamifiedHeader: React.FC<GamifiedHeaderProps> = ({
  user,
  onLogout,
  gamificationData,
  organizationName,
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
      if (!target.closest('.user-menu-dropdown') && !target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use real gamification data or fallback to default values
  // Support both old (xp, ml, badges) and new (totalXP, mlCoins, achievements) field names for backward compatibility
  const userStats: UserStats = {
    level: gamificationData?.level || 1,
    xp: (gamificationData as any)?.totalXP || (gamificationData as any)?.xp || 0,
    xpToNext: (gamificationData as any)?.xp_to_next || 100, // Note: not in UserGamificationData type yet
    ml: (gamificationData as any)?.mlCoins || (gamificationData as any)?.ml || 0,
    rank: gamificationData?.rank || 'Detective Novato',
    badges: (gamificationData as any)?.achievements || (gamificationData as any)?.badges || [],
    notifications: notifications.filter((n) => !n.read).length,
  };

  const xpProgress = (userStats.xp / userStats.xpToNext) * 100;

  const badgeIcons: { [key: string]: React.ElementType } = {
    first_case: Trophy,
    streak_master: Zap,
    logic_champion: Crown,
    first_login: Star,
    first_module: Medal,
  };

  const getBadgeIcon = (badgeType: string) => {
    return badgeIcons[badgeType] || Star;
  };

  const getRankColor = (rank: string) => {
    const rankColors: { [key: string]: string } = {
      'Detective Senior': 'from-yellow-500 to-orange-500',
      'Detective Novato': 'from-green-500 to-teal-500',
      Inspector: 'from-blue-500 to-indigo-500',
      'Chief Inspector': 'from-purple-500 to-pink-500',
      Oficial: 'from-orange-500 to-red-500',
    };
    return rankColors[rank] || 'from-gray-500 to-gray-600';
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return Trophy;
      case 'level_up':
        return Star;
      case 'badge_unlocked':
        return Medal;
      case 'quest_complete':
        return Target;
      case 'reminder':
        return Bell;
      default:
        return Gift;
    }
  };

  const getNotificationBg = (notification: Notification) => {
    if (notification.read) return 'bg-gray-50 hover:bg-gray-100';
    switch (notification.type) {
      case 'achievement':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'level_up':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'badge_unlocked':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'quest_complete':
        return 'bg-green-50 hover:bg-green-100';
      case 'reminder':
        return 'bg-orange-50 hover:bg-orange-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <header className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-900/25 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Branding */}
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl" aria-hidden="true">
                🕵️‍♂️
              </span>
              <div>
                <h1 className="text-xl font-bold text-white">GAMILIT</h1>
                <p className="text-xs text-orange-100">Detectives de la Lectura</p>
              </div>
            </Link>

            {/* Current Organization Display */}
            {organizationName && (
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <Building2 className="w-4 h-4 text-white/90" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium truncate max-w-32">
                  {organizationName}
                </span>
              </div>
            )}
          </div>

          {/* Sistema de Gamificación Central */}
          <div className="flex items-center space-x-6">
            {/* XP y Nivel */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                  <span className="text-lg font-bold text-white">Lvl {userStats.level}</span>
                </div>
                <div className="w-24 bg-white/20 rounded-full h-2 mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                  />
                </div>
                <span className="text-xs text-orange-100">
                  {userStats.xp} / {userStats.xpToNext} XP
                </span>
              </div>
            </div>

            {/* ML Counter */}
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-200 shadow-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm"
              >
                <Coins className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-green-700">{userStats.ml.toLocaleString()}</span>
            </div>

            {/* Rank Badge */}
            <div
              className={cn(
                'hidden sm:flex items-center space-x-1 bg-gradient-to-r text-white px-3 py-1 rounded-full shadow-md',
                getRankColor(userStats.rank)
              )}
            >
              <Crown className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-semibold">{userStats.rank}</span>
            </div>

            {/* Achievement Badges */}
            {userStats.badges.length > 0 && (
              <div className="hidden xl:flex items-center space-x-1">
                {userStats.badges.slice(0, 3).map((badgeType, index) => {
                  const IconComponent = getBadgeIcon(badgeType);
                  return (
                    <motion.div
                      key={badgeType}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 12,
                      }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                      title={`Badge: ${badgeType.replace(/_/g, ' ')}`}
                    >
                      <IconComponent className="w-4 h-4 text-white" />
                    </motion.div>
                  );
                })}
                {userStats.badges.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-md text-white text-xs font-bold">
                    +{userStats.badges.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controles de Usuario */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <div className="relative notification-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-button relative p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label={`Notificaciones${userStats.notifications > 0 ? ` (${userStats.notifications} sin leer)` : ''}`}
              >
                <Bell className="w-5 h-5 text-white" />
                {userStats.notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                  >
                    {userStats.notifications > 9 ? '9+' : userStats.notifications}
                  </motion.div>
                )}
              </motion.button>

              {/* Dropdown de Notificaciones */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="text-center py-4">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No hay notificaciones</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {notifications.map((notification) => {
                            const IconComponent = getNotificationIcon(notification.type);
                            return (
                              <button
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                  'w-full text-left flex items-start space-x-3 p-3 rounded-lg transition-colors',
                                  getNotificationBg(notification)
                                )}
                              >
                                <IconComponent
                                  className="w-5 h-5 mt-0.5"
                                  aria-hidden="true"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p
                                      className={cn(
                                        'text-sm font-medium',
                                        notification.read ? 'text-gray-600' : 'text-gray-800'
                                      )}
                                    >
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p
                                    className={cn(
                                      'text-xs',
                                      notification.read ? 'text-gray-500' : 'text-gray-600'
                                    )}
                                  >
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-400">{notification.timestamp}</p>
                                    {notification.metadata &&
                                      (notification.metadata.xp || notification.metadata.ml) && (
                                        <div className="flex items-center space-x-2">
                                          {notification.metadata.xp && (
                                            <span className="text-xs text-yellow-600 font-medium">
                                              +{notification.metadata.xp} XP
                                            </span>
                                          )}
                                          {notification.metadata.ml && (
                                            <span className="text-xs text-green-600 font-medium">
                                              +{notification.metadata.ml} ML
                                            </span>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {notifications.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Link
                            to="/notifications"
                            className="w-full text-center block text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                            onClick={() => setShowNotifications(false)}
                          >
                            Ver todas las notificaciones
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu de Usuario */}
            <div className="relative user-menu-dropdown">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-menu-button flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                aria-label="Menú de usuario"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user ? getUserFullName(user).charAt(0) : 'U'}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user ? getUserFullName(user) : 'Detective'}
                  </p>
                  <p className="text-xs text-orange-100 capitalize">
                    {user?.role || 'student'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-white" />
              </motion.button>

              {/* Dropdown del Usuario */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                  >
                    {/* Header del menú */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold truncate">
                            {user ? getUserFullName(user) : 'Detective'}
                          </p>
                          <p className="text-white/80 text-sm truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Mi Perfil</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Configuración</span>
                      </Link>
                      <Link
                        to="/achievements"
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Trophy className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Mis Logros</span>
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-2 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

GamifiedHeader.displayName = 'GamifiedHeader';
