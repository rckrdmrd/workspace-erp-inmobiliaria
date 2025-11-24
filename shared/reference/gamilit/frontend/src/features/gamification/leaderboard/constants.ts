/**
 * Leaderboard Constants
 *
 * Centralized configuration and constants for the leaderboard system
 */

import { Zap, BarChart3, Flame, Target, Crown, Medal, Trophy } from 'lucide-react';
import type { LeaderboardTypeVariant } from './LiveLeaderboard';

// ============================================================================
// LEADERBOARD TYPES CONFIGURATION
// ============================================================================

export const LEADERBOARD_TYPES = {
  XP: 'xp',
  COMPLETION: 'completion',
  STREAK: 'streak',
  DETECTIVE: 'detective'
} as const;

export interface LeaderboardTypeConfig {
  type: LeaderboardTypeVariant;
  label: string;
  shortLabel: string;
  icon: any;
  description: string;
  longDescription: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  sortKey: string;
  formatPattern: string;
  unit: string;
}

export const LEADERBOARD_TYPE_CONFIGS: Record<LeaderboardTypeVariant, LeaderboardTypeConfig> = {
  xp: {
    type: 'xp',
    label: 'XP Total',
    shortLabel: 'XP',
    icon: Zap,
    description: 'Clasificación por experiencia acumulada',
    longDescription: 'Ranking basado en la experiencia total ganada completando misiones, resolviendo casos y participando en actividades',
    color: '#eab308',
    gradientFrom: '#fbbf24',
    gradientTo: '#f59e0b',
    sortKey: 'xp',
    formatPattern: '{value} XP',
    unit: 'XP'
  },
  completion: {
    type: 'completion',
    label: 'Completado',
    shortLabel: 'Comp.',
    icon: BarChart3,
    description: 'Clasificación por porcentaje completado',
    longDescription: 'Ranking basado en el porcentaje de contenido completado, incluyendo misiones, lecciones y desafíos',
    color: '#10b981',
    gradientFrom: '#34d399',
    gradientTo: '#059669',
    sortKey: 'completionPercentage',
    formatPattern: '{value}%',
    unit: '%'
  },
  streak: {
    type: 'streak',
    label: 'Racha',
    shortLabel: 'Racha',
    icon: Flame,
    description: 'Clasificación por días consecutivos',
    longDescription: 'Ranking basado en la racha más larga de días consecutivos de actividad en la plataforma',
    color: '#f97316',
    gradientFrom: '#fb923c',
    gradientTo: '#ea580c',
    sortKey: 'streak',
    formatPattern: '{value} días',
    unit: 'días'
  },
  detective: {
    type: 'detective',
    label: 'Detective',
    shortLabel: 'Det.',
    icon: Target,
    description: 'Ranking general de detectives',
    longDescription: 'Ranking general que combina XP, completitud, racha y otros factores para determinar los mejores detectives',
    color: '#8b5cf6',
    gradientFrom: '#a78bfa',
    gradientTo: '#7c3aed',
    sortKey: 'score',
    formatPattern: '{value}',
    unit: 'puntos'
  }
};

// ============================================================================
// RANK TIERS CONFIGURATION
// ============================================================================

export interface RankTierConfig {
  tier: string;
  minRank: number;
  maxRank?: number;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: any;
  badge: string;
  description: string;
}

export const RANK_TIERS: RankTierConfig[] = [
  {
    tier: 'gold',
    minRank: 1,
    maxRank: 1,
    label: 'Oro',
    color: '#fbbf24',
    gradientFrom: '#fbbf24',
    gradientTo: '#f59e0b',
    icon: Crown,
    badge: '🥇',
    description: 'Primer lugar - El mejor detective'
  },
  {
    tier: 'silver',
    minRank: 2,
    maxRank: 2,
    label: 'Plata',
    color: '#d1d5db',
    gradientFrom: '#d1d5db',
    gradientTo: '#9ca3af',
    icon: Medal,
    badge: '🥈',
    description: 'Segundo lugar - Casi en la cima'
  },
  {
    tier: 'bronze',
    minRank: 3,
    maxRank: 3,
    label: 'Bronce',
    color: '#fb923c',
    gradientFrom: '#fb923c',
    gradientTo: '#ea580c',
    icon: Trophy,
    badge: '🥉',
    description: 'Tercer lugar - En el podio'
  },
  {
    tier: 'top10',
    minRank: 4,
    maxRank: 10,
    label: 'Top 10',
    color: '#a78bfa',
    gradientFrom: '#a78bfa',
    gradientTo: '#7c3aed',
    icon: Target,
    badge: '🏆',
    description: 'Entre los 10 mejores'
  },
  {
    tier: 'top50',
    minRank: 11,
    maxRank: 50,
    label: 'Top 50',
    color: '#60a5fa',
    gradientFrom: '#60a5fa',
    gradientTo: '#2563eb',
    icon: Target,
    badge: '⭐',
    description: 'Entre los 50 mejores'
  },
  {
    tier: 'standard',
    minRank: 51,
    label: 'Estándar',
    color: '#6b7280',
    gradientFrom: '#9ca3af',
    gradientTo: '#6b7280',
    icon: Target,
    badge: '👤',
    description: 'Clasificación estándar'
  }
];

// ============================================================================
// DISPLAY CONFIGURATION
// ============================================================================

export const DISPLAY_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 20,
  MIN_ITEMS_PER_PAGE: 5,
  MAX_ITEMS_PER_PAGE: 100,
  DEFAULT_REFRESH_INTERVAL: 30000, // 30 seconds
  MIN_REFRESH_INTERVAL: 5000, // 5 seconds
  MAX_REFRESH_INTERVAL: 300000, // 5 minutes
  ANIMATION_STAGGER_DELAY: 50, // milliseconds
  ANIMATION_DURATION: 300, // milliseconds
  TOP_RANKS_SPECIAL_ICONS: 3,
  PODIUM_SIZE: 3,
  LOADING_TIMEOUT: 5000, // 5 seconds
  ERROR_RETRY_DELAY: 3000, // 3 seconds
  MAX_RETRIES: 3
} as const;

// ============================================================================
// CHANGE INDICATORS
// ============================================================================

export interface ChangeIndicatorConfig {
  type: 'up' | 'down' | 'same' | 'new';
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  description: string;
}

export const CHANGE_INDICATORS: Record<string, ChangeIndicatorConfig> = {
  up: {
    type: 'up',
    label: 'Subió',
    color: '#10b981',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    icon: '↗',
    description: 'Mejoró su posición'
  },
  down: {
    type: 'down',
    label: 'Bajó',
    color: '#ef4444',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    icon: '↘',
    description: 'Descendió en la clasificación'
  },
  same: {
    type: 'same',
    label: 'Sin cambio',
    color: '#6b7280',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    icon: '—',
    description: 'Mantiene su posición'
  },
  new: {
    type: 'new',
    label: 'Nuevo',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    icon: '✨',
    description: 'Nueva entrada en la clasificación'
  }
};

// ============================================================================
// MOTIVATIONAL MESSAGES
// ============================================================================

export interface MotivationalMessage {
  condition: (rank: number, percentile: number) => boolean;
  message: string;
  emoji: string;
}

export const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  {
    condition: (rank) => rank === 1,
    message: '¡Eres el número 1! ¡Increíble trabajo!',
    emoji: '👑'
  },
  {
    condition: (rank) => rank === 2,
    message: '¡Casi en la cima! ¡Sigue así!',
    emoji: '🥈'
  },
  {
    condition: (rank) => rank === 3,
    message: '¡En el podio! ¡Excelente trabajo!',
    emoji: '🥉'
  },
  {
    condition: (rank) => rank <= 10,
    message: '¡En el Top 10! ¡Eres un crack!',
    emoji: '🏆'
  },
  {
    condition: (rank, percentile) => percentile >= 90,
    message: '¡En el Top 10%! ¡Impresionante!',
    emoji: '⭐'
  },
  {
    condition: (rank, percentile) => percentile >= 75,
    message: '¡En el Top 25%! ¡Muy bien!',
    emoji: '💪'
  },
  {
    condition: (rank, percentile) => percentile >= 50,
    message: '¡Por encima del promedio! ¡Vamos!',
    emoji: '📈'
  },
  {
    condition: (rank, percentile) => percentile >= 25,
    message: '¡Sigue escalando posiciones!',
    emoji: '🚀'
  },
  {
    condition: () => true,
    message: '¡Cada paso cuenta! ¡Adelante!',
    emoji: '💫'
  }
];

// ============================================================================
// API ENDPOINTS (for future integration)
// ============================================================================

export const API_ENDPOINTS = {
  GET_LEADERBOARD: '/api/leaderboard/:type',
  GET_USER_RANK: '/api/leaderboard/:type/user/:userId',
  GET_USER_STATS: '/api/leaderboard/stats/:userId',
  GET_TOP_N: '/api/leaderboard/:type/top/:n',
  GET_AROUND_RANK: '/api/leaderboard/:type/around/:rank',
  REFRESH_LEADERBOARD: '/api/leaderboard/:type/refresh'
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'No se pudo cargar la clasificación. Por favor, intenta nuevamente.',
  USER_NOT_FOUND: 'No se encontró tu posición en la clasificación.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  TIMEOUT: 'La solicitud tardó demasiado. Por favor, intenta nuevamente.',
  INVALID_DATA: 'Datos de clasificación inválidos.',
  UNAUTHORIZED: 'No tienes permiso para ver esta clasificación.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.'
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  LEADERBOARD_LOADED: 'Clasificación actualizada exitosamente',
  RANK_IMPROVED: '¡Felicidades! Tu posición mejoró',
  ENTERED_TOP_10: '¡Entraste al Top 10!',
  ENTERED_TOP_3: '¡Entraste al podio!',
  REACHED_FIRST: '¡Llegaste al primer lugar!',
  STREAK_MILESTONE: '¡Nuevo récord de racha!'
} as const;

// ============================================================================
// EMPTY STATE MESSAGES
// ============================================================================

export const EMPTY_STATE_MESSAGES = {
  NO_DATA: 'No hay datos disponibles',
  NO_PARTICIPANTS: 'Aún no hay participantes',
  NOT_RANKED: 'Aún no tienes una clasificación',
  LOADING: 'Cargando clasificación...',
  ERROR: 'Error al cargar la clasificación'
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  ENABLE_AUTO_REFRESH: true,
  ENABLE_ANIMATIONS: true,
  ENABLE_SHARE: true,
  ENABLE_EXPORT: true,
  ENABLE_USER_PROFILES: true,
  ENABLE_RANK_PREDICTIONS: false,
  ENABLE_ACHIEVEMENTS: true,
  ENABLE_NOTIFICATIONS: true,
  SHOW_PODIUM: true,
  SHOW_CHANGE_INDICATORS: true,
  SHOW_STATS_BREAKDOWN: true
} as const;

// ============================================================================
// THEME COLORS
// ============================================================================

export const THEME_COLORS = {
  primary: {
    blue: '#2563eb',
    orange: '#f97316',
    gold: '#fbbf24'
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af'
  },
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6'
  },
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db'
  },
  rank: {
    gold: '#fbbf24',
    silver: '#d1d5db',
    bronze: '#fb923c',
    top10: '#a78bfa',
    standard: '#6b7280'
  },
  change: {
    up: '#10b981',
    down: '#ef4444',
    same: '#6b7280',
    new: '#f59e0b'
  }
} as const;

// ============================================================================
// BREAKPOINTS (for responsive design)
// ============================================================================

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  modal: 50,
  tooltip: 100,
  notification: 200
} as const;
